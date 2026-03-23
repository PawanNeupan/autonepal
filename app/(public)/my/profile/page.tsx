'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2, Check, User, Phone, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useUploadCarImages } from '@/hooks/useCars';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data, isLoading }                       = useProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const { mutateAsync: uploadImages }             = useUploadCarImages();
  const user                                      = data?.user;

  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved]         = useState(false);

  // Initialize form once data loads
  useState(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const [uploaded] = await uploadImages([file]);
      await updateProfile({ name: name || user?.name, phone, avatar: uploaded });
      toast.success('Avatar updated');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      await updateProfile({ name, phone });
      setSaved(true);
      toast.success('Profile updated');
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-foreground">My Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account information</p>
        </motion.div>

        <div className="space-y-5">

          {/* Avatar card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5"
          >
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar?.url} />
                <AvatarFallback className="bg-red-600 text-white text-2xl font-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors shadow-lg">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                {uploading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Camera className="w-3.5 h-3.5" />
                }
              </label>
            </div>

            <div>
              <p className="font-black text-foreground text-lg">{user?.name}</p>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <Badge
                variant="outline"
                className={`mt-2 text-xs capitalize ${
                  user?.role === 'admin'
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {user?.role}
              </Badge>
            </div>
          </motion.div>

          {/* Edit form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSave}
            className="bg-card border border-border rounded-2xl p-6 space-y-4"
          >
            <h3 className="font-bold text-foreground">Personal Information</h3>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={name || user?.name || ''}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-muted border-border text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground/60">Email cannot be changed</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={phone || user?.phone || ''}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20"
            >
              {isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : saved
                  ? <><Check className="w-4 h-4 mr-2" /> Saved!</>
                  : 'Save Changes'
              }
            </Button>
          </motion.form>

          {/* Account stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'My Appointments', href: '/my/appointments', emoji: '📅' },
                { label: 'My Orders',       href: '/my/orders',       emoji: '📦' },
                { label: 'My Favorites',    href: '/my/favorites',    emoji: '❤️' },
                { label: 'Sell My Car',     href: '/sell',            emoji: '🚗' },
              ].map((item) => (
                <a  
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}