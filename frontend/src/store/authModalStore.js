import { create } from 'zustand';

export const useAuthModalStore = create((set) => ({
  isOpen: false,
  mode: 'login', // 'login' | 'register' | 'otp'
  onSuccess: null,
  email: '',
  otp: '',

  openAuthModal: (mode = 'login', options = {}) => {
    if (typeof options === 'function') {
      set({ isOpen: true, mode, onSuccess: options, email: '', otp: '' });
    } else {
      set({
        isOpen: true,
        mode,
        onSuccess: options?.onSuccess || null,
        email: options?.email || '',
        otp: options?.otp || '',
      });
    }
  },

  closeAuthModal: () =>
    set({ isOpen: false, onSuccess: null, email: '', otp: '' }),

  setMode: (mode) =>
    set({ mode }),

  setEmail: (email) =>
    set({ email }),

  setOtp: (otp) =>
    set({ otp }),
}));

