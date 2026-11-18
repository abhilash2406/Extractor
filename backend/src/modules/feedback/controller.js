import { goodResponse, failedResponse } from '../../common/response.js';
import {
  createFeedbackService,
  getFeedbacksService,
  getFeedbackByIdService,
  updateFeedbackService,
  deleteFeedbackService,
} from './service.js';

export const createFeedback = async (req, res) => {
  try {
    const feedback = await createFeedbackService(req.body, req.user || null);
    return res.status(201).json(goodResponse({ data: feedback }, 'Thank you! Your feedback has been submitted.'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const result = await getFeedbacksService(req.query);
    return res.json(goodResponse(result, 'Feedback entries retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 500;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'Error'));
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await getFeedbackByIdService(req.params.id);
    return res.json(goodResponse({ data: feedback }, 'Feedback retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const feedback = await updateFeedbackService(req.params.id, req.body);
    return res.json(goodResponse({ data: feedback }, 'Feedback updated successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    await deleteFeedbackService(req.params.id);
    return res.json(goodResponse({}, 'Feedback deleted successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};
