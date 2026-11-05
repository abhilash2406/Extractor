import axiosInstance from './axiosInstance';

/**
 * Save new resume for logged-in user (Subject to plan limit - max 3 for free)
 * @param {Object} data - { title, template_id, content }
 */
export const saveResume = (data) => axiosInstance.post('/resumes', data);

/**
 * Update an existing saved resume (automatically creates a version snapshot when content changes)
 * @param {string} id - Resume UUID
 * @param {Object} data - { title, template_id, content }
 */
export const updateResume = (id, data) => axiosInstance.put(`/resumes/${id}`, data);

/**
 * Get all resumes for current logged-in user
 * @param {Object} params - { page, limit, sortBy, sortOrder }
 */
export const getMyResumes = (params) => axiosInstance.get('/resumes/my', { params });

/**
 * Get user's latest edited resume to automatically load in builder
 */
export const getLatestResume = () => axiosInstance.get('/resumes/latest');

/**
 * Get resume usage statistics for current user (count, limit, canCreate, isPro)
 */
export const getResumeUsage = () => axiosInstance.get('/resumes/usage');

/**
 * Get single resume by ID
 * @param {string} id
 */
export const getResumeById = (id) => axiosInstance.get(`/resumes/${id}`);

/**
 * Delete a resume
 * @param {string} id
 */
export const deleteResume = (id) => axiosInstance.delete(`/resumes/${id}`);

/**
 * Get all versions for a resume
 * @param {string} resumeId
 */
export const getResumeVersions = (resumeId) => axiosInstance.get(`/resumes/${resumeId}/versions`);

/**
 * Get a specific version snapshot
 * @param {string} resumeId
 * @param {string} versionId
 */
export const getResumeVersionById = (resumeId, versionId) =>
  axiosInstance.get(`/resumes/${resumeId}/versions/${versionId}`);

/**
 * Restore a previous version snapshot into the current resume
 * @param {string} resumeId
 * @param {string} versionId
 */
export const restoreResumeVersion = (resumeId, versionId) =>
  axiosInstance.post(`/resumes/${resumeId}/versions/${versionId}/restore`);

/**
 * Generate and download PDF from backend
 * Accepts payload with { content, template_id, title, accentColor, resumeId? }
 * Returns a binary Blob response
 */
export const downloadResumePdf = (payload) =>
  axiosInstance.post('/resumes/download-pdf', payload, {
    responseType: 'blob',
  });
