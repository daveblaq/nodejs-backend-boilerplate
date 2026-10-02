import { z } from 'zod';

export const userValidator = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  country: z.string().min(1, 'Country is required').trim(),
  role: z.string().optional(),
  isVIP: z.boolean().optional(),
  vipType: z.string().optional(),
});

// Step 1: Registration Details
export const signupStep1Validator = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  country: z.string().min(1, 'Country is required').trim(),
});

export type SignupStep1Input = z.infer<typeof signupStep1Validator>;

// Step 2: Code / OTP Verification
export const verifyOtpValidator = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  code: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits').optional(),
  otp: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits').optional(),
}).refine((data) => data.code || data.otp, {
  message: 'Verification code is required',
  path: ['code'],
});

export type VerifyOtpInput = z.infer<typeof verifyOtpValidator>;

// Resend OTP
export const resendOtpValidator = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
});

export type ResendOtpInput = z.infer<typeof resendOtpValidator>;

// Login Validator (email-based OTP login)
export const loginValidator = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
});

export type LoginInput = z.infer<typeof loginValidator>;

// Login Step 2: Code Verification
export const loginVerifyValidator = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  code: z.string().min(6, 'Authentication code must be 6 digits').max(6, 'Authentication code must be 6 digits').optional(),
  otp: z.string().min(6, 'Authentication code must be 6 digits').max(6, 'Authentication code must be 6 digits').optional(),
}).refine((data) => data.code || data.otp, {
  message: 'Authentication code is required',
  path: ['code'],
});

export type LoginVerifyInput = z.infer<typeof loginVerifyValidator>;

// Google OAuth Validator
export const googleAuthValidator = z.object({
  credential: z.string().optional(),
  accessToken: z.string().optional(),
  email: z.string().email('Invalid email address').trim().toLowerCase().optional(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  avatar: z.string().url().or(z.string()).optional(),
  country: z.string().optional(),
  googleId: z.string().optional(),
}).refine((data) => data.credential || data.accessToken || data.email, {
  message: 'Google credential, access token, or email is required',
  path: ['credential'],
});

export type GoogleAuthInput = z.infer<typeof googleAuthValidator>;

export const userUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  country: z.string().optional(),
  role: z.string().optional(),
  isVIP: z.boolean().optional(),
  vipType: z.string().optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;