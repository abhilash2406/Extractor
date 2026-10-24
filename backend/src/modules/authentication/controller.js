import { setAuthCookies, clearAuthCookies, getAudience } from '../../utils/cookies.js';
import { goodResponse, failedResponse } from '../../common/response.js';
import {
  loginUser,
  registerUser,
  verifyEmailService,
  resendVerificationService,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
} from './service.js';

/** Read a named cookie off the request without tripping the `any` from cookie-parser. */
const readCookie = (req, name) => req.cookies?.[name];

/** Persist an issued token pair as the audience auth cookies. */
const applyAuthCookies = (res, audience, tokens) => {
  setAuthCookies(res, audience, {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTtlMs: tokens.accessTtlMs,
    refreshTtlMs: tokens.refreshTtlMs,
  });
};

/**
 * Handles resending email verification OTP.
 */
export const resendVerification = async (req, res, next) => {
  try {
    const data = await resendVerificationService(req.body);
    return res.json(goodResponse({}, data.message || 'Verification code resent successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

/**
 * Handles email verification using OTP.
 * @param {import('express').Request} req - The Express request object containing email and otp in the body.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<Object>} JSON response containing the success status, message, and access token.
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const data = await verifyEmailService(req.body);
    const audience = getAudience(req);

    applyAuthCookies(res, audience, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTtlMs: (process.env.ACCESS_TOKEN_TTL_SECONDS || 900) * 1000,
      refreshTtlMs: (process.env.REFRESH_TOKEN_TTL_SECONDS || 2592000) * 1000,
    });

    const { accessToken, refreshToken, ...userData } = data;

    return res.json(goodResponse({ data: userData }, 'Email verified successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || (e.message === 'User not found' ? 404 : e.message.includes('Account') ? 403 : 400);
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

/**
 * Handles standard user login.
 * @param {import('express').Request} req - The Express request object containing email and password in the body.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<Object>} JSON response containing tokens and user data on success, or an error message on failure.
 */
export const Login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    const audience = getAudience(req);

    applyAuthCookies(res, audience, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTtlMs: (process.env.ACCESS_TOKEN_TTL_SECONDS || 900) * 1000,
      refreshTtlMs: (process.env.REFRESH_TOKEN_TTL_SECONDS || 2592000) * 1000,
    });

    const { accessToken, refreshToken, ...userData } = data;

    return res.json(
      goodResponse(
        {
          data: userData,
        },
        'Login successfully'
      )
    );
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

/**
 * Handles new user registration.
 * @param {import('express').Request} req - The Express request object containing user details.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<Object>} JSON response containing the registered user data.
 */
export const register = async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    return res.json(goodResponse({ data }, 'Registered successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

/**
 * Handles forgot password request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const data = await forgotPasswordService(req.body);
    return res.json(goodResponse({}, data.message || 'Password reset link sent to email'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

/**
 * Handles password reset.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const resetPassword = async (req, res, next) => {
  try {
    const data = await resetPasswordService(req.body);
    return res.json(goodResponse({}, data.message || 'Password reset successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

/**
 * Handles password change for logged-in users.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const changePassword = async (req, res, next) => {
  try {
    const data = await changePasswordService(req.user.id, req.body);
    const audience = getAudience(req);

    if (data.accessToken) {
      applyAuthCookies(res, audience, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTtlMs: (process.env.ACCESS_TOKEN_TTL_SECONDS || 900) * 1000,
        refreshTtlMs: (process.env.REFRESH_TOKEN_TTL_SECONDS || 2592000) * 1000,
      });
    }

    return res.json(goodResponse({}, data.message || 'Password changed successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

/**
 * Handles user logout by clearing auth cookies.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const logout = async (req, res, next) => {
  try {
    const audience = getAudience(req);
    clearAuthCookies(res, audience);
    return res.json(goodResponse({}, 'Logged out successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};


