import { goodResponse, failedResponse } from '../../common/response.js';
import {
  getTemplatesService,
  getTemplateByIdOrCodeService,
  createTemplateService,
  updateTemplateService,
  updateTemplateStatusService,
  duplicateTemplateService,
  deleteTemplateService,
  uploadThumbnailService,
} from './service.js';

export const getTemplates = async (req, res) => {
  try {
    const result = await getTemplatesService(req.query, req.user);
    return res.json(goodResponse(result, 'Templates retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const getTemplate = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const template = await getTemplateByIdOrCodeService(idOrCode, req.user);
    return res.json(goodResponse({ data: template }, 'Template retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const createTemplate = async (req, res) => {
  try {
    const template = await createTemplateService(req.body, req.file, req.user?.id);
    return res.status(201).json(goodResponse({ data: template }, 'Template created successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await updateTemplateService(id, req.body, req.file);
    return res.json(goodResponse({ data: template }, 'Template updated successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const updateTemplateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const template = await updateTemplateStatusService(id, status);
    return res.json(goodResponse({ data: template }, `Template status updated to ${status}`));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const duplicateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await duplicateTemplateService(id, req.user?.id);
    return res.status(201).json(goodResponse({ data: template }, 'Template duplicated successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTemplateService(id);
    return res.json(goodResponse({}, 'Template deleted successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const uploadThumbnail = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await uploadThumbnailService(id, req.file);
    return res.json(goodResponse({ data: result }, 'Thumbnail uploaded successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};
