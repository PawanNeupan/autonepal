'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Heart, Fuel, Gauge, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';

const PLACEHOLDER_CARS = [
  {
    id: '1',
    title: 'Toyota Fortuner 2022',
    price: 8500000,
    km: 45000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
    isFeatured: true,
    status: 'available',
  },
  {
    id: '2',
    title: 'Hyundai Creta 2023',
    price: 5200000,
    km: 12000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&q=80',
    isFeatured: true,
    status: 'available',
  },
  {
    id: '3',
    title: 'Suzuki Jimny 2023',
    price: 4800000,
    km: 8000,
    fuel: 'Petrol',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',
    isFeatured: false,
    status: 'available',
  },
  {
    id: '4',
    title: 'KIA Sportage 2022',
    price: 6900000,
    km: 32000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80',
    isFeatured: false,
    status: 'reserved',
  },
];

function CarCard({ car, index }: { car: typeof PLACEHOLDER_CARS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group bg-card rounded-2xl overflow-hidden border border-border hover:border-border/80 transition-all duration-300"
    >
      {/* Featured border beam */}
      {car.isFeatured && <BorderBeam size={200} duration={8} />}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`text-xs font-medium ${
              car.status === 'available'
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}
            variant="outline"
          >
            {car.status === 'available' ? '● Available' : '● Reserved'}
          </Badge>
        </div>

        {/* Featured badge */}
        {car.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-600/90 text-white text-xs border-0">
              Featured
            </Badge>
          </div>
        )}

        {/* Favorite button */}
        <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-red-500 hover:bg-black/70 transition-all">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-foreground mb-1">{car.title}</h3>
        <div className="text-red-500 font-black text-xl mb-3">
          NPR {car.price.toLocaleString()}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-muted-foreground text-xs mb-4">
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            {car.km.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            {car.fuel}
          </div>
          <div className="text-muted-foreground/60">{car.transmission}</div>
        </div>

        <Link href={`/cars/${car.id}`}>
          <Button
            className="w-full h-9 bg-accent hover:bg-red-600 text-foreground hover:text-white border border-border hover:border-red-600 transition-all duration-300 text-sm font-medium rounded-xl"
          >
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturedCars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

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

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLACEHOLDER_CARS.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>

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