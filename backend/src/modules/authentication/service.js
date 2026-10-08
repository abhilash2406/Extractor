import User from '../../models/user.js';
import AuthToken from '../../models/authToken.js';
import { EntityType } from '../../common/enum/activity-enum.js';
import sendEmails from '../../utils/sendEmail.js';
import sequelize from '../../config/sequelize-config.js';
import { logger } from '../../config/winston-config.js';
import BadRequest from '../../common/exceptions/badRequest.js';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { isDisposableEmail } from '../../utils/disposableEmail.js';
import { generateOtp } from '../../utils/otp.js';


/**
 * Authenticates a user with email and password.
 */
export const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new BadRequest('Invalid login payload');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new BadRequest('No account found with this email. Please register.');
  }

  if (user.status === EntityType.BLOCKED) {
    throw new BadRequest('Your account is blocked. Please contact admin.');
  }

  if (user.status !== EntityType.ACTIVE) {
    throw new BadRequest('Your account is not active. Please contact support.');
  }

  if (!user.is_verified) {
    throw new BadRequest('Please verify your email before logging in.');
  }

  if (!(await user.verifyPassword(password))) {
    throw new BadRequest('Invalid email or password');
  }

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true);
  return {
    name: user.username,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

/**
 * Verifies a user's email using an OTP.
 */
export const verifyEmailService = async (data) => {
  const { otp } = data;

  if (!otp) {
    throw new BadRequest('OTP is required');
  }

  const authToken = await AuthToken.findOne({
    where: { otp, type: 'verify_email', status: EntityType.ACTIVE }
  });

  if (!authToken || authToken.expires_at < new Date()) {
    throw new BadRequest('Invalid or expired OTP');
  }

  const user = await User.findOne({ where: { id: authToken.user_id } });
  if (!user) {
    throw new BadRequest('User not found');
  }

  if (user.status === EntityType.BLOCKED) {
    throw new BadRequest('This account is blocked');
  }

  await user.update({
    status: EntityType.ACTIVE,
    is_verified: true,
  });

  await authToken.update({ status: EntityType.DELETED });

  // Send welcome email upon successful verification
  sendEmails({
    mailOptions: {
      to: user.email,
      subject: 'Welcome to Extractor! 🎉 Your Account is Verified',
    },
    fileName: 'welcome-email.ejs',
    contentVariables: {
      name: user.username,
    },
  }).catch((err) => {
    logger.warn('Failed to send welcome email', {
      user_id: user.id,
      email: user.email,
      error: err instanceof Error ? err.message : String(err),
    });
  });

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true);

  return {
    name: user.username,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

/**
 * Authenticates a user using a Google OAuth token.
 */
export const googleLoginService = async (data) => {
  const googleToken = data.token;

  const ticket = await googleClient.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const googleEmail = payload.email;

  const user = await User.findOne({ where: { email: googleEmail } });

  if (!user) {
    throw new Error('User Not Found');
  }

  if (user.status === EntityType.INACTIVE) {
    await user.update({ status: EntityType.ACTIVE });
  }

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true);

  return {
    name: user.username,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

/**
 * Send the verification email with the 6-digit OTP.
 */
const sendVerificationEmail = async (user_id, email, fullName, transaction = null) => {
  const otp = generateOtp();
  const expireHours = parseInt(process.env.VERIFICATION_EXPIRE_HOURS || '24', 10);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expireHours);

  try {
    await AuthToken.create({
      otp,
      user_id,
      type: 'verify_email',
      expires_at: expiresAt,
    }, { transaction });
  } catch (err) {
    logger.error('Email-verification OTP store failed', {
      user_id,
      email,
      error: err instanceof Error ? err.message : String(err),
    });
    throw new BadRequest('Failed to generate verification code');
  }

  try {
    await sendEmails({
      mailOptions: { to: email, subject: 'Verify Your Email - Verification Code' },
      fileName: 'verify-email.ejs',
      contentVariables: {
        name: fullName,
        otp,
        expireHours,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    });
  } catch (err) {
    logger.error('Verification email send failed', {
      user_id,
      email,
      error: err instanceof Error ? err.message : String(err),
    });
    throw new BadRequest('Failed to send verification email. Please check email configuration or try again.');
  }
};

/**
 * Registers a new user into the system.
 */
export const registerUser = async (data) => {
  const { name, email, password } = data;

  if (isDisposableEmail(email)) {
    throw new BadRequest('Disposable or temporary email addresses are not allowed. Please use a permanent email address.');
  }

  return await sequelize.transaction(async (t) => {
    const user = await User.findOne({ where: { email }, transaction: t });
    if (user) {
      if (user.status === EntityType.BLOCKED) {
        throw new BadRequest('This account is blocked. Please contact support.');
      }
      if (!user.is_verified) {
        // User already registered previously but has not verified yet.
        // Update credentials in case they provided updated details, and send a fresh OTP.
        await user.update(
          {
            username: name,
            password,
          },
          { transaction: t }
        );

        await AuthToken.update(
          { status: EntityType.DELETED },
          { where: { user_id: user.id, type: 'verify_email', status: EntityType.ACTIVE }, transaction: t }
        );

        await sendVerificationEmail(user.id, email, name, t);

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          isExistingUnverified: true,
        };
      }
      throw new BadRequest('This account already exists');
    }

    const newUser = await User.create(
      {
        username: name,
        email,
        password,
      },
      { transaction: t }
    );

    await sendVerificationEmail(newUser.id, email, name, t);

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.username,
    };
  });
};

/**
 * Resends email verification code (OTP) for an unverified account.
 */
export const resendVerificationService = async (data) => {
  const { email } = data;
  if (!email) {
    throw new BadRequest('Email is required');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new BadRequest('No account found with this email address');
  }

  if (user.is_verified) {
    throw new BadRequest('This email is already verified. Please sign in.');
  }

  if (user.status === EntityType.BLOCKED) {
    throw new BadRequest('This account is blocked. Please contact support.');
  }

  // Invalidate previous active verify_email tokens
  await AuthToken.update(
    { status: EntityType.DELETED },
    { where: { user_id: user.id, type: 'verify_email', status: EntityType.ACTIVE } }
  );

  await sendVerificationEmail(user.id, user.email, user.username);

  return { message: 'A new 6-digit verification code has been sent to your email' };
};

/**
 * Initiates the password reset process by generating a token and sending it via email.
 */
export const forgotPasswordService = async (data) => {
  const { email } = data;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new BadRequest('No account found with this email address');
  }

  const otp = generateOtp();
  const expireMinutes = parseInt(process.env.PASSWORD_RESET_EXPIRE_MINUTES || '15', 10);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expireMinutes);

  // Invalidate any existing active reset tokens for this user
  await AuthToken.update(
    { status: EntityType.DELETED },
    { where: { user_id: user.id, type: 'reset_password', status: EntityType.ACTIVE } }
  );

  await AuthToken.create({
    otp,
    user_id: user.id,
    type: 'reset_password',
    expires_at: expiresAt,
  });

  try {
    await sendEmails({
      mailOptions: { to: email, subject: 'Password Reset Code - Extractor' },
      fileName: 'forgot-password.ejs',
      contentVariables: {
        name: user.username,
        otp,
        expireMinutes,
      },
    });
  } catch (err) {
    logger.error('Password reset email failed', { user_id: user.id, error: err.message });
    throw new BadRequest('Failed to send password reset email');
  }

  return { message: 'Password reset code sent to your email' };
};

