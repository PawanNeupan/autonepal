import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  avatar: { url: string; publicId: string };
  isBanned: boolean;
}

interface AuthStore {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: IUser, accessToken: string) => void;
  updateUser: (user: Partial<IUser>) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),

      setAccessToken: (token) => set({ accessToken: token }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);