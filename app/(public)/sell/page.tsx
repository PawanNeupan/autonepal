'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useSubmitSellRequest } from '@/hooks/useSellRequests';
import { useUploadCarImages } from '@/hooks/useCars';
import { toast } from 'sonner';
import Link from 'next/link';

const labelClass = 'text-xs text-muted-foreground uppercase tracking-widest';
const inputClass = 'bg-background border-border';

export default function SellMyCarPage() {
  const [formData, setFormData] = useState({
    make:         '',
    carModel:     '',
    year:         new Date().getFullYear(),
    price:        0,
    kmDriven:     0,
    fuelType:     'Petrol',
    transmission: 'Manual',
    color:        '',
    condition:    'Used',
    description:  '',
    phone:        '',
  });

  const [images, setImages]       = useState<{ url: string; publicId: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const { mutateAsync: submitRequest, isPending } = useSubmitSellRequest();
  const { mutateAsync: uploadImages }             = useUploadCarImages();

  const set = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.make.trim())     errs.make     = 'Required';
    if (!formData.carModel.trim()) errs.carModel = 'Required';
    if (!formData.year)            errs.year     = 'Required';
    if (!formData.price)           errs.price    = 'Required';
    if (!formData.phone.trim())    errs.phone    = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadImages(files);
      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitRequest({ ...formData, images });
      setSubmitted(true);
    } catch {
      toast.error('Failed to submit. Please try again.');
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
          <h2 className="text-2xl font-black text-foreground mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Our team will review your listing and contact you within 24 hours.
          </p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-500 text-white w-full">Back to Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          <div>
            <h1 className="text-2xl font-black text-foreground">Sell My Car</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Fill in your car details and we&apos;ll get back to you within 24 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Basic Info */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-foreground">Car Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={labelClass}>Make *</Label>
                  <Input value={formData.make} onChange={(e) => set('make', e.target.value)} placeholder="Toyota" className={inputClass} />
                  {errors.make && <p className="text-xs text-red-500">{errors.make}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Model *</Label>
                  <Input value={formData.carModel} onChange={(e) => set('carModel', e.target.value)} placeholder="Fortuner" className={inputClass} />
                  {errors.carModel && <p className="text-xs text-red-500">{errors.carModel}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={labelClass}>Year *</Label>
                  <Input type="number" value={formData.year} onChange={(e) => set('year', Number(e.target.value))} className={inputClass} />
                  {errors.year && <p className="text-xs text-red-500">{errors.year}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Expected Price (NPR) *</Label>
                  <Input type="number" value={formData.price} onChange={(e) => set('price', Number(e.target.value))} placeholder="3500000" className={inputClass} />
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={labelClass}>KM Driven</Label>
                  <Input type="number" value={formData.kmDriven} onChange={(e) => set('kmDriven', Number(e.target.value))} placeholder="45000" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Color</Label>
                  <Input value={formData.color} onChange={(e) => set('color', e.target.value)} placeholder="White" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className={labelClass}>Fuel</Label>
                  <Select value={formData.fuelType} onValueChange={(v) => set('fuelType', v)}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Transmission</Label>
                  <Select value={formData.transmission} onValueChange={(v) => set('transmission', v)}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Manual', 'Automatic'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Condition</Label>
                  <Select value={formData.condition} onValueChange={(v) => set('condition', v)}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Used', 'New', 'Certified Pre-Owned'].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className={labelClass}>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Any additional details about your car..."
                  className={`${inputClass} resize-none min-h-20`}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-foreground">Contact</h3>
              <div className="space-y-1.5">
                <Label className={labelClass}>Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className={inputClass}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Images */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-foreground">Photos</h3>
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-red-500/50 hover:bg-red-500/5 transition-all">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                {uploading
                  ? <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2" />
                  : <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                }
                <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Upload car photos'}</p>
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative group aspect-video rounded-lg overflow-hidden">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white items-center justify-center hidden group-hover:flex"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Sell Request'}
            </Button>

          </form>
        </motion.div>
      </div>
    </div>
  );
}