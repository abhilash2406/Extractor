import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'X-Portal': 'user',
  },
});

// Clean up empty parameters globally and attach portal header
axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['X-Portal'] = 'user';
  if (config.params) {
    Object.keys(config.params).forEach((key) => {
      if (config.params[key] === '' || config.params[key] === null || config.params[key] === undefined) {
        delete config.params[key];
      }
    });
  }

  return config;
});

// Handle 401 & 403 (blocked/inactive) globally — clear store and notify user
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const isBlocked = data?.isBlocked || data?.message?.toLowerCase().includes('block');
    const isInactive = data?.message?.toLowerCase().includes('not active') || data?.message?.toLowerCase().includes('inactive');

    if (status === 401) {
      if (useAuthStore.getState().isAuthenticated) {
        useAuthStore.getState().logout();
      }
    } else if (status === 403 && (isBlocked || isInactive)) {
      useAuthStore.getState().logout();
      toast.error(data?.message || 'Your account has been blocked. Please contact support.', {
        id: 'account-status-error',
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

