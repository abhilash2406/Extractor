import { goodResponse, failedResponse } from '../../common/response.js';
import { getUsersService, getUserService, updateUserStatusService, getUserResumeService, getProfileService, updateProfileService } from './service.js';

export const getUsers = async (req, res, next) => {
  try {
    const result = await getUsersService(req.query);
    return res.json(goodResponse(result, 'Users retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserService(id);
    return res.json(goodResponse({ data: user }, 'User retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateUserStatusService(id, status);
    return res.json(goodResponse({}, `User status updated to ${status}`));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const getUserResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resumeUrl = await getUserResumeService(id);
    return res.json(goodResponse({ data: resumeUrl }, 'Resume retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const data = await getProfileService(req.user.id);
    return res.json(goodResponse({ data }, 'Profile retrieved successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await updateProfileService(req.user.id, req.body, req.file);
    return res.json(goodResponse({ data }, 'Profile updated successfully'));
  } catch (e) {
    const status = e.statusCode || e.status || 400;
    return res.status(status).json(failedResponse(e.message, status, e.name || 'BadRequest'));
  }
};
