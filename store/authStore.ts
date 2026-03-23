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
  setUser: (user: IUser, accessToken?: string) => void;
  updateUser: (user: Partial<IUser>) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // accepts optional accessToken so both
      // setUser(user, token) and setUser(user) work
      setUser: (user, accessToken) =>
        set((state) => ({
          user,
          isAuthenticated: true,
          accessToken: accessToken ?? state.accessToken,
        })),

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),

      setAccessToken: (token) => set({ accessToken: token }),

      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user:            state.user,
        accessToken:     state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);