import { Op } from 'sequelize';
import Template from '../../models/template.js';
import User from '../../models/user.js';
import Resume from '../../models/resume.js';
import { UserType } from '../../common/enum/usertype-enum.js';
import { TemplateStatus } from '../../common/enum/template-status-enum.js';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';
import { uploadToB2, generateB2PublicUrl } from '../../utils/backblaze.js';
import { createTemplateSchema, updateTemplateSchema, updateStatusSchema } from './validator.js';
import { DEFAULT_LAYOUT, DEFAULT_DESIGN, DEFAULT_SECTIONS, UUID_REGEX } from './constants.js';

export { DEFAULT_LAYOUT, DEFAULT_DESIGN, DEFAULT_SECTIONS, UUID_REGEX };

// Helper to generate URL-safe slug
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Get templates list with filtering, searching, and pagination
 */
export const getTemplatesService = async (query = {}, currentUser = null) => {
  const { page, limit, offset, sortBy, sortOrder, search } = parsePagination(query, 'created_at');
  const isAdmin = currentUser?.role === UserType.ADMIN;

  // Base condition: Deleted templates are NEVER returned to anyone
  const where = {
    status: { [Op.ne]: TemplateStatus.DELETED },
  };

  // Status Filter
  if (isAdmin) {
    if (query.status && query.status.toLowerCase() !== 'all') {
      const requestedStatus = query.status.toLowerCase();
      if (requestedStatus === TemplateStatus.DELETED) {
        // If someone explicitly queries 'deleted', return nothing because deleted templates are never listed
        where.status = { [Op.and]: [{ [Op.ne]: TemplateStatus.DELETED }, requestedStatus] };
      } else {
        where.status = requestedStatus;
      }
    }
  } else {
    // Non-admin / public candidates can ONLY see published templates
    where.status = TemplateStatus.PUBLISHED;
  }

  // Category Filter
  if (query.category && query.category.toLowerCase() !== 'all') {
    where.category = query.category;
  }

  // Search Filter (by name, code, or description)
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await Template.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortBy, sortOrder]],
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'email'],
        required: false,
      },
    ],
  });

  return paginatedResponse(rows, count, page, limit);
};

/**
 * Get single template by UUID or unique code
 */
export const getTemplateByIdOrCodeService = async (idOrCode, currentUser = null) => {
  const isAdmin = currentUser?.role === UserType.ADMIN;
  const isUuid = UUID_REGEX.test(idOrCode);

  const where = isUuid ? { id: idOrCode } : { code: idOrCode.toLowerCase() };

  const template = await Template.findOne({
    where,
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'email'],
        required: false,
      },
    ],
  });

  if (!template) {
    const error = new Error('Template not found');
    error.statusCode = 404;
    throw error;
  }

  // If template is deleted, no one sees it (treated as 404 Not Found for everyone)
  if (template.status === TemplateStatus.DELETED) {
    const error = new Error('Template not found');
    error.statusCode = 404;
    throw error;
  }

  // If template is not published and viewer is not an admin, deny access
  if (template.status !== TemplateStatus.PUBLISHED && !isAdmin) {
    const error = new Error('Template is not published');
    error.statusCode = 403;
    throw error;
  }

  return template;
};

/**
 * Create a new template (Admin only)
 */
