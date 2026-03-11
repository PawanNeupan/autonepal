'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, CalendarCheck, Car, Camera, DollarSign, Handshake } from 'lucide-react';

const BUYING_STEPS = [
  { icon: Search, step: '01', title: 'Browse & Filter', desc: 'Search from 500+ verified cars with detailed filters' },
  { icon: CalendarCheck, step: '02', title: 'Book Appointment', desc: 'Reserve your car and schedule a viewing or test drive' },
  { icon: Car, step: '03', title: 'Drive Home', desc: 'Complete payment and drive your dream car home' },
];

const SELLING_STEPS = [
  { icon: Camera, step: '01', title: 'List Your Car', desc: 'Upload photos, videos and describe your car in detail' },
  { icon: DollarSign, step: '02', title: 'Get Best Offer', desc: 'Receive and negotiate offers directly with our team' },
  { icon: Handshake, step: '03', title: 'Get Paid', desc: 'Agree on price and receive payment via eSewa or cash' },
];

function StepCard({ icon: Icon, step, title, desc, delay }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="relative flex gap-4 group"
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition-colors">
          <Icon className="w-4 h-4 text-red-500" />
        </div>
        <div className="w-px flex-1 bg-linear-to-b from-red-600/20 to-transparent mt-2" />
      </div>
      <div className="pb-8">
        <div className="text-xs text-red-500/60 font-mono mb-1">{step}</div>
        <h3 className="font-bold text-foreground mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-medium mb-3">
            Simple Process
          </p>
          <h2 className="text-4xl font-black text-foreground">How It Works</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">

          {/* Buying */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">B</span>
              Buying a Car
            </h3>
            {BUYING_STEPS.map((s, i) => (
              <StepCard key={i} {...s} delay={i * 0.1} />
            ))}
          </div>

          {/* Selling */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-muted text-foreground text-xs flex items-center justify-center">S</span>
              Selling Your Car
            </h3>
            {SELLING_STEPS.map((s, i) => (
              <StepCard key={i} {...s} delay={i * 0.1} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}