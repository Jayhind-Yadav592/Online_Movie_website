import { create } from 'zustand';
import api from '@/lib/axios';

export interface Profile {
  id: number;
  name: string;
  avatar: string;
  is_kids: boolean;
}

interface User {
  id: number;
  email: string;
  avatar: string | null;
  role: string;
  profiles: Profile[];
}

interface AuthState {
  user: User | null;
  activeProfile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setActiveProfile: (profile: Profile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activeProfile: null,
  isAuthenticated: false,
  isLoading: true,
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  login: (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, activeProfile: null, isAuthenticated: false });
  },
  fetchUser: async () => {
    try {
      const response = await api.get('/auth/profile/');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
