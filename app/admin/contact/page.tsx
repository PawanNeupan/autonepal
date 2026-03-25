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

export default function AdminContactPage() {
  const { data, isLoading }                             = useContactInfo();
  const { mutateAsync: updateContact, isPending }       = useUpdateContactInfo();
  const [saved, setSaved]                               = useState(false);

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
              placeholder="Gongabu , Kathmandu, Nepal"
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

        {/* Working hours */}
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

          <div className="space-y-1.5">
            <Label className={labelClass}>Website URL</Label>
            <Input
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
              placeholder="https://autonepal.com"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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