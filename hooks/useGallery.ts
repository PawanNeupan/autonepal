import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data } = await api.get('/api/gallery');
      return data;
    },
  });
}

export function useAddGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      url: string; publicId: string;
      caption?: string; category?: string; order?: number;
    }) => {
      const { data } = await api.post('/api/gallery', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/gallery/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });
}

export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: res } = await api.put(`/api/gallery/${id}`, data);
      return res;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });
}