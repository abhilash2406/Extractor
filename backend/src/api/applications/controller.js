import { getApplicationsService, uploadResumeService, createApplicationService, getMyApplicationsService, getCurrentResumeService, updateApplicationStatusService } from './service.js';

export const getApplications = async (req, res, next) => {
  try {
    const result = await getApplicationsService(req.query);
    return res.json({ success: true, ...result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file' });
    }
    const result = await uploadResumeService(userId, req.file.buffer, req.file.mimetype, req.file.originalname);
    return res.json({ success: true, data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { job_role_id } = req.body;
    const application = await createApplicationService(userId, job_role_id);
    return res.json({ success: true, data: application, message: 'Application submitted successfully!' });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applications = await getMyApplicationsService(userId);
    return res.json({ success: true, data: applications });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getCurrentResume = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await getCurrentResumeService(userId);
    return res.json({ success: true, data: result }); // Returns null if no resume
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedApplication = await updateApplicationStatusService(id, status);
    return res.json({ success: true, data: updatedApplication, message: 'Application status updated successfully' });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
