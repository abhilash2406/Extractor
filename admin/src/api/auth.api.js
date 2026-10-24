import axiosInstance from './axiosInstance';

export const login = (data) => axiosInstance.post('/auth/login', data);
export const forgotPassword = (data) => axiosInstance.post('/auth/forgot-password', data);
export const resetPassword = (data) => axiosInstance.post('/auth/reset-password', data);
export const changePassword = (data) => axiosInstance.put('/auth/change-password', data);
export const logout = () => axiosInstance.post('/auth/logout');

