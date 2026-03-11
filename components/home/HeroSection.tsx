'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/cars?search=${search}`);
  };

  return (
    <section className="relative min-h-svh flex items-center overflow-hidden bg-black">

      {/* Background image slideshow */}
      {[
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1800&q=85',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1800&q=85',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1800&q=85',
      ].map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: i * 4,
            times: [0, 0.08, 0.92, 1],
          }}
        >
          <Image
            src={src}
            alt="Premium car"
            fill
            className="object-cover object-center scale-105"
            priority={i === 0}
            unoptimized
          />
        </motion.div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      {/* Speed lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px pointer-events-none"
          style={{
            top: `${20 + i * 12}%`,
            left: 0, right: 0,
            background: 'linear-gradient(to right, transparent, rgba(232,0,26,0.15), transparent)',
          }}
          animate={{ x: ['-100%', '100%'], opacity: [0, 1, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'linear',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl space-y-6">

          {/* Badge */}
          <motion.div {...fadeUp(0.1)}>
            <AnimatedGradientText className="inline-flex items-center gap-2 text-xs font-medium">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-red-500"
              />
              Nepal&apos;s #1 Premium Auto Marketplace
            </AnimatedGradientText>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.2)}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight"
          >
            Find Your
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-red-400">
              Perfect Drive
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.3)}
            className="text-white/50 text-lg leading-relaxed max-w-lg"
          >
            Buy certified pre-owned vehicles, sell your car at the best price.
            Trusted by 1,200+ customers across Nepal.
          </motion.p>

          {/* Search bar */}
          <motion.form
            {...fadeUp(0.4)}
            onSubmit={handleSearch}
            className="flex gap-2 max-w-lg"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search make, model, year..."
                className="h-12 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:border-red-500 focus:bg-white/15 transition-all rounded-xl"
              />
            </div>
            <ShimmerButton
              type="submit"
              className="h-12 px-6 rounded-xl font-semibold text-sm"
            >
              Search
            </ShimmerButton>
          </motion.form>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3">
            <Link href="/cars">
              <ShimmerButton className="h-11 px-6 rounded-xl font-semibold text-sm">
                Browse All Cars
              </ShimmerButton>
            </Link>
            <Link href="/sell">
              <Button
                variant="outline"
                className="h-11 px-6 rounded-xl font-semibold text-sm border-white/20 bg-white/5 text-white hover:bg-white/15 hover:border-white/40 backdrop-blur-sm transition-all"
              >
                Sell Your Car
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

    </section>
  );
}