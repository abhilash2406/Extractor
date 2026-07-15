import {
  createJobService,
  getJobsService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
  generateJobDescriptionService,
} from './service.js';

export const createJob = async (req, res, next) => {
  try {
    const data = await createJobService(req.body);
    return res.status(201).json({ success: true, message: 'Job created successfully', data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const result = await getJobsService(req.query);
    return res.json({ success: true, ...result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const data = await getJobByIdService(req.params.id);
    return res.json({ success: true, data });
  } catch (e) {
    const status = e.message === 'Job not found' ? 404 : 400;
    return res.status(status).json({ success: false, message: e.message });
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const data = await updateJobService(req.params.id, req.body);
    return res.json({ success: true, message: 'Job updated successfully', data });
  } catch (e) {
    const status = e.message === 'Job not found' ? 404 : 400;
    return res.status(status).json({ success: false, message: e.message });
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const data = await deleteJobService(req.params.id);
    return res.json({ success: true, message: data.message });
  } catch (e) {
    const status = e.message === 'Job not found' ? 404 : 400;
    return res.status(status).json({ success: false, message: e.message });
  }
};

export const generateJobDescription = async (req, res, next) => {
  try {
    const description = await generateJobDescriptionService(req.body);
    return res.json({ success: true, data: description });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
