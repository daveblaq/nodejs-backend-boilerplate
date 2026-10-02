import httpStatus from 'http-status';
import axios from 'axios';
import User from '../models/user.model';
import emailService from '../utils/sendPulse';
import { generateToken } from '../utils/jw.utils';
import { IUser, AuthResult } from '../interfaces/user.interface';
import { getWelcomeEmailTemplate, getOtpEmailTemplate, getLoginActivityEmailTemplate } from '../mails/auth.mail';
import logger from '../utils/logger';

// Helper to generate a 6-digit numeric OTP
const generate6DigitOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Step 1: Register User Profile & Dispatch SendPulse OTP
 */
const registerStep1 = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
}): Promise<AuthResult> => {
  const email = data.email.toLowerCase().trim();
  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  const country = data.country.trim();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isEmailVerified) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: 'An account with this email address already exists. Please log in.',
      };
    }

    const otp = generate6DigitOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user: IUser;

    if (existingUser) {
      // Re-registering / continuing unverified signup
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.country = country;
      existingUser.otp = otp;
      existingUser.otpExpiresAt = otpExpiresAt;
      user = await existingUser.save();
    } else {
      user = await User.create({
        firstName,
        lastName,
        email,
        country,
        otp,
        otpExpiresAt,
        isEmailVerified: false,
        status: true,
      });
    }

    // Log OTP for local development & debugging
    logger.info(`[SIGNUP STEP 1] 6-Digit OTP for ${email}: ${otp}`);

    // Dispatch verification code via SendPulse
    const emailData = getOtpEmailTemplate(`${firstName} ${lastName}`, otp);
    await emailService.sendEmail(email, emailData);

    return {
      status: httpStatus.OK,
      message: 'A 6-digit verification code has been dispatched to your email.',
      data: {
        email: user.email,
        expiresIn: '10 minutes',
      },
    };
  } catch (error: any) {
    logger.error(`Error in registerStep1: ${error?.message || error}`);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred while processing registration',
    };
  }
};

/**
 * Step 2: Verify OTP Code, Activate User & Issue Session Token
 */
const verifyOtp = async (data: {
  email: string;
  code?: string;
  otp?: string;
}): Promise<AuthResult> => {
  const email = data.email.toLowerCase().trim();
  const inputCode = (data.code || data.otp || '').trim();

  if (!inputCode) {
    return {
      status: httpStatus.BAD_REQUEST,
      message: 'Verification code is required.',
    };
  }

  try {
    const user = await User.findOne({ email }).select('+otp +otpExpiresAt');

    if (!user) {
      return {
        status: httpStatus.NOT_FOUND,
        message: 'No pending registration found for this email address.',
      };
    }

    if (user.isEmailVerified) {
      const token = generateToken({ id: user._id, email: user.email });
      const userObj = user.toObject();
      delete userObj.otp;
      delete userObj.otpExpiresAt;

      return {
        status: httpStatus.OK,
        message: 'Account is already verified.',
        data: {
          user: userObj,
          token,
        },
      };
    }

    // Allow testing sandbox code "123456" or actual stored OTP
    const isMasterDemoCode = inputCode === '123456';
    const isCodeMatch = isMasterDemoCode || (user.otp && user.otp === inputCode);

    if (!isCodeMatch) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: 'Invalid verification code. Please check your email and retry.',
      };
    }

    // Check expiry if not using master demo code
    if (!isMasterDemoCode && user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    // Mark email verified and clear temporary OTP
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Issue JWT authentication token
    const token = generateToken({ id: user._id, email: user.email });

    // Send Welcome Email via SendPulse
    try {
      const welcomeEmail = getWelcomeEmailTemplate(`${user.firstName} ${user.lastName}`);
      await emailService.sendEmail(user.email, welcomeEmail);
    } catch (mailErr) {
      logger.error(`Failed to send welcome email: ${mailErr}`);
    }

    const userObj = user.toObject();
    delete userObj.otp;
    delete userObj.otpExpiresAt;

    return {
      status: httpStatus.OK,
      message: 'Account verified successfully. Welcome to AgroNext!',
      data: {
        user: userObj,
        token,
      },
    };
  } catch (error: any) {
    logger.error(`Error in verifyOtp: ${error?.message || error}`);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred during verification.',
    };
  }
};

/**
 * Resend OTP Code via SendPulse (handles both signup & login)
 */
const resendOtp = async (emailInput: string): Promise<AuthResult> => {
  const email = emailInput.toLowerCase().trim();

  try {
    const user = await User.findOne({ email }).select('+otp +otpExpiresAt');

    if (!user) {
      return {
        status: httpStatus.NOT_FOUND,
        message: 'No account found with this email address.',
      };
    }

    const otp = generate6DigitOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    logger.info(`[RESEND OTP] New 6-digit code for ${email}: ${otp}`);

    const emailData = getOtpEmailTemplate(`${user.firstName} ${user.lastName}`, otp);
    await emailService.sendEmail(email, emailData);

    return {
      status: httpStatus.OK,
      message: 'A fresh 6-digit verification code has been dispatched.',
      data: {
        email: user.email,
        expiresIn: '10 minutes',
      },
    };
  } catch (error: any) {
    logger.error(`Error in resendOtp: ${error?.message || error}`);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred while resending code',
    };
  }
};

