import express from 'express';
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  loginVerify,
  loginResend,
  logout,
  googleLogin,
  me,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/auth/sign-up:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Step 1 - Register user details and dispatch SendPulse 6-digit OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - country
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: 6-digit verification code dispatched
 *       400:
 *         description: Bad request / Email already registered
 */
router.post('/sign-up', register);

/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Step 2 - Verify 6-digit authentication code, activate user & issue session token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid or expired code
 */
router.post('/verify-otp', verifyOtp);

/**
 * @openapi
 * /api/auth/resend-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend 6-digit verification code via SendPulse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Fresh code dispatched
 *       404:
 *         description: User not found
 */
router.post('/resend-otp', resendOtp);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Step 1 - Request 6-digit login authentication code via SendPulse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Authentication code dispatched
 *       404:
 *         description: User not found
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/login-verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Step 2 - Verify login 6-digit code and issue JWT session token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid or expired code
 *       404:
 *         description: User not found
 */
router.post('/login-verify', loginVerify);
router.post('/login/verify', loginVerify);

/**
 * @openapi
 * /api/auth/login-resend:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend login 6-digit authentication code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Fresh code dispatched
 *       404:
 *         description: User not found
 */
router.post('/login-resend', loginResend);
router.post('/login/resend', loginResend);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateToken, me);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Terminate user session
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', logout);

/**
 * @openapi
 * /api/auth/google:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Google OAuth authentication (login/registration)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *               accessToken:
 *                 type: string
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google authentication successful
 *       400:
 *         description: Invalid Google authentication payload
 */
router.post('/google', googleLogin);
router.post('/google-login', googleLogin);

export default router;