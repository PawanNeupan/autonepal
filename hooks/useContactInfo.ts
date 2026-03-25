import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useContactInfo() {
  return useQuery({
    queryKey: ['contact-info'],
    queryFn: async () => {
      const { data } = await api.get('/api/contact-info');
      return data;
    },
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.put('/api/contact-info', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contact-info'] }),
  });
}