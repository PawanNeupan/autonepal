import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default:  'AutoNepal — Buy & Sell Cars in Nepal',
    template: '%s | AutoNepal',
  },
  description:
    'Nepal\'s most trusted car marketplace. Browse hundreds of verified cars, book appointments, and sell your car with ease.',
  keywords: [
    'cars nepal', 'buy car nepal', 'sell car nepal',
    'used cars kathmandu', 'second hand cars nepal',
    'autonepal', 'car dealer nepal',
  ],
  authors:  [{ name: 'AutoNepal' }],
  creator:  'AutoNepal',
  metadataBase: new URL('https://autonepal.com'),
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://autonepal.com',
    siteName:    'AutoNepal',
    title:       'AutoNepal — Buy & Sell Cars in Nepal',
    description: 'Nepal\'s most trusted car marketplace.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'AutoNepal' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'AutoNepal — Buy & Sell Cars in Nepal',
    description: 'Nepal\'s most trusted car marketplace.',
    images:      ['/og-image.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}