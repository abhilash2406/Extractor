import axiosInstance from './axiosInstance';

/**
 * Get templates with pagination and filtering
 * @param {Object} params - { page, limit, search, category, status, sortBy, sortOrder }
 */
export const getTemplates = (params) => axiosInstance.get('/templates', { params });

/**
 * Get single template by UUID or code slug
 * @param {string} idOrCode
 */
export const getTemplate = (idOrCode) => axiosInstance.get(`/templates/${idOrCode}`);

/**
 * Create a new template (Admin)
 * @param {Object} data - template payload
 */
export const createTemplate = (data) => axiosInstance.post('/templates', data);

/**
 * Update an existing template (Admin)
 * @param {string} id
 * @param {Object} data
 */
export const updateTemplate = (id, data) => axiosInstance.put(`/templates/${id}`, data);

/**
 * Update template publication status (Admin)
 * @param {string} id
 * @param {'draft' | 'published' | 'archived' | 'deleted'} status
 */
export const updateTemplateStatus = (id, status) =>
  axiosInstance.patch(`/templates/${id}/status`, { status });

/**
 * Duplicate a template as a new draft (Admin)
 * @param {string} id
 */
export const duplicateTemplate = (id) => axiosInstance.post(`/templates/${id}/duplicate`);

/**
 * Delete a template (Admin)
 * @param {string} id
 */
export const deleteTemplate = (id) => axiosInstance.delete(`/templates/${id}`);

/**
 * Upload thumbnail image for a template (Admin)
 * @param {string} id
 * @param {FormData} formData
 */
export const uploadThumbnail = (id, formData) =>
  axiosInstance.post(`/templates/${id}/thumbnail`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
