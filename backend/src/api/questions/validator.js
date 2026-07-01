import Joi from 'joi';

const createQuestionSchema = Joi.object({
  question: Joi.string().required(),
  option_a: Joi.string().required(),
  option_b: Joi.string().required(),
  option_c: Joi.string().required(),
  option_d: Joi.string().required(),
  correct_answer: Joi.string().required(),
});

const updateQuestionSchema = Joi.object({
  question: Joi.string().optional(),
  option_a: Joi.string().optional(),
  option_b: Joi.string().optional(),
  option_c: Joi.string().optional(),
  option_d: Joi.string().optional(),
  correct_answer: Joi.string().optional(),
}).min(1);

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

export const createQuestionValidate = validateRequest(createQuestionSchema);
export const updateQuestionValidate = validateRequest(updateQuestionSchema);
