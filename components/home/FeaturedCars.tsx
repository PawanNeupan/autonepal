'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeaturedCars } from '@/hooks/useCars';
import CarCard from '@/components/cars/CarCard';

export default function FeaturedCars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { data: cars, isLoading, isError } = useFeaturedCars();

  return (
    <section className="py-24 bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-medium mb-2">
              Handpicked For You
            </p>
            <h2 className="text-4xl font-black text-foreground">Featured Cars</h2>
          </div>
          <Link
            href="/cars"
            className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors group"
          >
            View all cars
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-24">
            <p className="text-muted-foreground">Failed to load cars. Please try again.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && (!cars || cars.length === 0) && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🚗</div>
            <p className="text-muted-foreground">No featured cars yet.</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && cars && cars.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cars.map((car: any, i: number) => (
              <CarCard key={car._id} car={car} index={i} />
            ))}
          </div>
        )}

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/cars">
            <Button variant="outline" className="border-border text-foreground">
              View All Cars
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}