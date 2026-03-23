'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCar } from '@/hooks/useCars';
import { useSubmitNegotiation } from '@/hooks/useNegotiations';
import { toast } from 'sonner';
import Link from 'next/link';

export default function NewNegotiationPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const carId        = searchParams.get('carId') || '';

  const { data: carData } = useCar(carId);
  const car               = carData?.car || carData;

  const { mutateAsync: submitNegotiation, isPending } = useSubmitNegotiation();

  const [offeredPrice, setOfferedPrice] = useState('');
  const [message, setMessage]           = useState('');
  const [submitted, setSubmitted]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeredPrice || Number(offeredPrice) <= 0) {
      toast.error('Please enter a valid offer price');
      return;
    }
    try {
      await submitNegotiation({
        carId,
        offeredPrice: Number(offeredPrice),
        message,
      });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit offer');
    }
  };

  if (submitted) {
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
          <h2 className="text-2xl font-black text-foreground mb-2">Offer Submitted!</h2>
          <p className="text-muted-foreground text-sm mb-2">
            Your offer of <span className="text-red-500 font-bold">NPR {Number(offeredPrice).toLocaleString()}</span> has been sent.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Our team will review and respond within 24 hours.
          </p>
          <div className="flex gap-3">
            <Link href={`/cars/${carId}`} className="flex-1">
              <Button variant="outline" className="w-full border-border">View Car</Button>
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
      <div className="max-w-lg mx-auto px-4 py-10">

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

          <div>
            <h1 className="text-2xl font-black text-foreground">Make an Offer</h1>
            <p className="text-muted-foreground text-sm mt-1">Submit your best price and we&apos;ll get back to you</p>
          </div>

          {/* Car preview */}
          {car && (
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
                <p className="text-muted-foreground text-xs">
                  Listed at <span className="text-red-500 font-bold">NPR {car.price?.toLocaleString()}</span>
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Your Offer Price (NPR) *
                </Label>
                <Input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  placeholder="e.g. 7500000"
                  className="bg-background border-border text-lg font-bold h-12"
                />
                {car && offeredPrice && (
                  <p className="text-xs text-muted-foreground">
                    {Number(offeredPrice) < car.price
                      ? <span className="text-yellow-500">
                          {((1 - Number(offeredPrice) / car.price) * 100).toFixed(1)}% below asking price
                        </span>
                      : <span className="text-green-500">At or above asking price</span>
                    }
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Message (optional)
                </Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain your offer or ask any questions..."
                  className="bg-background border-border resize-none min-h-25"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || !offeredPrice}
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20"
            >
              {isPending
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Submit Offer
                  </>
              }
            </Button>

          </form>
        </motion.div>
      </div>
    </div>
  );
}