'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Loader2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppointments, useCancelAppointment } from '@/hooks/useAppointments';
import { toast } from 'sonner';
import Link from 'next/link';

const statusConfig: Record<string, string> = {
  pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function MyAppointmentsPage() {
  const { data, isLoading }                        = useAppointments();
  const { mutateAsync: cancelAppointment, isPending } = useCancelAppointment();
  const appointments                               = data?.appointments || [];

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      toast.success('Appointment cancelled');
    } catch {
      toast.error('Failed to cancel appointment');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-foreground">My Appointments</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your scheduled visits</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-card border border-border rounded-2xl"
          >
            <div className="text-5xl mb-4">📅</div>
            <p className="text-foreground font-semibold mb-2">No appointments yet</p>
            <p className="text-muted-foreground text-sm mb-6">Browse cars and book a visit</p>
            <Link href="/cars">
              <Button className="bg-red-600 hover:bg-red-500 text-white">Browse Cars</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt: any, i: number) => (
              <motion.div
                key={apt._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4"
              >
                {/* Car image */}
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                  <img
                    src={apt.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=60'}
                    alt={apt.car?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-foreground text-sm truncate">{apt.car?.title}</p>
                      <p className="text-red-500 text-xs font-bold mt-0.5">
                        NPR {apt.car?.price?.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize shrink-0 ${statusConfig[apt.status] || statusConfig.pending}`}
                    >
                      {apt.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {apt.timeSlot}
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">&quot;{apt.notes}&quot;</p>
                  )}
                </div>

                {/* Cancel button */}
                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancel(apt._id)}
                    disabled={isPending}
                    className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors"
                    title="Cancel appointment"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}