import express from 'express';
import {
  Login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
} from './controller.js';
import {
  loginValidate,
  registerValidate,
  verifyEmailValidate,
  forgotPasswordValidate,
  resetPasswordValidate,
  changePasswordValidate,
} from './validator.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: APIs for user authentication and onboarding
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     description: Authenticate user using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: Bad request
 */
router.post('/login', loginValidate, Login);
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Basic user registration
 *     description: Register a new account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Registered successfully
 *       '400':
 *         description: Validation error
 */
router.post('/register', registerValidate, register);

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify an email-verification token
 *     description: >
 *       Confirms the token, activates the account, and logs the user in by
 *       returning an access token and setting the httpOnly refresh-token
 *       cookie.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified — access token returned, refresh cookie set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Email verified }
 *                 accessToken: { type: string }
 *       400:
 *         description: Validation error or invalid/expired token
 *       403:
 *         description: Account is blocked or deleted
 *       404:
 *         description: User not found
 */

router.post('/verify-email', verifyEmailValidate, verifyEmail);



/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request a password reset
 *     description: Generates a token and sends it to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Password reset link sent to email
 *       '400':
 *         description: User not found
 */
router.post('/forgot-password', forgotPasswordValidate, forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset password
 *     description: Verifies the token and updates the user's password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - token
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       '400':
 *         description: Invalid or expired token, or validation error
 */
router.post('/reset-password', resetPasswordValidate, resetPassword);


/**
 * @swagger
 * /api/v1/auth/change-password:
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Change password for logged in user
 *     description: Updates the logged in user's password requiring the old password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '400':
 *         description: Invalid old password, or validation error
 *       '401':
 *         description: Unauthorized
 */
router.put('/change-password', auth, changePasswordValidate, changePassword);

export default router;
