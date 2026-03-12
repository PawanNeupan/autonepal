'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Upload, X, ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCreateCar, useUpdateCar, useUploadCarImages } from '@/hooks/useCars';
import Link from 'next/link';

const FEATURES_LIST = [
  'Leather Seats', 'Sunroof', 'Reverse Camera', 'Cruise Control',
  'Lane Assist', 'Keyless Entry', 'Push Start', 'Android Auto',
  'Apple CarPlay', 'Blind Spot Monitor', 'Auto Headlights', 'Fog Lights',
  'Heated Seats', 'Ventilated Seats', 'Head-Up Display', 'Parking Sensors',
];

const labelClass = 'text-xs text-muted-foreground uppercase tracking-widest';
const inputClass = 'bg-background border-border';

interface CarImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
}

interface FormData {
  title: string;
  make: string;
  carModel: string;
  year: number;
  price: number;
  kmDriven: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  condition: string;
  color: string;
  engineCC: number;
  description: string;
  adminNotes: string;
  status: string;
  isFeatured: boolean;
  source: string;
}

export default function CarForm({ mode, car }: { mode: 'create' | 'edit'; car?: any }) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title:        car?.title        || '',
    make:         car?.make         || '',
    carModel:     car?.carModel     || '',
    year:         car?.year         || new Date().getFullYear(),
    price:        car?.price        || 0,
    kmDriven:     car?.kmDriven     || 0,
    fuelType:     car?.fuelType     || 'Petrol',
    transmission: car?.transmission || 'Automatic',
    bodyType:     car?.bodyType     || 'SUV',
    condition:    car?.condition    || 'Used',
    color:        car?.color        || '',
    engineCC:     car?.engineCC     || 0,
    description:  car?.description  || '',
    adminNotes:   car?.adminNotes   || '',
    status:       car?.status       || 'available',
    isFeatured:   car?.isFeatured   || false,
    source:       car?.source       || 'inventory',
  });

  const [images, setImages]       = useState<CarImage[]>(car?.images || []);
  const [features, setFeatures]   = useState<string[]>(car?.features || []);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const { mutateAsync: createCar, isPending: creating } = useCreateCar();
  const { mutateAsync: updateCar, isPending: updating } = useUpdateCar();
  const { mutateAsync: uploadImages }                   = useUploadCarImages();

  const isLoading = creating || updating;

  const set = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim())    errs.title    = 'Title is required';
    if (!formData.make.trim())     errs.make     = 'Make is required';
    if (!formData.carModel.trim()) errs.carModel = 'Model is required';
    if (!formData.color.trim())    errs.color    = 'Color is required';
    if (!formData.price || formData.price <= 0) errs.price = 'Price is required';
    if (!formData.year  || formData.year  <= 0) errs.year  = 'Year is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadImages(files);
      const newImages: CarImage[] = uploaded.map((img, i) => ({
        ...img,
        isPrimary: images.length === 0 && i === 0,
        order:     images.length + i,
      }));
      setImages((prev) => [...prev, ...newImages]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    if (updated.length > 0 && !updated.some((x) => x.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const setPrimary = (idx: number) => {
    setImages(images.map((img, i) => ({ ...img, isPrimary: i === idx })));
  };

  const toggleFeature = (f: string) => {
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const payload = { ...formData, images, features };
      if (mode === 'create') {
        await createCar(payload);
        toast.success('Car created successfully');
      } else {
        await updateCar({ id: car._id, data: payload });
        toast.success('Car updated successfully');
      }
      router.push('/admin/cars');
    } catch {
      toast.error(`Failed to ${mode} car`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/admin/cars">
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-black text-foreground">
            {mode === 'create' ? 'Add New Car' : 'Edit Car'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {mode === 'create' ? 'List a new car in inventory' : 'Update car details'}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-bold text-foreground">Basic Information</h3>

          <div className="space-y-1.5">
            <Label className={labelClass}>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Toyota Fortuner 2022"
              className={inputClass}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>Make / Brand *</Label>
              <Input
                value={formData.make}
                onChange={(e) => set('make', e.target.value)}
                placeholder="e.g. Toyota"
                className={inputClass}
              />
              {errors.make && <p className="text-xs text-red-500">{errors.make}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Model *</Label>
              <Input
                value={formData.carModel}
                onChange={(e) => set('carModel', e.target.value)}
                placeholder="e.g. Fortuner"
                className={inputClass}
              />
              {errors.carModel && <p className="text-xs text-red-500">{errors.carModel}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>Year *</Label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => set('year', Number(e.target.value))}
                placeholder="2022"
                className={inputClass}
              />
              {errors.year && <p className="text-xs text-red-500">{errors.year}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Price (NPR) *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => set('price', Number(e.target.value))}
                placeholder="8500000"
                className={inputClass}
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>KM Driven</Label>
              <Input
                type="number"
                value={formData.kmDriven}
                onChange={(e) => set('kmDriven', Number(e.target.value))}
                placeholder="45000"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Engine CC</Label>
              <Input
                type="number"
                value={formData.engineCC}
                onChange={(e) => set('engineCC', Number(e.target.value))}
                placeholder="2755"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className={labelClass}>Color *</Label>
            <Input
              value={formData.color}
              onChange={(e) => set('color', e.target.value)}
              placeholder="e.g. Pearl White"
              className={inputClass}
            />
            {errors.color && <p className="text-xs text-red-500">{errors.color}</p>}
          </div>
        </motion.div>

        {/* Specs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-bold text-foreground">Specifications</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            <div className="space-y-1.5">
              <Label className={labelClass}>Fuel Type *</Label>
              <Select value={formData.fuelType} onValueChange={(v) => set('fuelType', v)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>Transmission *</Label>
              <Select value={formData.transmission} onValueChange={(v) => set('transmission', v)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Automatic', 'Manual'].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>Body Type *</Label>
              <Select value={formData.bodyType} onValueChange={(v) => set('bodyType', v)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Wagon'].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>Condition *</Label>
              <Select value={formData.condition} onValueChange={(v) => set('condition', v)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['New', 'Used', 'Certified Pre-Owned'].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>Status</Label>
              <Select value={formData.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['available', 'reserved', 'sold', 'maintenance', 'pending'].map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>Source</Label>
              <Select value={formData.source} onValueChange={(v) => set('source', v)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2.5">
              <Star className={`w-4 h-4 ${formData.isFeatured ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium text-foreground">Featured Car</p>
                <p className="text-xs text-muted-foreground">Show on homepage featured section</p>
              </div>
            </div>
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(v) => set('isFeatured', v)}
            />
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-bold text-foreground">Images</h3>

          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-red-500/50 hover:bg-red-500/5 transition-all">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading
              ? <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2" />
              : <Upload className="w-6 h-6 text-muted-foreground mb-2" />
            }
            <p className="text-sm text-muted-foreground">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 10MB each</p>
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-video rounded-lg overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />

                  {img.isPrimary && (
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      PRIMARY
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimary(i)}
                        className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 text-[10px] font-bold"
                      >
                        ★
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="w-7 h-7 rounded-full bg-red-600/80 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-bold text-foreground">Features & Equipment</h3>
          <div className="flex flex-wrap gap-2">
            {FEATURES_LIST.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  features.includes(f)
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-background text-muted-foreground border-border hover:border-red-500/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              id="custom-feature"
              placeholder="Add custom feature..."
              className={inputClass}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !features.includes(val)) {
                    setFeatures((prev) => [...prev, val]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="border-border"
              onClick={() => {
                const input = document.getElementById('custom-feature') as HTMLInputElement;
                const val = input?.value.trim();
                if (val && !features.includes(val)) {
                  setFeatures((prev) => [...prev, val]);
                  input.value = '';
                }
              }}
            >
              Add
            </Button>
          </div>
        </motion.div>

        {/* Description + Notes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-bold text-foreground">Description & Notes</h3>

          <div className="space-y-1.5">
            <Label className={labelClass}>Public Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the car for buyers..."
              className={`${inputClass} min-h-30 resize-none`}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelClass}>Admin Notes (private)</Label>
            <Textarea
              value={formData.adminNotes}
              onChange={(e) => set('adminNotes', e.target.value)}
              placeholder="Internal notes, not shown to buyers..."
              className={`${inputClass} min-h-20 resize-none`}
            />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 justify-end pb-8"
        >
          <Link href="/admin/cars">
            <Button variant="outline" className="border-border" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 shadow-lg shadow-red-600/20"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : mode === 'create' ? 'Create Car' : 'Save Changes'
            }
          </Button>
        </motion.div>

      </form>
    </div>
  );
}