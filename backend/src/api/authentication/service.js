import User from '../../models/user.js';
import AuthToken from '../../models/authToken.js';
import { EntityType } from '../../common/enum/activity-enum.js';
import sendEmails from '../../utils/sendEmail.js';
import sequelize from '../../config/sequelize-config.js';
import { logger } from '../../config/winston-config.js';
import BadRequest from '../../common/exceptions/badRequest.js';
import crypto from 'crypto';


/**
 * Authenticates a user with email and password.
 */
export const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new BadRequest('Invalid login payload');
  }

  const user = await User.findOne({ where: { email, status: EntityType.ACTIVE } });
  if (!user) throw new BadRequest('Invalid email or password');

  if (user.status === EntityType.BLOCKED) {
    throw new BadRequest('Your account is blocked. Please contact admin.');
  }

  if (!user.is_verified) {
    throw new BadRequest('Please verify your email before logging in.');
  }

  if (!(await user.verifyPassword(password))) {
    throw new Error('Invalid email or password');
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
 * Verifies a user's email using a token.
 */
export const verifyEmailService = async (data) => {
  const { token } = data;

  const authToken = await AuthToken.findOne({ 
    where: { token, type: 'verify_email', status: EntityType.ACTIVE }
  });

  if (!authToken || authToken.expires_at < new Date()) {
    throw new Error('Invalid or expired token');
  }

  const user = await User.findOne({ where: { id: authToken.user_id } });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.status === EntityType.BLOCKED) {
    throw new Error('This account is blocked');
  }

  await user.update({
    status: EntityType.ACTIVE,
    is_verified: true,
  });

  await authToken.update({ status: EntityType.DELETED });

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true);

  return { accessToken, refreshToken };
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
 * Send the verification email with the token.
 */
const sendVerificationEmail = async (user_id, email, fullName, transaction = null) => {
  let token = crypto.randomBytes(32).toString('hex');
  const expireHours = parseInt(process.env.VERIFICATION_EXPIRE_HOURS || 24, 10);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expireHours);

  try {
    await AuthToken.create({
      token,
      user_id,
      type: 'verify_email',
      expires_at: expiresAt,
    }, { transaction });
  } catch (err) {
    logger.error('Email-verification token store failed', {
      user_id,
      email,
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }

  try {
    await sendEmails({
      mailOptions: { to: email, subject: 'Verify Your Email' },
      fileName: 'verify-email.ejs',
      contentVariables: {
        name: fullName,
        token,
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
  }
};

/**
 * Registers a new user into the system.
 */
export const registerUser = async (data) => {
  const { name, email, password } = data;

  return await sequelize.transaction(async (t) => {
    const user = await User.findOne({ where: { email }, transaction: t });
    if (user) {
      if (user.status === EntityType.BLOCKED) {
        throw new Error('This account is blocked. Please contact support.');
      }
      throw new Error('This user already exists');
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
 * Initiates the password reset process by generating a token and sending it via email.
 */
export const forgotPasswordService = async (data) => {
  const { email } = data;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new BadRequest('User not found');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expireMinutes = parseInt(process.env.PASSWORD_RESET_EXPIRE_MINUTES || '15', 10);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expireMinutes);

  await AuthToken.create({
    token,
    user_id: user.id,
    type: 'reset_password',
    expires_at: expiresAt,
  });

  try {
    await sendEmails({
      mailOptions: { to: email, subject: 'Password Reset Request' },
      fileName: 'forgot-password.ejs',
      contentVariables: {
        name: user.username,
        token,
        expireMinutes,
      },
    });
  } catch (err) {
    logger.error('Password reset email failed', { user_id: user.id, error: err.message });
    throw new BadRequest('Failed to send reset email');
  }

  return { message: 'Password reset link sent to email' };
};

/**
 * Resets the user's password securely.
 */
export const resetPasswordService = async (data) => {
  const { token, newPassword, confirmPassword } = data;
  
  if (newPassword !== confirmPassword) {
    throw new BadRequest('Passwords do not match');
  }

  const authToken = await AuthToken.findOne({ 
    where: { token, type: 'reset_password', status: EntityType.ACTIVE }
  });

  if (!authToken || authToken.expires_at < new Date()) {
    throw new BadRequest('Invalid or expired token');
  }

  const user = await User.findOne({ where: { id: authToken.user_id } });
  if (!user) {
    throw new BadRequest('User not found');
  }

  // Update password (model hooks should handle hashing)
  await user.update({ password: newPassword });
  await authToken.update({ status: EntityType.DELETED });

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
    throw new BadRequest('Incorrect old password');
  }

  await user.update({ password: newPassword });
  return { message: 'Password changed successfully' };
};
