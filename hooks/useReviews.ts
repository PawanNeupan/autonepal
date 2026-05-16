import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useReviews(page = 1) {
  return useQuery({
    queryKey: ['reviews', page],
    queryFn: async () => {
      const { data } = await api.get(`/api/reviews?page=${page}`);
      return data;
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/reviews/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await api.put(`/api/reviews/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { carId: string; rating: number; comment?: string }) => {
      const { data } = await api.post('/api/reviews', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  });
}