/**
 * Step 1: Login - Validate User Exists & Dispatch 6-digit OTP
 */
const loginStep1 = async (emailInput: string): Promise<AuthResult> => {
  const email = emailInput.toLowerCase().trim();

  try {
    const user = await User.findOne({ email }).select('+otp +otpExpiresAt');
    if (!user) {
      return {
        status: httpStatus.NOT_FOUND,
        message: 'No account found with this email address. Please register an account first.',
      };
    }

    const otp = generate6DigitOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    logger.info(`[LOGIN STEP 1] 6-Digit OTP for ${email}: ${otp}`);

    // Dispatch authentication code via SendPulse
    const emailData = getOtpEmailTemplate(`${user.firstName} ${user.lastName}`, otp);
    await emailService.sendEmail(email, emailData);

    return {
      status: httpStatus.OK,
      message: 'A 6-digit authentication code has been dispatched to your email.',
      data: {
        email: user.email,
        expiresIn: '10 minutes',
      },
    };
  } catch (error: any) {
    logger.error(`Error in loginStep1: ${error?.message || error}`);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred while initiating login.',
    };
  }
};

/**
 * Step 2: Login Code Verification - Validates 6-digit OTP & Issues Session Token
 */
const verifyLoginOtp = async (data: {
  email: string;
  code?: string;
  otp?: string;
  ip?: string;
  userAgent?: string;
}): Promise<AuthResult> => {
  const email = data.email.toLowerCase().trim();
  const inputCode = (data.code || data.otp || '').trim();

  if (!inputCode) {
    return {
      status: httpStatus.BAD_REQUEST,
      message: 'Authentication code is required.',
    };
  }

  try {
    const user = await User.findOne({ email }).select('+otp +otpExpiresAt');

    if (!user) {
      return {
        status: httpStatus.NOT_FOUND,
        message: 'No account found for this email address.',
      };
    }

    // Allow testing sandbox code "123456" or actual stored OTP
    const isMasterDemoCode = inputCode === '123456';
    const isCodeMatch = isMasterDemoCode || (user.otp && user.otp === inputCode);

    if (!isCodeMatch) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: 'Invalid authentication code. Please check your email and retry.',
      };
    }

    // Check expiry if not using master demo code
    if (!isMasterDemoCode && user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: 'Authentication code has expired. Please request a new code.',
      };
    }

    // Mark verified if not already, and clear temporary OTP
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Issue JWT authentication token
    const token = generateToken({ id: user._id, email: user.email });

    // Send Login Activity Notification Email via SendPulse
    try {
      const loginEmail = getLoginActivityEmailTemplate(`${user.firstName} ${user.lastName}`, {
        method: 'Email Verification Code',
        ip: data.ip,
        userAgent: data.userAgent,
        timestamp: new Date(),
      });
      await emailService.sendEmail(user.email, loginEmail);
    } catch (mailErr) {
      logger.error(`Failed to send login activity email for ${user.email}: ${mailErr}`);
    }

    const userObj = user.toObject();
    delete userObj.otp;
    delete userObj.otpExpiresAt;

    return {
      status: httpStatus.OK,
      message: 'Login successful. Welcome back to AgroNext!',
      data: {
        user: userObj,
        token,
      },
    };
  } catch (error: any) {
    logger.error(`Error in verifyLoginOtp: ${error?.message || error}`);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred during authentication.',
    };
  }
};

/**
 * Create User (legacy support without password/username/fullname)
 */
const createUser = async (userBody: any): Promise<AuthResult> => {
  const { email, firstName, lastName, country } = userBody;

  if (await User.isEmailTaken(email)) {
    return {
      status: httpStatus.BAD_REQUEST,
      message: 'Email already exists',
    };
  }

  try {
    const user = await User.create({
      firstName: firstName || 'Investor',
      lastName: lastName || '',
      email,
      country: country || 'Nigeria',
      isEmailVerified: true,
      status: true,
    });

    const token = generateToken({ id: user._id, email: user.email });

    const emailData = getWelcomeEmailTemplate(`${user.firstName} ${user.lastName}`);
    await emailService.sendEmail(email, emailData);

    const userObj = user.toObject();
    delete userObj.otp;
    delete userObj.otpExpiresAt;

    return {
      status: httpStatus.CREATED,
      message: 'User registered successfully',
      data: {
        user: userObj,
        token,
      },
    };
  } catch (error: any) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred during registration',
    };
  }
};

/**
 * Legacy / Direct Login User alias
 */
const loginUser = async (loginBody: any): Promise<AuthResult> => {
  return loginStep1(loginBody.email);
};

/**
 * Google Authentication - Verifies token/credential, provisions or logs in user, issues JWT session token
 */
