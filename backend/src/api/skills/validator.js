import Joi from 'joi';

const createSkillSchema = Joi.object({
  name: Joi.string().required(),
});

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map((x) => x.message),
    });
  }
  next();
};

export const createSkillValidate = validateRequest(createSkillSchema);
