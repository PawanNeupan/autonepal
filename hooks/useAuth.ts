import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export const useAuth = () => {
  const { user, isAuthenticated, accessToken, setUser, logout } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    setUser(res.data.user, res.data.accessToken);
    return res.data;
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      phone,
      password,
    });
    setUser(res.data.user, res.data.accessToken);
    return res.data;
  };

  const logoutUser = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      logout();
      router.push('/');
    }
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    accessToken,
    isAdmin,
    login,
    register,
    logout: logoutUser,
  };
};