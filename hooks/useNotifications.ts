import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export function useNotifications() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/api/notifications');
      return data;
    },
    enabled:         isAuthenticated,
    refetchInterval: 30000,
    retry:           false,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/api/notifications');
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/api/notifications/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      userId?:  string;
      title:    string;
      message:  string;
      type?:    string;
    }) => {
      const { data } = await api.post('/api/notifications', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    onError: (error: any) => {
      console.error('Send notification error:', error?.response?.data);
    },
  });
}