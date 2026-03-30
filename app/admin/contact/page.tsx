'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, Globe,
  Facebook, Instagram, Youtube, Loader2, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContactInfo, useUpdateContactInfo } from '@/hooks/useContactInfo';
import { toast } from 'sonner';

const labelClass = 'text-xs text-muted-foreground uppercase tracking-widest';
const inputClass = 'bg-background border-border';

// SVG icons for platforms not in lucide
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

export default function AdminContactPage() {
  const { data, isLoading }                       = useContactInfo();
  const { mutateAsync: updateContact, isPending } = useUpdateContactInfo();
  const [saved, setSaved]                         = useState(false);

  const [form, setForm] = useState({
    phone:        '',
    phone2:       '',
    email:        '',
    email2:       '',
    address:      '',
    addressNp:    '',
    mapUrl:       '',
    website:      '',
    facebook:     '',
    instagram:    '',
    youtube:      '',
    whatsapp:     '',
    tiktok:       '',
    workingHours: '',
    workingDays:  '',
  });

  useEffect(() => {
    if (data?.contact) {
      setForm({
        phone:        data.contact.phone        || '',
        phone2:       data.contact.phone2       || '',
        email:        data.contact.email        || '',
        email2:       data.contact.email2       || '',
        address:      data.contact.address      || '',
        addressNp:    data.contact.addressNp    || '',
        mapUrl:       data.contact.mapUrl       || '',
        website:      data.contact.website      || '',
        facebook:     data.contact.facebook     || '',
        instagram:    data.contact.instagram    || '',
        youtube:      data.contact.youtube      || '',
        whatsapp:     data.contact.whatsapp     || '',
        tiktok:       data.contact.tiktok       || '',
        workingHours: data.contact.workingHours || '',
        workingDays:  data.contact.workingDays  || '',
      });
    }
  }, [data]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContact(form);
      setSaved(true);
      toast.success('Contact info updated');
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error('Failed to save');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-foreground">Contact Info</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your business contact details
        </p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-foreground">Phone Numbers</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>Primary Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+977 01-XXXXXXX"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Secondary Phone</Label>
              <Input
                value={form.phone2}
                onChange={(e) => set('phone2', e.target.value)}
                placeholder="+977 98XXXXXXXX"
                className={inputClass}
              />
            </div>
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-foreground">Email Addresses</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>Primary Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="info@autonepal.com"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Support Email</Label>
              <Input
                type="email"
                value={form.email2}
                onChange={(e) => set('email2', e.target.value)}
                placeholder="support@autonepal.com"
                className={inputClass}
              />
            </div>
          </div>
        </motion.div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-foreground">Address</h3>
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Address (English)</Label>
            <Textarea
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Putalisadak, Kathmandu, Nepal"
              className={`${inputClass} resize-none min-h-17.5`}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Address (Nepali)</Label>
            <Textarea
              value={form.addressNp}
              onChange={(e) => set('addressNp', e.target.value)}
              placeholder="पुतलीसडक, काठमाडौं, नेपाल"
              className={`${inputClass} resize-none min-h-17.5`}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelClass}>Google Maps Embed URL</Label>
            <Input
              value={form.mapUrl}
              onChange={(e) => set('mapUrl', e.target.value)}
              placeholder="https://maps.google.com/embed?..."
              className={inputClass}
            />
          </div>
        </motion.div>

        {/* Working Hours */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-foreground">Working Hours</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>Working Days</Label>
              <Input
                value={form.workingDays}
                onChange={(e) => set('workingDays', e.target.value)}
                placeholder="Sunday - Friday"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Working Hours</Label>
              <Input
                value={form.workingHours}
                onChange={(e) => set('workingHours', e.target.value)}
                placeholder="9:00 AM - 6:00 PM"
                className={inputClass}
              />
            </div>
          </div>
        </motion.div>

        {/* Social + Website */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-foreground">Website & Social Media</h3>
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label className={labelClass}>Website URL</Label>
            <Input
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
              placeholder="https://autonepal.com"
              className={inputClass}
            />
          </div>

          {/* Social grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <Label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <Facebook className="w-3 h-3" /> Facebook
                </span>
              </Label>
              <Input
                value={form.facebook}
                onChange={(e) => set('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <Instagram className="w-3 h-3" /> Instagram
                </span>
              </Label>
              <Input
                value={form.instagram}
                onChange={(e) => set('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <Youtube className="w-3 h-3" /> YouTube
                </span>
              </Label>
              <Input
                value={form.youtube}
                onChange={(e) => set('youtube', e.target.value)}
                placeholder="https://youtube.com/..."
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <WhatsAppIcon /> WhatsApp
                </span>
              </Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
                placeholder="+977 98XXXXXXXX"
                className={inputClass}
              />
              <p className="text-[10px] text-muted-foreground/60">
                Enter phone number only — used for wa.me link
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <TikTokIcon /> TikTok
                </span>
              </Label>
              <Input
                value={form.tiktok}
                onChange={(e) => set('tiktok', e.target.value)}
                placeholder="https://tiktok.com/@..."
                className={inputClass}
              />
            </div>

          </div>
        </motion.div>

        {/* Save */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pb-8"
        >
          <Button
            type="submit"
            disabled={isPending}
            className="px-10 h-11 bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/20"
          >
            {isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : saved
                ? <><Check className="w-4 h-4 mr-2" /> Saved!</>
                : 'Save Changes'
            }
          </Button>
        </motion.div>

      </form>
    </div>
  );
}