import { create } from 'zustand';

/* interface User {
  id: number;
  email: string;
  role: string;
  address: string,
  phone: string
} */

interface AuthState {
  accessToken: string | null;
  /* user: User | null; */
  setAccessToken: (token: string | null) => void;
  /* setUser: (userData: User | null) => void; */
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  /* setUser: (userData) => set({ user: userData }), */
  logout: () => set({ accessToken: null, /* user: null */ }),
}));