export const createTemplateService = async (body, file = null, userId = null) => {
  // If request sent JSON strings for config (e.g. from multipart form), parse them
  let payload = { ...body };
  if (typeof payload.layout_config === 'string') {
    try {
      payload.layout_config = JSON.parse(payload.layout_config);
    } catch (_) {}
  }
  if (typeof payload.design_config === 'string') {
    try {
      payload.design_config = JSON.parse(payload.design_config);
    } catch (_) {}
  }

  const { error, value } = createTemplateSchema.validate(payload, { abortEarly: false });
  if (error) {
    const err = new Error(error.details.map((d) => d.message).join(', '));
    err.statusCode = 400;
    throw err;
  }

  // Handle uploaded thumbnail image if present
  let thumbnailUrl = value.thumbnail_url || null;
  if (file) {
    const key = await uploadToB2(file.originalname, file.buffer, file.mimetype, `templates/thumbnails/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    thumbnailUrl = generateB2PublicUrl(key);
  }

  // Ensure unique code
  let code = value.code || slugify(value.name);
  if (!code) code = `tpl-${Date.now()}`;

  const existing = await Template.findOne({ where: { code } });
  if (existing) {
    code = `${code}-${Math.floor(Math.random() * 1000)}`;
  }

  const template = await Template.create({
    name: value.name,
    code,
    description: value.description || null,
    category: value.category || 'Modern',
    thumbnail_url: thumbnailUrl,
    layout_config: value.layout_config || DEFAULT_LAYOUT,
    design_config: value.design_config || DEFAULT_DESIGN,
    status: value.status || 'draft',
    created_by: userId || null,
  });

  return template;
};

/**
 * Update template details, layout, or design (Admin only)
 */
export const updateTemplateService = async (id, body, file = null) => {
  let payload = { ...body };
  if (typeof payload.layout_config === 'string') {
    try {
      payload.layout_config = JSON.parse(payload.layout_config);
    } catch (_) {}
  }
  if (typeof payload.design_config === 'string') {
    try {
      payload.design_config = JSON.parse(payload.design_config);
    } catch (_) {}
  }

  const { error, value } = updateTemplateSchema.validate(payload, { abortEarly: false });
  if (error) {
    const err = new Error(error.details.map((d) => d.message).join(', '));
    err.statusCode = 400;
    throw err;
  }

  const template = await Template.findByPk(id);
  if (!template || template.status === TemplateStatus.DELETED) {
    const err = new Error('Template not found');
    err.statusCode = 404;
    throw err;
  }

  // Handle uploaded thumbnail
  if (file) {
    const key = await uploadToB2(file.originalname, file.buffer, file.mimetype, `templates/thumbnails/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    value.thumbnail_url = generateB2PublicUrl(key);
  }

  // Check unique code if code is being updated
  if (value.code && value.code !== template.code) {
    const duplicate = await Template.findOne({ where: { code: value.code, id: { [Op.ne]: id } } });
    if (duplicate) {
      const err = new Error(`Template code '${value.code}' is already in use by another template`);
      err.statusCode = 400;
      throw err;
    }
  }

  await template.update(value);
  return template;
};

/**
 * Update template status (draft, published, archived) (Admin only)
 */
export const updateTemplateStatusService = async (id, status) => {
  const { error, value } = updateStatusSchema.validate({ status });
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const template = await Template.findByPk(id);
  if (!template || template.status === TemplateStatus.DELETED) {
    const err = new Error('Template not found');
    err.statusCode = 404;
    throw err;
  }

  await template.update({ status: value.status });
  return template;
};

/**
 * Duplicate a template as a new draft (Admin only)
 */
export const duplicateTemplateService = async (id, userId = null) => {
  const template = await Template.findByPk(id);
  if (!template || template.status === TemplateStatus.DELETED) {
    const err = new Error('Template not found');
    err.statusCode = 404;
    throw err;
  }

  const baseCode = `${template.code}-copy`;
  let uniqueCode = `${baseCode}-${Date.now().toString(36)}`;

  const cloned = await Template.create({
    name: `${template.name} (Copy)`,
    code: uniqueCode,
    description: template.description,
    category: template.category,
    thumbnail_url: template.thumbnail_url,
    layout_config: template.layout_config,
    design_config: template.design_config,
    status: TemplateStatus.DRAFT,
    created_by: userId || null,
  });

  return cloned;
};

/**
 * Delete a template (Admin only)
 */
export const deleteTemplateService = async (id) => {
  const template = await Template.findByPk(id);
  if (!template || template.status === TemplateStatus.DELETED) {
    const err = new Error('Template not found');
    err.statusCode = 404;
    throw err;
  }

  // Soft delete: update status to deleted
  await template.update({ status: TemplateStatus.DELETED });
  return true;
};

/**
 * Upload thumbnail image specifically
 */
export const uploadThumbnailService = async (id, file) => {
  if (!file) {
    const err = new Error('No image file provided');
    err.statusCode = 400;
    throw err;
  }

  const template = await Template.findByPk(id);
  if (!template || template.status === TemplateStatus.DELETED) {
    const err = new Error('Template not found');
    err.statusCode = 404;
    throw err;
  }

  const key = await uploadToB2(file.originalname, file.buffer, file.mimetype, `templates/thumbnails/${id}-${Date.now()}`);
  const thumbnailUrl = generateB2PublicUrl(key);

  await template.update({ thumbnail_url: thumbnailUrl });
  return { thumbnail_url: thumbnailUrl };
};
