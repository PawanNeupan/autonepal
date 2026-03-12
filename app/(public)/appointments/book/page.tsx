'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCar } from '@/hooks/useCars';
import { useBookAppointment } from '@/hooks/useAppointments';
import { toast } from 'sonner';
import Link from 'next/link';

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM',  '2:00 PM',  '3:00 PM',
  '4:00 PM',  '5:00 PM',
];

function getNext7Days() {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookAppointmentPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const carId        = searchParams.get('carId') || '';

  const { data: carData, isLoading: carLoading } = useCar(carId);
  const { mutateAsync: bookAppointment, isPending } = useBookAppointment();

  const car  = carData?.car || carData;
  const days = getNext7Days();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes]               = useState('');
  const [booked, setBooked]             = useState(false);

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select a date and time slot');
      return;
    }
    try {
      await bookAppointment({
        carId,
        date:     selectedDate.toISOString(),
        timeSlot: selectedSlot,
        notes,
      });
      setBooked(true);
    } catch {
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-10 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">Appointment Booked!</h2>
          <p className="text-muted-foreground text-sm mb-1">
            {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-red-500 font-semibold mb-6">{selectedSlot}</p>
          <p className="text-muted-foreground text-sm mb-8">
            We&apos;ll confirm your appointment shortly. Check your orders for updates.
          </p>
          <div className="flex gap-3">
            <Link href="/my/appointments" className="flex-1">
              <Button variant="outline" className="w-full border-border">My Appointments</Button>
            </Link>
            <Link href="/cars" className="flex-1">
              <Button className="w-full bg-red-600 hover:bg-red-500 text-white">Browse More</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link
            href={carId ? `/cars/${carId}` : '/cars'}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to listing
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-black text-foreground">Book Appointment</h1>
            <p className="text-muted-foreground text-sm mt-1">Schedule a visit to see the car in person</p>
          </div>

          {/* Car preview */}
          {!carLoading && car && (
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
              <div className="w-16 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                <img
                  src={car.images?.[0]?.url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=60'}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{car.title}</p>
                <p className="text-red-500 font-bold text-sm">NPR {car.price?.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Date picker */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-foreground">Select Date</h3>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {days.map((day, i) => {
                const isSelected = selectedDate?.toDateString() === day.toDateString();
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={`flex flex-col items-center py-3 px-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-background border-border text-muted-foreground hover:border-red-500/50'
                    }`}
                  >
                    <span className="text-[10px] uppercase mb-1">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-base font-black">{day.getDate()}</span>
                    <span className="text-[10px]">
                      {day.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slot picker */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-foreground">Select Time</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedSlot === slot
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-background border-border text-muted-foreground hover:border-red-500/50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-widest">
              Notes (optional)
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any questions or special requests..."
              className="bg-background border-border resize-none min-h-20"
            />
          </div>

          {/* Summary + Book */}
          {selectedDate && selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-600/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-red-500 text-sm font-bold">{selectedSlot}</p>
              </div>
              <Check className="w-5 h-5 text-red-500 shrink-0" />
            </motion.div>
          )}

          <Button
            onClick={handleBook}
            disabled={isPending || !selectedDate || !selectedSlot}
            className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20"
          >
            {isPending
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : 'Confirm Appointment'
            }
          </Button>

        </motion.div>
      </div>
    </div>
  );
}