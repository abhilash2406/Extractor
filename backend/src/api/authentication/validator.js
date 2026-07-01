import Joi from 'joi';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ success: false, message: error.details[0].message });
  }
  next();
};

export const loginValidate = validate(
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
);

export const registerValidate = validate(
  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })
);

export const verifyEmailValidate = validate(
  Joi.object({
    token: Joi.string().required(),
  })
);

export const forgotPasswordValidate = validate(
  Joi.object({
    email: Joi.string().email().required(),
  })
);

export const resetPasswordValidate = validate(
  Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.only': 'Passwords do not match',
    }),
  })
);

export const changePasswordValidate = validate(
  Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.only': 'Passwords do not match',
    }),
  })
);

export const addUserValidate = validate(
  Joi.object({
    // Keep a placeholder if it was used elsewhere, or define actual schema
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true)
);
