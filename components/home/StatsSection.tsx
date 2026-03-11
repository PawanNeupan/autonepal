'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Car, Users, Award, Handshake } from 'lucide-react';

const STATS = [
  { icon: Car, value: 500, suffix: '+', label: 'Cars Available', color: 'text-red-500' },
  { icon: Users, value: 1200, suffix: '+', label: 'Happy Customers', color: 'text-blue-500' },
  { icon: Award, value: 10, suffix: ' Yrs', label: 'Experience', color: 'text-yellow-500' },
  { icon: Handshake, value: 50, suffix: '+', label: 'Brands', color: 'text-green-500' },
];

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-16 bg-muted/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-foreground flex items-end gap-0.5">
                {inView && <NumberTicker value={stat.value} />}
                <span>{stat.suffix}</span>
              </div>
              <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}