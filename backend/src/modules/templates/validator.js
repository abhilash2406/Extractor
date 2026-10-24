import Joi from 'joi';
import { TemplateStatus } from '../../common/enum/template-status-enum.js';

export const createTemplateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required().messages({
    'string.empty': 'Template name is required',
    'string.min': 'Template name must be at least 2 characters long',
    'string.max': 'Template name cannot exceed 120 characters',
  }),
  code: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(100)
    .optional()
    .messages({
      'string.pattern.base': 'Template code must contain only lowercase alphanumeric characters and hyphens',
    }),
  description: Joi.string().max(1000).allow('', null).optional(),
  category: Joi.string().trim().max(50).default('Modern').optional(),
  thumbnail_url: Joi.string().allow('', null).optional(),
  layout_config: Joi.object().optional(),
  design_config: Joi.object().optional(),
  status: Joi.string()
    .valid(...Object.values(TemplateStatus))
    .default(TemplateStatus.DRAFT)
    .optional(),
});

export const updateTemplateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).optional(),
  code: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(100)
    .optional()
    .messages({
      'string.pattern.base': 'Template code must contain only lowercase alphanumeric characters and hyphens',
    }),
  description: Joi.string().max(1000).allow('', null).optional(),
  category: Joi.string().trim().max(50).optional(),
  thumbnail_url: Joi.string().allow('', null).optional(),
  layout_config: Joi.object().optional(),
  design_config: Joi.object().optional(),
  status: Joi.string()
    .valid(...Object.values(TemplateStatus))
    .optional(),
}).min(1);

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TemplateStatus))
    .required()
    .messages({
      'any.only': `Status must be one of: ${Object.values(TemplateStatus).join(', ')}`,
      'any.required': 'Status is required',
    }),
});
