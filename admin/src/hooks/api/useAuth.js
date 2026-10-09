import { useMutation } from '@tanstack/react-query';
import * as authApi from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { login, logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data: res }) => {
      if (!res?.success) {
        logout();
        toast.error(res?.message || 'Login failed');
        return;
      }
      const user = res.data?.user || res.data;

      if (user?.role !== 'ADMIN') {
        logout();
        toast.error('Access denied. Administrator privileges required.');
        return;
      }

      login(user);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      navigate('/login');
    },
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => toast.success('Reset link sent! Check your email.'),
    onError: (err) => toast.error(err.response?.data?.message || 'Request failed'),
  });

export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully!');
      navigate('/login');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Reset failed'),
  });
};
