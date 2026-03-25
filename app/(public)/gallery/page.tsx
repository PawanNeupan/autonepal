'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Loader2 } from 'lucide-react';
import { useGallery } from '@/hooks/useGallery';

const CATEGORIES = ['all', 'general', 'showroom', 'team', 'events', 'cars'];

export default function GalleryPage() {
  const { data, isLoading }     = useGallery();
  const [filter, setFilter]     = useState('all');
  const [lightbox, setLightbox] = useState<any | null>(null);

  const gallery = (data?.gallery || []).filter((item: any) =>
    filter === 'all' ? true : item.category === filter
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
            Our <span className="text-red-500">Gallery</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Take a look inside AutoNepal — our showroom, team, and featured cars
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 flex-wrap justify-center mb-8"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                filter === cat
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20'
                  : 'bg-card text-muted-foreground border-border hover:border-red-500/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-muted-foreground">No images found</p>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
          >
            {gallery.map((item: any, i: number) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setLightbox(item)}
                className="relative group cursor-pointer break-inside-avoid rounded-xl overflow-hidden bg-muted border border-border"
              >
                <img
                  src={item.url}
                  alt={item.caption || 'Gallery image'}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>

                {/* Caption */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-xs font-medium">{item.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[90vh] w-full"
            >
              <img
                src={lightbox.url}
                alt={lightbox.caption || ''}
                className="w-full h-full object-contain rounded-2xl"
              />
              {lightbox.caption && (
                <p className="text-white/80 text-sm text-center mt-3">{lightbox.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}