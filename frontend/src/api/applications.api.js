import axiosInstance from './axiosInstance';

export const getApplications = (params) => axiosInstance.get('/applications', { params });

export const getApplication = (id) => axiosInstance.get(`/applications/${id}`);

export const getMyApplications = () => axiosInstance.get('/applications/me');

export const getCurrentResume = () => axiosInstance.get('/applications/resume');

export const uploadResume = (formData) => {
  return axiosInstance.post('/applications/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createApplication = (data) => {
  return axiosInstance.post('/applications', data);
};

export const updateApplicationStatus = (id, status) => {
  return axiosInstance.put(`/applications/${id}/status`, { status });
};
