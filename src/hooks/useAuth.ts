import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      register: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'unizik-auth-storage',
    }
  )
);
