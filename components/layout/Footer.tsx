import Link from 'next/link';
import { Car, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg tracking-wider text-foreground">
                AUTO<span className="text-red-500">NEPAL</span>
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Nepal&apos;s most trusted premium automobile marketplace.
              Buy, sell and trade with confidence.
            </p>

            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:bg-accent/80 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-pink-500 hover:bg-accent/80 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-accent/80 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-accent/80 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-bold text-sm mb-4">Quick Links</h4>
            <div className="space-y-2.5">
              <Link href="/cars" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Browse Cars</Link>
              <Link href="/sell" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Sell Your Car</Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">About Us</Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Contact</Link>
            </div>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-foreground font-bold text-sm mb-4">My Account</h4>
            <div className="space-y-2.5">
              <Link href="/login" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Login</Link>
              <Link href="/register" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Register</Link>
              <Link href="/my-orders" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">My Orders</Link>
              <Link href="/favorites" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">Favorites</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground font-bold text-sm mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-red-600/60 shrink-0" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-red-600/60 shrink-0" />
                <span>+977 98XXXXXXXX</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-red-600/60 shrink-0" />
                <span>info@autonepal.com</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground/60 mb-2">We Accept</p>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 bg-accent border border-border rounded-lg text-xs text-muted-foreground font-medium">eSewa</div>
                <div className="px-3 py-1.5 bg-accent border border-border rounded-lg text-xs text-muted-foreground font-medium">Cash</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground/60 text-xs">
            © {new Date().getFullYear()} AutoNepal. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground/60 hover:text-foreground text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-muted-foreground/60 hover:text-foreground text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}