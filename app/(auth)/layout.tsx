'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Car, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Real car images from Unsplash (free, no attribution needed)
const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=90', // Porsche
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90', // BMW M4
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90', // Porsche rear
];

function BackgroundSlideshow() {
  return (
    <div className="absolute inset-0">
      {CAR_IMAGES.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: i * 4,
            times: [0, 0.1, 0.9, 1],
            ease: 'easeInOut',
          }}
        >
          <Image
            src={src}
            alt="Premium car"
            fill
            className="object-cover object-center"
            priority={i === 0}
            unoptimized
          />
        </motion.div>
      ))}

      {/* Deep dark overlay — cinematic */}
      <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/80 to-black/40" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />

      {/* Subtle grain texture for realism */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
}

function FloatingStats() {
  const stats = [
    { value: '500+', label: 'Verified Cars' },
    { value: '1,200+', label: 'Happy Clients' },
    { value: '10 Yrs', label: 'Experience' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.8 }}
      className="flex gap-8"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 + i * 0.15 }}
          className="group"
        >
          <div className="text-2xl font-black text-white tracking-tight">
            {stat.value}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-widest mt-0.5">
            {stat.label}
          </div>
          <motion.div
            className="h-px bg-red-500 mt-2"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.3 + i * 0.15, duration: 0.5 }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">

      {/* ── LEFT — Cinematic car panel ── */}
      <div className="relative lg:w-[55%] min-h-70 lg:min-h-screen overflow-hidden shrink-0">
        <BackgroundSlideshow />

        {/* Diagonal cut on right edge (desktop only) */}
        <div
          className="hidden lg:block absolute top-0 right-0 w-24 h-full z-10"
          style={{
            background: 'linear-gradient(to bottom-left, transparent 49%, var(--background, #09090b) 51%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-12 min-h-70 lg:min-h-screen">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 bg-red-600 rounded flex items-center justify-center shadow-lg shadow-red-600/30"
              >
                <Car className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <span className="text-white font-black text-lg tracking-[0.15em]">
                  AUTO<span className="text-red-500">NEPAL</span>
                </span>
                <div className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
                  Premium Motors
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Center headline */}
          <div className="space-y-6 max-w-sm">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"
              />
              <span className="text-white/50 text-xs tracking-[0.25em] uppercase">
                Nepal&apos;s #1 Auto Marketplace
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight"
            >
              Find Your
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-red-400">
                Perfect Drive
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/40 text-sm leading-relaxed"
            >
              Buy certified pre-owned vehicles, sell your car at the best price,
              and experience a seamless automotive journey.
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="h-px bg-linear-to-r from-red-600/60 to-transparent"
            />

            {/* Stats */}
            <FloatingStats />
          </div>

          {/* Bottom contact strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="hidden lg:flex items-center gap-6 text-white/25 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-red-600/60" />
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-red-600/60" />
              <span>+977 98XXXXXXXX</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-green-500 rounded-full"
              />
              <span>Showroom Open</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── RIGHT — Form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-zinc-950 lg:bg-zinc-950 relative overflow-hidden">

        {/* Very subtle red glow top-right */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,0,26,0.06) 0%, transparent 70%)',
          }}
        />
        {/* Bottom left glow */}
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,0,26,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Page transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-100 relative z-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}