import { create } from 'zustand';

export const useAuthModalStore = create((set) => ({
  isOpen: false,
  mode: 'login', // 'login' | 'register'
  onSuccess: null,

  openAuthModal: (mode = 'login', onSuccess = null) =>
    set({ isOpen: true, mode, onSuccess }),

  closeAuthModal: () =>
    set({ isOpen: false, onSuccess: null }),

  setMode: (mode) =>
    set({ mode }),
}));
