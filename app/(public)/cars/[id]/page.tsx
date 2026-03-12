'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Heart, Share2, Fuel, Gauge, Calendar,
  Settings, MapPin, Shield, Phone, MessageCircle,
  ChevronLeft, ChevronRight, Check, Clock, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useCar } from '@/hooks/useCars';

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const { data: car, isLoading, isError } = useCar(id as string);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % (car?.images?.length || 1));
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + (car?.images?.length || 1)) % (car?.images?.length || 1));

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      router.push('/login');
      return;
    }
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      router.push('/login');
      return;
    }
    router.push(`/appointments/book?carId=${car._id}`);
  };

  const handleNegotiate = () => {
    if (!isAuthenticated) {
      toast.error('Please login to negotiate');
      router.push('/login');
      return;
    }
    router.push(`/negotiations/new?carId=${car._id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  // Error state
  if (isError || !car) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🚗</div>
        <h2 className="text-xl font-bold text-foreground">Car not found</h2>
        <p className="text-muted-foreground">This listing may have been removed.</p>
        <Link href="/cars">
          <Button className="bg-red-600 hover:bg-red-500 text-white">
            Browse All Cars
          </Button>
        </Link>
      </div>
    );
  }

  const images     = car.images?.length > 0
    ? car.images.map((img: any) => img.url)
    : ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=85'];

  const statusConfig: Record<string, { label: string; class: string }> = {
    available:   { label: '● Available',   class: 'bg-green-500/20 text-green-400 border-green-500/30' },
    reserved:    { label: '● Reserved',    class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    sold:        { label: '● Sold',        class: 'bg-red-500/20 text-red-400 border-red-500/30' },
    maintenance: { label: '● Maintenance', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    pending:     { label: '● Pending',     class: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  };

  const status = statusConfig[car.status] || statusConfig.available;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to listings
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">

            {/* Image gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main image */}
              <div className="relative h-85 sm:h-115 rounded-2xl overflow-hidden bg-muted">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={images[currentImage]}
                    alt={car.title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                  {currentImage + 1} / {images.length}
                </div>

                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className={`backdrop-blur-sm text-xs font-medium ${status.class}`}>
                    {status.label}
                  </Badge>
                </div>

                {car.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-600/90 text-white text-xs border-0 backdrop-blur-sm">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        currentImage === i
                          ? 'border-red-500 opacity-100'
                          : 'border-transparent opacity-50 hover:opacity-75'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Title + actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-start justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground">{car.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  Kathmandu, Nepal
                  <span className="text-border">·</span>
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(car.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleFavorite}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                    isFavorited
                      ? 'bg-red-600/10 border-red-500/50 text-red-500'
                      : 'bg-accent border-border text-muted-foreground hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-xl border bg-accent border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Specs grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { icon: Gauge,    label: 'Mileage',      value: `${car.kmDriven?.toLocaleString()} km` },
                { icon: Fuel,     label: 'Fuel',         value: car.fuelType },
                { icon: Settings, label: 'Transmission', value: car.transmission },
                { icon: Calendar, label: 'Year',         value: car.year },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
                  <Icon className="w-4 h-4 text-red-500 mx-auto mb-1.5" />
                  <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
                  <div className="font-bold text-foreground text-sm">{value}</div>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            {car.description && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <h2 className="font-bold text-foreground mb-3">About This Car</h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </motion.div>
            )}

            {/* Features */}
            {car.features?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <h2 className="font-bold text-foreground mb-4">Features & Equipment</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {car.features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-red-600/10 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-red-500" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Specs table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <h2 className="font-bold text-foreground mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-0">
                {[
                  { label: 'Make',         value: car.make },
                  { label: 'Model',        value: car.carModel },
                  { label: 'Year',         value: car.year },
                  { label: 'Color',        value: car.color },
                  { label: 'Engine',       value: car.engineCC ? `${car.engineCC} cc` : '—' },
                  { label: 'Body Type',    value: car.bodyType },
                  { label: 'Condition',    value: car.condition },
                  { label: 'Fuel Type',    value: car.fuelType },
                  { label: 'Transmission', value: car.transmission },
                  { label: 'KM Driven',    value: `${car.kmDriven?.toLocaleString()} km` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-border col-span-1 px-1">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-xs font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="sticky top-24 space-y-4">

              {/* Price card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="text-3xl font-black text-foreground mb-1">
                  NPR {car.price?.toLocaleString()}
                </div>
                <p className="text-muted-foreground text-xs mb-5">
                  Negotiable · eSewa accepted
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={handleBookAppointment}
                    disabled={car.status === 'sold'}
                    className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>

                  <Button
                    onClick={handleNegotiate}
                    disabled={car.status === 'sold'}
                    variant="outline"
                    className="w-full h-12 border-border hover:border-red-500/50 hover:bg-red-500/5 font-semibold rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Negotiate Price
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 border-border font-semibold rounded-xl"
                    onClick={() => toast.info('Call: +977 98XXXXXXXX')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Dealer
                  </Button>
                </div>

                <Separator className="my-5" />

                <div className="space-y-2.5">
                  {[
                    { icon: Shield, text: 'Verified listing by AutoNepal' },
                    { icon: Check,  text: 'No hidden charges' },
                    { icon: Clock,  text: 'Quick response guaranteed' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Icon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dealer card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground text-sm mb-4">Listed By</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-red-600 text-white font-bold text-sm">AN</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground text-sm">AutoNepal Team</div>
                    <div className="text-xs text-muted-foreground">Official Dealer</div>
                  </div>
                  <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 text-xs" variant="outline">
                    Verified
                  </Badge>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}