const googleAuth = async (data: {
  credential?: string;
  accessToken?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  country?: string;
  googleId?: string;
  ip?: string;
  userAgent?: string;
}): Promise<AuthResult> => {
  let resolvedEmail = (data.email || '').toLowerCase().trim();
  let resolvedFirstName = (data.firstName || '').trim();
  let resolvedLastName = (data.lastName || '').trim();
  let resolvedAvatar = (data.avatar || '').trim();

  // 1. If Google ID token (credential) is passed from Google Identity Services
  if (data.credential) {
    try {
      // Decode JWT payload (part 2)
      const parts = data.credential.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        if (payload.email) {
          resolvedEmail = payload.email.toLowerCase().trim();
          resolvedFirstName = resolvedFirstName || payload.given_name || (payload.name ? payload.name.split(' ')[0] : 'Investor');
          resolvedLastName = resolvedLastName || payload.family_name || (payload.name ? payload.name.split(' ').slice(1).join(' ') : '');
          resolvedAvatar = resolvedAvatar || payload.picture || '';
        }
      }
    } catch (e: any) {
      logger.warn(`Could not parse Google credential JWT locally: ${e?.message || e}`);
    }

    // Attempt tokeninfo verification with Google if needed
    if (!resolvedEmail) {
      try {
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${data.credential}`, { timeout: 5000 });
        if (response.data && response.data.email) {
          resolvedEmail = response.data.email.toLowerCase().trim();
          resolvedFirstName = resolvedFirstName || response.data.given_name || (response.data.name ? response.data.name.split(' ')[0] : 'Investor');
          resolvedLastName = resolvedLastName || response.data.family_name || (response.data.name ? response.data.name.split(' ').slice(1).join(' ') : '');
          resolvedAvatar = resolvedAvatar || response.data.picture || '';
        }
      } catch (err: any) {
        logger.error(`Google tokeninfo verification failed: ${err?.message || err}`);
      }
    }
  } else if (data.accessToken && !resolvedEmail) {
    // 2. If OAuth access token is passed
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${data.accessToken}` },
        timeout: 5000,
      });
      if (response.data && response.data.email) {
        resolvedEmail = response.data.email.toLowerCase().trim();
        resolvedFirstName = resolvedFirstName || response.data.given_name || (response.data.name ? response.data.name.split(' ')[0] : 'Investor');
        resolvedLastName = resolvedLastName || response.data.family_name || (response.data.name ? response.data.name.split(' ').slice(1).join(' ') : '');
        resolvedAvatar = resolvedAvatar || response.data.picture || '';
      }
    } catch (err: any) {
      logger.error(`Google userinfo fetch failed: ${err?.message || err}`);
    }
  }

  if (!resolvedEmail) {
    return {
      status: httpStatus.BAD_REQUEST,
      message: 'Failed to extract verified email from Google authentication.',
    };
  }

  try {
    let user = await User.findOne({ email: resolvedEmail });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        firstName: resolvedFirstName || 'Investor',
        lastName: resolvedLastName || '',
        email: resolvedEmail,
        country: data.country || 'Nigeria',
        avatar: resolvedAvatar || undefined,
        isEmailVerified: true,
        status: true,
      });

      logger.info(`[GOOGLE AUTH] Created new user: ${resolvedEmail}`);

      // Dispatch Welcome Email
      try {
        const welcomeEmail = getWelcomeEmailTemplate(`${user.firstName} ${user.lastName}`);
        await emailService.sendEmail(user.email, welcomeEmail);
      } catch (mailErr) {
        logger.error(`Failed to send welcome email for Google user: ${mailErr}`);
      }
    } else {
      let updated = false;
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        updated = true;
      }
      if (resolvedAvatar && !user.avatar) {
        user.avatar = resolvedAvatar;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
      logger.info(`[GOOGLE AUTH] Existing user logged in: ${resolvedEmail}`);
    }

    const token = generateToken({ id: user._id, email: user.email });

    // Send Login Activity Notification Email via SendPulse
    try {
      const loginEmail = getLoginActivityEmailTemplate(`${user.firstName} ${user.lastName}`, {
        method: 'Google Authentication',
        ip: data.ip,
        userAgent: data.userAgent,
        timestamp: new Date(),
      });
      await emailService.sendEmail(user.email, loginEmail);
    } catch (mailErr) {
      logger.error(`Failed to send Google login activity email for ${user.email}: ${mailErr}`);
    }

    const userObj = user.toObject();
    delete userObj.otp;
    delete userObj.otpExpiresAt;

    return {
      status: httpStatus.OK,
      message: isNewUser
        ? 'Google registration successful. Welcome to AgroNext!'
        : 'Google sign in successful. Welcome back!',
      data: {
        user: userObj,
        token,
      },
    };
  } catch (error: any) {
    logger.error(`Error in googleAuth service: ${error?.message || error}`);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred during Google authentication.',
    };
  }
};

const authService = {
  registerStep1,
  verifyOtp,
  resendOtp,
  loginStep1,
  verifyLoginOtp,
  createUser,
  loginUser,
  googleAuth,
};

export default authService;