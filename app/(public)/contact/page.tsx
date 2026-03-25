'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock,
  Facebook, Instagram, Youtube,
  Globe, Send, Loader2, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContactInfo } from '@/hooks/useContactInfo';
import { toast } from 'sonner';

export default function ContactPage() {
  const { data } = useContactInfo();
  const contact  = data?.contact;

  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())    errs.name    = 'Required';
    if (!form.email.trim())   errs.email   = 'Required';
    if (!form.message.trim()) errs.message = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: 20 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
            Get In <span className="text-red-500">Touch</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have questions about a car or want to visit our showroom? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8">

          {/* LEFT */}
          <div className="space-y-5">

            <div className="grid sm:grid-cols-2 gap-4">

              {/* Phone */}
              <motion.div {...fadeUp(0.05)} className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Phone</h3>
                {contact?.phone ? (
                  <div className="space-y-1">
                    <a href={`tel:${contact.phone}`} className="text-sm text-muted-foreground hover:text-red-500 transition-colors block">
                      {contact.phone}
                    </a>
                    {contact.phone2 && (
                      <a href={`tel:${contact.phone2}`} className="text-sm text-muted-foreground hover:text-red-500 transition-colors block">
                        {contact.phone2}
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">+977 01-XXXXXXX</p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div {...fadeUp(0.1)} className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Email</h3>
                {contact?.email ? (
                  <div className="space-y-1">
                    <a href={`mailto:${contact.email}`} className="text-sm text-muted-foreground hover:text-red-500 transition-colors block">
                      {contact.email}
                    </a>
                    {contact.email2 && (
                      <a href={`mailto:${contact.email2}`} className="text-sm text-muted-foreground hover:text-red-500 transition-colors block">
                        {contact.email2}
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">info@autonepal.com</p>
                )}
              </motion.div>

              {/* Address */}
              <motion.div {...fadeUp(0.15)} className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Address</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {contact?.address || 'Putalisadak, Kathmandu, Nepal'}
                </p>
                {contact?.addressNp && (
                  <p className="text-sm text-muted-foreground mt-1">{contact.addressNp}</p>
                )}
              </motion.div>

              {/* Hours */}
              <motion.div {...fadeUp(0.2)} className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Working Hours</h3>
                <p className="text-sm text-muted-foreground">
                  {contact?.workingDays || 'Sunday - Friday'}
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {contact?.workingHours || '9:00 AM - 6:00 PM'}
                </p>
              </motion.div>

            </div>

            {/* Social */}
            {(contact?.facebook || contact?.instagram || contact?.youtube || contact?.website) && (
              <motion.div {...fadeUp(0.25)} className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {contact?.facebook && (
                    <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-sm text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 transition-all">
                      <Facebook className="w-4 h-4" /> Facebook
                    </a>
                  )}
                  {contact?.instagram && (
                    <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-sm text-muted-foreground hover:text-pink-500 hover:border-pink-500/50 transition-all">
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                  )}
                  {contact?.youtube && (
                    <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-sm text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-all">
                      <Youtube className="w-4 h-4" /> YouTube
                    </a>
                  )}
                  {contact?.website && (
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-sm text-muted-foreground hover:text-foreground transition-all">
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Map */}
            {contact?.mapUrl && (
              <motion.div {...fadeUp(0.3)} className="bg-card border border-border rounded-2xl overflow-hidden h-64">
                <iframe
                  src={contact.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            )}

          </div>

          {/* RIGHT — Form */}
          <motion.div {...fadeUp(0.1)}>
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-black text-foreground mb-1">Send a Message</h2>
              <p className="text-muted-foreground text-sm mb-6">
                We typically respond within 24 hours
              </p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    We&apos;ll get back to you soon.
                  </p>
                  <Button
                    variant="outline"
                    className="border-border"
                    onClick={() => {
                      setSent(false);
                      setForm({ name: '', email: '', phone: '', message: '' });
                    }}
                  >
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest">Full Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Your name"
                      className="bg-background border-border"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest">Email *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="your@email.com"
                      className="bg-background border-border"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest">Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+977 98XXXXXXXX"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest">Message *</Label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="What would you like to know?"
                      className="bg-background border-border resize-none min-h-[120px]"
                    />
                    {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20"
                  >
                    {sending
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <span className="flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Send Message</span>
                    }
                  </Button>

                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}