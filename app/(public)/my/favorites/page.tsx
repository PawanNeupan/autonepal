'use client';

import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { toast } from 'sonner';
import Link from 'next/link';
import CarCard from '@/components/cars/CarCard';

export default function FavoritesPage() {
  const { data, isLoading }                        = useFavorites();
  const { mutateAsync: toggleFavorite, isPending } = useToggleFavorite();
  const favorites                                  = data?.favorites || [];

  const handleRemove = async (carId: string) => {
    try {
      await toggleFavorite(carId);
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-foreground">My Favorites</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {favorites.length} saved {favorites.length === 1 ? 'car' : 'cars'}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-card border border-border rounded-2xl"
          >
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-semibold mb-2">No favorites yet</p>
            <p className="text-muted-foreground text-sm mb-6">Save cars you love to compare later</p>
            <Link href="/cars">
              <Button className="bg-red-600 hover:bg-red-500 text-white">Browse Cars</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((fav: any, i: number) => (
              <motion.div
                key={fav._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative"
              >
                <CarCard car={fav.car} />
                <button
                  onClick={() => handleRemove(fav.car._id)}
                  disabled={isPending}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
                  title="Remove from favorites"
                >
                  <Heart className="w-4 h-4 fill-white" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}