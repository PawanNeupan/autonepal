'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Fuel, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
import { useToggleFavorite, useFavorites } from '@/hooks/useFavorites';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface CarImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
}

interface Car {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  kmDriven?: number;
  km?: number;
  fuelType?: string;
  fuel?: string;
  transmission: string;
  images?: CarImage[];
  image?: string;
  isFeatured: boolean;
  status: string;
  make?: string;
  brand?: string;
  year?: number;
}

export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const router = useRouter();

  const { isAuthenticated }                         = useAuthStore();
  const { data: favData }                           = useFavorites();
  const { mutateAsync: toggleFavorite, isPending }  = useToggleFavorite();

  // Support both real API (MongoDB) and placeholder data
  const carId      = car._id || car.id || '';
  const km         = car.kmDriven ?? car.km ?? 0;
  const fuel       = car.fuelType || car.fuel || '';
  const primaryImg = car.images?.find((img) => img.isPrimary)?.url
                  || car.images?.[0]?.url
                  || car.image
                  || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80';

  // Check if this car is already favorited
  const isFavorited = favData?.favorites?.some(
    (fav: any) => fav.car?._id === carId || fav.car === carId
  ) || false;

  const statusConfig: Record<string, { label: string; class: string }> = {
    available:   { label: '● Available',   class: 'bg-green-500/20 text-green-400 border-green-500/30' },
    reserved:    { label: '● Reserved',    class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    sold:        { label: '● Sold',        class: 'bg-red-500/20 text-red-400 border-red-500/30' },
    maintenance: { label: '● Maintenance', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    pending:     { label: '● Pending',     class: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  };

  const status = statusConfig[car.status] || statusConfig.available;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      router.push('/login');
      return;
    }

    if (!carId) return;

    try {
      const res = await toggleFavorite(carId);
      toast.success(res.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative group bg-card rounded-2xl overflow-hidden border border-border hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300"
    >
      {car.isFeatured && <BorderBeam size={200} duration={8} />}

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={primaryImg}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="outline"
            className={`text-xs font-medium backdrop-blur-sm ${status.class}`}
          >
            {status.label}
          </Badge>
        </div>

        {/* Featured badge */}
        {car.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-600/90 text-white text-xs border-0 backdrop-blur-sm">
              Featured
            </Badge>
          </div>
        )}

        {/* Favorite button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleFavorite}
          disabled={isPending}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
            isFavorited
              ? 'bg-red-600/80 text-white'
              : 'bg-black/50 text-white/60 hover:text-red-500 hover:bg-black/70'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </motion.button>

        {/* Sold overlay */}
        {car.status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-black text-2xl tracking-widest rotate-[-15deg] border-4 border-white/50 px-4 py-1 rounded">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-foreground mb-1 truncate">{car.title}</h3>
        <div className="text-red-500 font-black text-xl mb-3">
          NPR {car.price.toLocaleString()}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-muted-foreground text-xs mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            {km.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            {fuel}
          </div>
          <div className="text-muted-foreground/60">{car.transmission}</div>
        </div>

        <Link href={`/cars/${carId}`}>
          <Button
            disabled={car.status === 'sold'}
            className="w-full h-9 bg-accent hover:bg-red-600 text-foreground hover:text-white border border-border hover:border-red-600 transition-all duration-300 text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {car.status === 'sold' ? 'Sold Out' : 'View Details'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}