import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useSellRequests(filters: { status?: string } = {}) {
  return useQuery({
    queryKey: ['sell-requests', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      const { data } = await api.get(`/api/sell-requests?${params.toString()}`);
      return data;
    },
  });
}

export function useSubmitSellRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/api/sell-requests', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sell-requests'] }),
  });
}

export function useDeleteSellRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/sell-requests/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sell-requests'] }),
  });
}