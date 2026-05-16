'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car, Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useContactInfo } from '@/hooks/useContactInfo';

export default function Footer() {
  const { data } = useContactInfo();
  const contact  = data?.contact;

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const handleReviewSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    // Handle submission logic here (e.g., API call)
    toast.success('Thank you for your review!');
    setIsReviewOpen(false);
    setRating(0);
    setReview('');
  };

  const phone   = contact?.phone        || '+977 01-XXXXXXX';
  const email   = contact?.email        || 'info@autonepal.com';
  const address = contact?.address      || 'Putalisadak, Kathmandu, Nepal';
  const days    = contact?.workingDays  || 'Sunday - Friday';
  const hours   = contact?.workingHours || '9:00 AM - 6:00 PM';

  const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );

  const YoutubeIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );

  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );

  const socials = [
    { key: 'facebook',  href: contact?.facebook,                     icon: FacebookIcon,  color: 'hover:text-blue-500 hover:bg-blue-500/10' },
    { key: 'instagram', href: contact?.instagram,                    icon: InstagramIcon, color: 'hover:text-pink-500 hover:bg-pink-500/10' },
    { key: 'youtube',   href: contact?.youtube,                      icon: YoutubeIcon,   color: 'hover:text-red-500 hover:bg-red-500/10' },
    { key: 'whatsapp',  href: contact?.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : null, icon: WhatsAppIcon, color: 'hover:text-green-500 hover:bg-green-500/10' },
    { key: 'tiktok',    href: contact?.tiktok,                       icon: TikTokIcon,    color: 'hover:text-foreground hover:bg-accent' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-md shadow-red-600/30">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg tracking-wider">
                AUTO<span className="text-red-500">NEPAL</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nepal&apos;s most trusted car marketplace. Buy and sell cars with confidence.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {socials.map(({ key, href, icon: Icon, color }) =>
                href ? (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground transition-all ${color}`}
                  >
                    <Icon />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse Cars',  href: '/cars' },
                { label: 'Sell My Car',  href: '/sell' },
                { label: 'Gallery',      href: '/gallery' },
                { label: 'About Us',     href: '/about' },
                { label: 'Contact',      href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Write a Review
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-widest">
              Services
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Book Appointment',  href: '/cars' },
                { label: 'Price Negotiation', href: '/cars' },
                { label: 'My Orders',         href: '/my/orders' },
                { label: 'My Favorites',      href: '/my/favorites' },
                { label: 'My Profile',        href: '/my/profile' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-widest">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone}`} className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-red-500 transition-colors group">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-red-500" />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-red-500 transition-colors group">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-red-500" />
                  <span>{email}</span>
                </a>
              </li>
              {contact?.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-green-500 transition-colors group"
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp Us</span>
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span>{address}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span>{days}<br />{hours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AutoNepal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[320px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-b from-red-500/10 to-transparent p-5 pb-2">
            <DialogHeader className="space-y-2 text-center sm:text-center">
              <div className="mx-auto w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-1">
                <Star className="w-5 h-5 text-red-600 dark:text-red-500 fill-red-600 dark:fill-red-500" />
              </div>
              <DialogTitle className="text-lg font-bold tracking-tight">Rate Your Experience</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                We value your feedback. Let us know how we did!
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-5 pt-2 grid gap-5">
            <div className="space-y-3">
              <label className="text-xs font-medium text-foreground block text-center">
                How would you rate our service?
              </label>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`p-1.5 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                      star <= (hoverRating || rating) 
                        ? 'text-yellow-400 bg-yellow-400/10' 
                        : 'text-muted-foreground/20 hover:bg-muted'
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star className={`w-6 h-6 ${star <= (hoverRating || rating) ? 'fill-current drop-shadow-sm' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="review" className="text-xs font-medium text-foreground">
                Share your thoughts (optional)
              </label>
              <Textarea
                id="review"
                placeholder="What did you like or dislike?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[80px] text-sm resize-none focus-visible:ring-red-500 bg-muted/50"
              />
            </div>
          </div>
          
          <div className="p-5 pt-0 border-t bg-muted/20">
            <DialogFooter className="sm:justify-between flex-row items-center pt-3 gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsReviewOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleReviewSubmit} 
                className="bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20 px-6"
              >
                Submit
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}