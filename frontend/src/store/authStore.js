import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => {
        if (!user) return;
        set({ user, isAuthenticated: true });
      },

      logout: () =>
        set({ user: null, isAuthenticated: false }),

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // saves only user profile info in localStorage for seamless UI render
    }
  )
);

