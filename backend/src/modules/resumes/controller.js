import { goodResponse, failedResponse } from '../../common/response.js';
import {
  createResumeService,
  updateResumeService,
  getMyResumesService,
  getResumeByIdService,
  deleteResumeService,
  generateResumePdfService,
} from './service.js';

export const createResume = async (req, res) => {
  try {
    const resume = await createResumeService(req.user.id, req.body);
    return res.status(201).json(goodResponse({ data: resume }, 'Resume saved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await updateResumeService(req.user.id, id, req.body);
    return res.json(goodResponse({ data: resume }, 'Resume updated successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const result = await getMyResumesService(req.user.id, req.query);
    return res.json(goodResponse(result, 'Resumes retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await getResumeByIdService(req.user.id, id, req.user?.role);
    return res.json(goodResponse({ data: resume }, 'Resume retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteResumeService(req.user.id, id);
    return res.json(goodResponse({}, 'Resume deleted successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const downloadResumePdf = async (req, res) => {
  try {
    const { buffer, filename } = await generateResumePdfService(req.body, req.user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    return res.send(buffer);
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};
