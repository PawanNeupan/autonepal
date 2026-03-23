import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/api/profile');
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser     = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: async (payload: { name: string; phone?: string; avatar?: any }) => {
      const { data } = await api.put('/api/profile', payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (data.user) setUser(data.user);
    },
  });
}