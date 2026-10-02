import { Request, Response } from 'express';
import authService from '../services/auth.service';
import catchAsync from '../utils/catchAsync';
import {
  userValidator,
  signupStep1Validator,
  verifyOtpValidator,
  resendOtpValidator,
  loginValidator,
  loginVerifyValidator,
  googleAuthValidator,
} from '../validation/user.validate';
import { ZodError } from 'zod';
import httpStatus from 'http-status';
import userService from '../services/user.service';
import { CustomRequest } from '../middleware/auth.middleware';

/**
 * Step 1: User Signup - Accepts details and dispatches 6-digit SendPulse OTP
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  try {
    signupStep1Validator.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: err.errors.map((e) => e.message).join(', '),
        data: null,
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Validation failed',
      data: null,
    });
  }

  const result = await authService.registerStep1(req.body);
  return res.status(result.status).json({
    status: result.status,
    message: result.message,
    data: result.data,
  });
});

/**
 * Step 2: Code Verification - Validates 6-digit OTP code & activates account
 */
export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  try {
    verifyOtpValidator.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: err.errors.map((e) => e.message).join(', '),
        data: null,
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Validation failed',
      data: null,
    });
  }

  const result = await authService.verifyOtp(req.body);
  return res.status(result.status).json({
    status: result.status,
    message: result.message,
    data: result.data,
  });
});

/**
 * Resend OTP Code
 */
export const resendOtp = catchAsync(async (req: Request, res: Response) => {
  try {
    resendOtpValidator.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: err.errors.map((e) => e.message).join(', '),
        data: null,
      });
    }
  }

  const result = await authService.resendOtp(req.body.email);
  return res.status(result.status).json({
    status: result.status,
    message: result.message,
    data: result.data,
  });
});

/**
 * Step 1: Login - Accepts email and dispatches 6-digit SendPulse OTP
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  try {
    loginValidator.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: err.errors.map((e) => e.message).join(', '),
        data: null,
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Validation failed',
      data: null,
    });
  }

  const result = await authService.loginStep1(req.body.email);

  return res.status(result.status).json({
    status: result.status,
    message: result.message,
    data: result.data,
  });
});

/**
 * Step 2: Login Code Verification - Validates 6-digit OTP code & issues JWT session token
 */
export const loginVerify = catchAsync(async (req: Request, res: Response) => {
  try {
    loginVerifyValidator.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: err.errors.map((e) => e.message).join(', '),
        data: null,
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Validation failed',
      data: null,
    });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || req.ip;
  const userAgent = req.headers['user-agent'];

  const result = await authService.verifyLoginOtp({
    ...req.body,
    ip: clientIp,
    userAgent,
  });

  return res.status(result.status).json({
    status: result.status,
    message: result.message,
    data: result.data,
  });
});

/**
 * Resend Login Code
 */
export const loginResend = catchAsync(async (req: Request, res: Response) => {
  try {
    resendOtpValidator.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: err.errors.map((e) => e.message).join(', '),
        data: null,
      });
    }
  }

  const result = await authService.resendOtp(req.body.email);

  return res.status(result.status).json({
    status: result.status,
    message: result.message,
    data: result.data,
  });
});

// Endpoint to retrieve user's data from Auth Token
export const me = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: 'User not found in request',
        data: null,
      });
    }
    const user = await userService.getUserById(req.user._id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: 'User not found',
        data: null,
      });
    }
    const userObj = user.toObject();
    delete userObj.otp;
    delete userObj.otpExpiresAt;

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: 'User fetched successfully',
      data: userObj,
    });
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: null,
    });
  }
};

/**
 * Logout User
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  return res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Logged out successfully',
    data: null,
  });
});

/**
 * Google Authentication - Handles Google token/credential or direct OAuth
 */
export const googleLogin = catchAsync(async (req: Request, res: Response) => {
  try {
    googleAuthValidator.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: err.errors.map((e) => e.message).join(', '),
        data: null,
      });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Validation failed',
      data: null,
    });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || req.ip;
  const userAgent = req.headers['user-agent'];

  const result = await authService.googleAuth({
    ...req.body,
    ip: clientIp,
    userAgent,
  });

  return res.status(result.status).json({
    status: result.status,
    message: result.message,
    data: result.data,
  });
});