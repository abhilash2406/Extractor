import Joi from 'joi';

const createQuestionSchema = Joi.object({
  type: Joi.string().valid('MCQ', 'PROGRAMMING').default('MCQ'),
  question: Joi.string().required(),
  option_a: Joi.string().when('type', { is: 'PROGRAMMING', then: Joi.optional().allow(null, ''), otherwise: Joi.required() }),
  option_b: Joi.string().when('type', { is: 'PROGRAMMING', then: Joi.optional().allow(null, ''), otherwise: Joi.required() }),
  option_c: Joi.string().when('type', { is: 'PROGRAMMING', then: Joi.optional().allow(null, ''), otherwise: Joi.required() }),
  option_d: Joi.string().when('type', { is: 'PROGRAMMING', then: Joi.optional().allow(null, ''), otherwise: Joi.required() }),
  correct_answer: Joi.string().when('type', { is: 'PROGRAMMING', then: Joi.optional().allow(null, ''), otherwise: Joi.required() }),
});

const updateQuestionSchema = Joi.object({
  type: Joi.string().valid('MCQ', 'PROGRAMMING').optional(),
  question: Joi.string().optional(),
  option_a: Joi.string().optional().allow(null, ''),
  option_b: Joi.string().optional().allow(null, ''),
  option_c: Joi.string().optional().allow(null, ''),
  option_d: Joi.string().optional().allow(null, ''),
  correct_answer: Joi.string().optional().allow(null, ''),
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
