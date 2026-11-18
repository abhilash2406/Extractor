import axiosInstance from './axiosInstance';

/**
 * Submit user feedback, bug report, feature request, or inquiry
 * @param {{ name: string, email: string, category: string, subject: string, message: string, rating?: number }} data
 */
export const submitFeedback = (data) => axiosInstance.post('/feedback', data);
