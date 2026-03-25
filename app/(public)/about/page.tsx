'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Star, Users, Car, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NumberTicker } from '@/components/ui/number-ticker';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const STATS = [
  { value: 500,  label: 'Cars Sold',       suffix: '+' },
  { value: 1200, label: 'Happy Customers',  suffix: '+' },
  { value: 8,    label: 'Years Experience', suffix: '+' },
  { value: 98,   label: 'Satisfaction Rate', suffix: '%' },
];

const VALUES = [
  {
    icon: Shield,
    title: 'Transparency',
    desc:  'No hidden charges. What you see is what you pay. Every car listing is accurate and verified.',
  },
  {
    icon: Star,
    title: 'Quality',
    desc:  'Every car in our inventory goes through a thorough inspection before listing.',
  },
  {
    icon: Users,
    title: 'Customer First',
    desc:  'We guide you through every step — from browsing to keys in hand.',
  },
  {
    icon: Car,
    title: 'Wide Selection',
    desc:  'From budget hatchbacks to premium SUVs — we have the right car for everyone.',
  },
];

const TEAM = [
  { name: 'Ramesh Shrestha',   role: 'Founder & CEO',       initials: 'RS' },
  { name: 'Sita Maharjan',     role: 'Sales Manager',        initials: 'SM' },
  { name: 'Bikash Tamang',     role: 'Lead Inspector',       initials: 'BT' },
  { name: 'Priya Karmacharya', role: 'Customer Relations',   initials: 'PK' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-600/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-4">
              About AutoNepal
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-6">
              Nepal&apos;s Most Trusted{' '}
              <span className="text-red-500">Car Marketplace</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
              Founded in Kathmandu, AutoNepal connects car buyers and sellers across Nepal
              with transparency, trust, and technology. We make buying and selling cars
              simple, safe, and stress-free.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/cars">
                <Button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 shadow-lg shadow-red-600/20">
                  Browse Cars
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-border font-semibold px-6">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, suffix }, i) => (
              <motion.div
                key={label}
                {...fadeUp(i * 0.1)}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-foreground flex items-center justify-center gap-1">
                  <NumberTicker value={value} />
                  <span className="text-red-500">{suffix}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0.05)}>
              <span className="inline-block px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-4">
                Our Story
              </span>
              <h2 className="text-3xl font-black text-foreground mb-5">
                Built for Nepal, by Nepalis
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  AutoNepal was born from a simple frustration — buying a car in Nepal
                  was complicated, opaque, and full of uncertainty. In 2016, we set out
                  to change that.
                </p>
                <p>
                  We built a platform where every listing is verified, every price is
                  transparent, and every customer gets the attention they deserve.
                  From our showroom in Kathmandu, we&apos;ve grown to serve customers
                  across the country.
                </p>
                <p>
                  Today, AutoNepal is trusted by thousands of Nepalis to buy, sell,
                  and discover their perfect car.
                </p>
              </div>

              <div className="mt-6 space-y-2.5">
                {[
                  'Verified listings — every car inspected',
                  'Transparent pricing — no hidden fees',
                  'Easy appointments and test drives',
                  'Buy and sell in one platform',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-3">
              {[
                { bg: 'bg-red-600/10', text: 'text-red-500',    emoji: '🚗', label: 'Quality Cars' },
                { bg: 'bg-blue-600/10', text: 'text-blue-500',  emoji: '🤝', label: 'Trusted Deals' },
                { bg: 'bg-green-600/10', text: 'text-green-500', emoji: '✅', label: 'Verified Sellers' },
                { bg: 'bg-purple-600/10', text: 'text-purple-500', emoji: '💎', label: 'Premium Service' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className={`${item.bg} rounded-2xl p-6 text-center aspect-square flex flex-col items-center justify-center`}
                >
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <p className={`font-bold text-sm ${item.text}`}>{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <h2 className="text-3xl font-black text-foreground mb-3">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our values guide everything we do at AutoNepal
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.08)}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <h2 className="text-3xl font-black text-foreground mb-3">Meet the Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The people behind AutoNepal
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(({ name, role, initials }, i) => (
              <motion.div
                key={name}
                {...fadeUp(i * 0.08)}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/20">
                  {initials}
                </div>
                <h3 className="font-bold text-foreground">{name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/20 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp(0)}>
            <h2 className="text-3xl font-black text-foreground mb-4">
              Ready to Find Your Car?
            </h2>
            <p className="text-muted-foreground mb-8">
              Browse hundreds of verified listings or sell your car with us today.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/cars">
                <Button className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 shadow-lg shadow-red-600/20">
                  Browse Cars
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="outline" className="border-border font-semibold px-8">
                  Sell My Car
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}