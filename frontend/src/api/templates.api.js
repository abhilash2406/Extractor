import axiosInstance from './axiosInstance';

/**
 * Get published resume templates for candidates
 * @param {Object} params - { page, limit, search, category, sortBy, sortOrder }
 */
export const getPublishedTemplates = (params) => axiosInstance.get('/templates', { params });

/**
 * Get single template by ID or code slug
 * @param {string} idOrCode
 */
export const getTemplateDetails = (idOrCode) => axiosInstance.get(`/templates/${idOrCode}`);
