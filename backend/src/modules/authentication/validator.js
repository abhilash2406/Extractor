import Joi from 'joi';
import { isDisposableEmail } from '../../utils/disposableEmail.js';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).send({ success: false, message: error.details[0].message });
  }
  next();
};

/** Non-disposable email validator */
const nonDisposableEmail = Joi.string()
  .email()
  .trim()
  .lowercase()
  .custom((value, helpers) => {
    if (isDisposableEmail(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  })
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required',
    'any.invalid': 'Disposable or temporary email addresses are not allowed. Please use a permanent email address.',
  });

/** Strong password validation rule: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char */
const strongPassword = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^~_\-+=\(\)\[\]\{\}\<\>\.\,\:\;\'\"\\\/`|])/)
  .required()
  .messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password cannot exceed {#limit} characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required',
  });

export const loginValidate = validate(
  Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required',
    }),
  })
);

export const registerValidate = validate(
  Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 2 characters long',
      'any.required': 'Full name is required',
    }),
    email: nonDisposableEmail,
    password: strongPassword,
    confirm_password: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Confirm password cannot be empty',
        'any.required': 'Confirm password is required',
      }),
  }).unknown(true)
);

export const verifyEmailValidate = validate(
  Joi.object({
    otp: Joi.string().trim().required().messages({
      'string.empty': 'OTP cannot be empty',
      'any.required': 'OTP is required',
    }),
  })
);

export const forgotPasswordValidate = validate(
  Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required',
    }),
  })
);

export const resendVerificationValidate = validate(
  Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required',
    }),
  })
);

export const resetPasswordValidate = validate(
  Joi.object({
    otp: Joi.string().trim().required().messages({
      'string.empty': 'Verification code (OTP) is required',
      'any.required': 'Verification code (OTP) is required',
    }),
    newPassword: strongPassword,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password cannot be empty',
      'any.required': 'Confirm password is required',
    }),
  }).unknown(true)
);

export const changePasswordValidate = validate(
  Joi.object({
    oldPassword: Joi.string().required().messages({
      'string.empty': 'Current password cannot be empty',
      'any.required': 'Current password is required',
    }),
    newPassword: strongPassword,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password cannot be empty',
      'any.required': 'Confirm password is required',
    }),
  })
);

export const addUserValidate = validate(
  Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: strongPassword,
  }).unknown(true)
);
