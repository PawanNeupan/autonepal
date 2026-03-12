'use client';

import { useParams } from 'next/navigation';
import { useCar } from '@/hooks/useCars';
import CarForm from '@/components/admin/CarForm';
import { Loader2 } from 'lucide-react';

export default function EditCarPage() {
  const { id } = useParams();
  const { data: car, isLoading } = useCar(id as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return <CarForm mode="edit" car={car} />;
}