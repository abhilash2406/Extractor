import Joi from 'joi';

const createJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  min_education: Joi.string().allow('', null).optional(),
  min_experience: Joi.number().integer().min(0).allow(null).optional(),
  last_application_date: Joi.date().iso().allow(null).optional(),
  skill_ids: Joi.array().items(Joi.string().guid()).optional()
});

const updateJobSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow('', null).optional(),
  min_education: Joi.string().allow('', null).optional(),
  min_experience: Joi.number().integer().min(0).allow(null).optional(),
  last_application_date: Joi.date().iso().allow(null).optional(),
  skill_ids: Joi.array().items(Joi.string().guid()).optional()
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

export const createJobValidate = validateRequest(createJobSchema);
export const updateJobValidate = validateRequest(updateJobSchema);
