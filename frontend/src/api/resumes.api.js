import axiosInstance from './axiosInstance';

/**
 * Save new resume for logged-in user
 * @param {Object} data - { title, template_id, content }
 */
export const saveResume = (data) => axiosInstance.post('/resumes', data);

/**
 * Update an existing saved resume
 * @param {string} id - Resume UUID
 * @param {Object} data - { title, template_id, content }
 */
export const updateResume = (id, data) => axiosInstance.put(`/resumes/${id}`, data);

/**
 * Get all resumes for current logged-in user
 * @param {Object} params - { page, limit }
 */
export const getMyResumes = (params) => axiosInstance.get('/resumes/my', { params });

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
 * Generate and download PDF from backend
 * Accepts payload with { content, template_id, title, accentColor, resumeId? }
 * Returns a binary Blob response
 */
export const downloadResumePdf = (payload) =>
  axiosInstance.post('/resumes/download-pdf', payload, {
    responseType: 'blob',
  });
