import axiosInstance from './axiosInstance';

export const getDashboardStats = () => axiosInstance.get('/dashboard/stats');
export const getUserGrowth = (months = 10) => axiosInstance.get('/dashboard/user-growth', { params: { months } });
export const getTopTemplates = (limit = 5) => axiosInstance.get('/dashboard/top-templates', { params: { limit } });
export const getRecentUsers = (limit = 5) => axiosInstance.get('/dashboard/recent-users', { params: { limit } });
export const getCandidateDashboardStats = () => axiosInstance.get('/dashboard/candidate');
