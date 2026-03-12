'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  Car, ShoppingBag, CalendarCheck, Users,
  TrendingUp, Clock, CheckCircle, XCircle,
  ArrowUpRight, Loader2,
} from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

// Placeholder stats — replace with real API later
const PLACEHOLDER_STATS = {
  totalCars:         24,
  availableCars:     18,
  totalOrders:       47,
  pendingOrders:      8,
  totalAppointments: 31,
  todayAppointments:  3,
  totalUsers:       156,
  newUsersThisWeek:  12,
};

const RECENT_ACTIVITY = [
  { type: 'order',       text: 'New order for Toyota Fortuner',    time: '2 min ago',   status: 'new' },
  { type: 'appointment', text: 'Appointment booked for Hyundai Creta', time: '15 min ago', status: 'pending' },
  { type: 'user',        text: 'New user registered: Ramesh Sharma', time: '1 hr ago',   status: 'info' },
  { type: 'order',       text: 'Order #1042 marked as completed',  time: '2 hr ago',   status: 'completed' },
  { type: 'car',         text: 'New car listed: KIA Sportage 2023', time: '3 hr ago',   status: 'info' },
  { type: 'order',       text: 'Order #1039 cancelled by user',    time: '5 hr ago',   status: 'cancelled' },
];

function StatCard({ icon: Icon, label, value, sub, color, delay }: any) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-xs mb-1">{label}</p>
        <div className="text-2xl font-black text-foreground flex items-end gap-1">
          <NumberTicker value={value} />
        </div>
        <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
    </motion.div>
  );
}

const statusColors: Record<string, string> = {
  new:       'bg-blue-500/20 text-blue-400',
  pending:   'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  info:      'bg-purple-500/20 text-purple-400',
};

export default function AdminDashboard() {
  const s = PLACEHOLDER_STATS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Welcome */}
      <motion.div {...fadeUp(0)}>
        <h2 className="text-2xl font-black text-foreground">Welcome back 👋</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s what&apos;s happening with AutoNepal today.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Car} label="Total Cars" value={s.totalCars}
          sub={`${s.availableCars} available`}
          color="bg-red-500/10 text-red-500"
          delay={0.05}
        />
        <StatCard
          icon={ShoppingBag} label="Total Orders" value={s.totalOrders}
          sub={`${s.pendingOrders} pending`}
          color="bg-blue-500/10 text-blue-500"
          delay={0.1}
        />
        <StatCard
          icon={CalendarCheck} label="Appointments" value={s.totalAppointments}
          sub={`${s.todayAppointments} today`}
          color="bg-green-500/10 text-green-500"
          delay={0.15}
        />
        <StatCard
          icon={Users} label="Total Users" value={s.totalUsers}
          sub={`+${s.newUsersThisWeek} this week`}
          color="bg-purple-500/10 text-purple-500"
          delay={0.2}
        />
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-4">

        {/* Recent activity */}
        <motion.div
          {...fadeUp(0.25)}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-foreground">Recent Activity</h3>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
              >
                <div className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${statusColors[item.status]}`}>
                  {item.status}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{item.text}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          {...fadeUp(0.3)}
          className="space-y-4"
        >
          {/* Car status breakdown */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-4">Car Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Available', value: 18, total: 24, color: 'bg-green-500' },
                { label: 'Reserved',  value:  4, total: 24, color: 'bg-yellow-500' },
                { label: 'Sold',      value:  2, total: 24, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-semibold text-foreground">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order status */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-4">Order Status</h3>
            <div className="space-y-2">
              {[
                { icon: Clock,       label: 'Pending',   value:  8, color: 'text-yellow-500' },
                { icon: CheckCircle, label: 'Completed', value: 35, color: 'text-green-500' },
                { icon: XCircle,     label: 'Cancelled', value:  4, color: 'text-red-500' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-3 py-1.5">
                  <Icon className={`w-4 h-4 ${color} shrink-0`} />
                  <span className="text-sm text-muted-foreground flex-1">{label}</span>
                  <span className="text-sm font-bold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}