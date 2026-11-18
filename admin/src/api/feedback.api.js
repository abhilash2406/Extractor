import axiosInstance from './axiosInstance';

/**
 * List feedback inquiries with filtering & pagination (Admin)
 * @param {Object} params - { page, limit, search, category, status, sortOrder }
 */
export const getFeedbacks = (params) => axiosInstance.get('/feedback', { params });

/**
 * Get single feedback entry by ID (Admin)
 */
export const getFeedbackById = (id) => axiosInstance.get(`/feedback/${id}`);

/**
 * Update feedback status (ENUM: NEW | IN_REVIEW | RESOLVED | CLOSED) and/or admin_notes
 */
export const updateFeedback = (id, data) => axiosInstance.patch(`/feedback/${id}`, data);

/**
 * Delete a feedback entry (Admin)
 */
export const deleteFeedback = (id) => axiosInstance.delete(`/feedback/${id}`);
