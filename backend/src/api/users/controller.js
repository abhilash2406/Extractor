import { getUsersService, getUserService, updateUserStatusService, getUserResumeService, getProfileService, updateProfileService } from './service.js';

export const getUsers = async (req, res, next) => {
  try {
    const result = await getUsersService(req.query);
    return res.json({ success: true, ...result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserService(id);
    return res.json({ success: true, data: user });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateUserStatusService(id, status);
    return res.json({ success: true, message: `User status updated to ${status}` });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getUserResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resumeUrl = await getUserResumeService(id);
    return res.json({ success: true, data: resumeUrl });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const data = await getProfileService(req.user.id);
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await updateProfileService(req.user.id, req.body, req.file);
    return res.json({ success: true, message: 'Profile updated successfully', data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
