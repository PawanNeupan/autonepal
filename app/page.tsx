import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedCars from '@/components/home/FeaturedCars';
import HowItWorks from '@/components/home/HowItWorks';
import BrandsMarquee from '@/components/home/BrandsMarquee';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturedCars />
      <HowItWorks />
      <BrandsMarquee />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}