/**
 * Resets the user's password securely using a 6-digit OTP code.
 */
export const resetPasswordService = async (data) => {
  const { otp, newPassword, confirmPassword } = data;

  if (!otp) {
    throw new BadRequest('Verification code (OTP) is required');
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequest('Passwords do not match');
  }

  const authToken = await AuthToken.findOne({
    where: { otp: otp.trim(), type: 'reset_password', status: EntityType.ACTIVE }
  });

  if (!authToken || authToken.expires_at < new Date()) {
    throw new BadRequest('Invalid or expired verification code');
  }

  const user = await User.findOne({ where: { id: authToken.user_id } });
  if (!user) {
    throw new BadRequest('User not found');
  }

  // Update password (User model hook automatically hashes the password)
  await user.update({ password: newPassword });
  await authToken.update({ status: EntityType.DELETED });

  // Send security notification email
  sendEmails({
    mailOptions: {
      to: user.email,
      subject: 'Security Alert: Your Extractor Password Was Reset 🔒',
    },
    fileName: 'password-updated.ejs',
    contentVariables: {
      name: user.username,
      email: user.email,
      updatedAt: dayjs().format('MMMM D, YYYY [at] h:mm A'),
    },
  }).catch((err) => {
    logger.warn('Failed to send password reset confirmation email', {
      user_id: user.id,
      error: err.message,
    });
  });

  return { message: 'Password reset successfully' };
};

/**
 * Changes a logged-in user's password.
 */
export const changePasswordService = async (userId, data) => {
  const { oldPassword, newPassword } = data;
  const user = await User.findByPk(userId);

  if (!user) {
    throw new BadRequest('User not found');
  }

  if (!(await user.verifyPassword(oldPassword))) {
    throw new BadRequest('Incorrect current password');
  }

  if (oldPassword === newPassword) {
    throw new BadRequest('New password must be different from your current password');
  }

  await user.update({ password: newPassword });

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true);

  // Send security notification email
  sendEmails({
    mailOptions: {
      to: user.email,
      subject: 'Security Alert: Your Extractor Password Was Changed 🔒',
    },
    fileName: 'password-updated.ejs',
    contentVariables: {
      name: user.username,
      email: user.email,
      updatedAt: dayjs().format('MMMM D, YYYY [at] h:mm A'),
    },
  }).catch((err) => {
    logger.warn('Failed to send password update confirmation email', {
      user_id: user.id,
      error: err.message,
    });
  });

  return {
    message: 'Password changed successfully',
    accessToken,
    refreshToken,
  };
};
