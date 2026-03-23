import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useNegotiations(filters: { status?: string } = {}) {
  return useQuery({
    queryKey: ['negotiations', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      const { data } = await api.get(`/api/negotiations?${params.toString()}`);
      return data;
    },
  });
}

export function useSubmitNegotiation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { carId: string; offeredPrice: number; message?: string }) => {
      const { data } = await api.post('/api/negotiations', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['negotiations'] }),
  });
}

export function useUpdateNegotiation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: res } = await api.put(`/api/negotiations/${id}`, data);
      return res;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['negotiations'] }),
  });
}