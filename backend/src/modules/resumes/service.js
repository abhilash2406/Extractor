import Resume from '../../models/resume.js';
import Template from '../../models/template.js';
import { parsePagination, paginatedResponse } from '../../utils/pagination.js';
import { renderResumeHtml } from '../../utils/htmlTemplate.js';
import { generatePdfFromHtml } from '../../utils/pdfGenerator.js';
import { UserType } from '../../common/enum/usertype-enum.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Resolves template UUID if given a UUID or code slug
 */
const resolveTemplateId = async (templateIdOrCode) => {
  if (!templateIdOrCode) return null;
  if (UUID_REGEX.test(templateIdOrCode)) {
    const tpl = await Template.findByPk(templateIdOrCode);
    return tpl ? tpl.id : null;
  }
  const tpl = await Template.findOne({ where: { code: templateIdOrCode.toLowerCase() } });
  return tpl ? tpl.id : null;
};

/**
 * Create a new resume for logged-in user
 */
export const createResumeService = async (userId, body) => {
  if (!body.content || typeof body.content !== 'object') {
    const error = new Error('Resume content is required and must be an object');
    error.statusCode = 400;
    throw error;
  }

  const templateId = await resolveTemplateId(body.template_id);

  const resume = await Resume.create({
    user_id: userId,
    title: (body.title && body.title.trim()) || 'Untitled Resume',
    template_id: templateId,
    content: body.content,
  });

  return resume;
};

/**
 * Update an existing resume with ownership verification
 */
export const updateResumeService = async (userId, resumeId, body) => {
  const resume = await Resume.findByPk(resumeId);
  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId) {
    const error = new Error('Forbidden: You do not own this resume');
    error.statusCode = 403;
    throw error;
  }

  const updateData = {};
  if (body.title !== undefined) updateData.title = body.title.trim() || 'Untitled Resume';
  if (body.template_id !== undefined) {
    updateData.template_id = await resolveTemplateId(body.template_id);
  }
  if (body.content !== undefined) {
    if (typeof body.content !== 'object') {
      const error = new Error('Content must be an object');
      error.statusCode = 400;
      throw error;
    }
    updateData.content = body.content;
  }

  await resume.update(updateData);
  return resume;
};

/**
 * Get all resumes for the logged-in user
 */
export const getMyResumesService = async (userId, query = {}) => {
  const { page, limit, offset, sortBy, sortOrder } = parsePagination(query, 'uploaded_at');

  const { rows, count } = await Resume.findAndCountAll({
    where: { user_id: userId },
    limit,
    offset,
    order: [[sortBy || 'uploaded_at', sortOrder || 'DESC']],
    include: [
      {
        model: Template,
        as: 'template',
        attributes: ['id', 'name', 'code', 'category', 'thumbnail_url', 'status'],
        required: false,
      },
    ],
  });

  return paginatedResponse(rows, count, page, limit);
};

/**
 * Get single resume by ID with ownership verification
 */
export const getResumeByIdService = async (userId, resumeId, userRole = null) => {
  const resume = await Resume.findByPk(resumeId, {
    include: [
      {
        model: Template,
        as: 'template',
        required: false,
      },
    ],
  });

  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId && userRole !== UserType.ADMIN) {
    const error = new Error('Forbidden: You do not have access to this resume');
    error.statusCode = 403;
    throw error;
  }

  return resume;
};

/**
 * Delete a resume with ownership verification
 */
export const deleteResumeService = async (userId, resumeId) => {
  const resume = await Resume.findByPk(resumeId);
  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  if (resume.user_id !== userId) {
    const error = new Error('Forbidden: You cannot delete this resume');
    error.statusCode = 403;
    throw error;
  }

  await resume.destroy();
  return true;
};

/**
 * Generate PDF binary for download
 * Supports guests (content in body) or authenticated users (content in body or resumeId)
 */
export const generateResumePdfService = async (body, currentUser = null) => {
  let content = body.content;
  let title = body.title || 'Resume';
  let templateConfig = null;

  // 1. If resumeId is supplied, verify ownership and load saved content
  if (body.resumeId) {
    if (!currentUser) {
      const error = new Error('Authentication required to download a saved resume by ID');
      error.statusCode = 401;
      throw error;
    }
    const saved = await Resume.findByPk(body.resumeId, {
      include: [{ model: Template, as: 'template', required: false }],
    });
    if (!saved) {
      const error = new Error('Resume not found');
      error.statusCode = 404;
      throw error;
    }
    if (saved.user_id !== currentUser.id && currentUser.role !== UserType.ADMIN) {
      const error = new Error('Forbidden: You do not have access to this resume');
      error.statusCode = 403;
      throw error;
    }
    content = saved.content;
    title = saved.title || title;
    if (saved.template) {
      templateConfig = {
        layout_config: saved.template.layout_config,
        design_config: saved.template.design_config,
      };
    }
  }

  if (!content || typeof content !== 'object') {
    const error = new Error('Resume content is required');
    error.statusCode = 400;
    throw error;
  }

  // 2. If template_id or code is provided and we don't already have config, load it
  if (!templateConfig && body.template_id) {
    const tpl = UUID_REGEX.test(body.template_id)
      ? await Template.findByPk(body.template_id)
      : await Template.findOne({ where: { code: body.template_id.toLowerCase() } });
    if (tpl) {
      templateConfig = {
        layout_config: tpl.layout_config,
        design_config: tpl.design_config,
      };
    }
  }

  // Merge custom accentColor, designConfig, or design_config if passed
  if (!templateConfig) {
    templateConfig = { design_config: {} };
  }
  const customDesign = body.design_config || body.designConfig || {};
  templateConfig.design_config = {
    ...(templateConfig.design_config || {}),
    ...customDesign,
    ...(body.accentColor ? { primaryColor: body.accentColor, accentColor: body.accentColor } : {}),
  };

  // 3. Render trusted HTML
  const html = renderResumeHtml(content, templateConfig, title);

  // 4. Generate PDF binary using Puppeteer
  const pdfBuffer = await generatePdfFromHtml(html);

  // Clean filename for attachment
  const safeFilename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

  return {
    buffer: pdfBuffer,
    filename: safeFilename,
  };
};
