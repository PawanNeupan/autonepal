import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface CarFilters {
  search?:       string;
  brand?:        string;
  fuel?:         string;
  transmission?: string;
  minPrice?:     number;
  maxPrice?:     number;
  sort?:         string;
  page?:         number;
  limit?:        number;
  featured?:     boolean;
}

// ── Fetch all cars with filters
export function useCars(filters: CarFilters = {}) {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== '') {
          params.append(key, String(val));
        }
      });
      const { data } = await api.get(`/api/cars?${params.toString()}`);
      return data;
    },
  });
}

// ── Fetch single car
export function useCar(id: string) {
  return useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/cars/${id}`);
      return data.car;
    },
    enabled: !!id,
  });
}

// ── Fetch featured cars
export function useFeaturedCars() {
  return useQuery({
    queryKey: ['cars', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/api/cars/featured');
      return data.cars;
    },
  });
}

// ── Create car (admin)
export function useCreateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (carData: any) => {
      const { data } = await api.post('/api/cars', carData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}

// ── Update car (admin)
export function useUpdateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: res } = await api.put(`/api/cars/${id}`, data);
      return res;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['car', id] });
    },
  });
}

// ── Delete car (admin)
export function useDeleteCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/cars/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}

// ── Upload images
export function useUploadCarImages() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const { data } = await api.post('/api/cars/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.images as { url: string; publicId: string; isPrimary: boolean; order: number }[];
    },
  });
}