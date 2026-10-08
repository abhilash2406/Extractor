import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'X-Portal': 'admin',
  },
});

// Clean up empty parameters globally and attach portal header
axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['X-Portal'] = 'admin';
  if (config.params) {
    Object.keys(config.params).forEach((key) => {
      if (config.params[key] === '' || config.params[key] === null || config.params[key] === undefined) {
        delete config.params[key];
      }
    });
  }

  return config;
});

// Handle 401 globally — clear store and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

