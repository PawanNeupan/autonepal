import { Marquee } from '@/components/ui/marquee';

const BRANDS = [
  'Toyota', 'Honda', 'Hyundai', 'Suzuki',
  'KIA', 'Mahindra', 'Tata', 'Nissan',
  'Ford', 'Mitsubishi', 'Isuzu', 'Jeep',
];

export default function BrandsMarquee() {
  return (
    <section className="py-16 bg-muted/20 border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <p className="text-muted-foreground/60 text-xs tracking-[0.3em] uppercase">
          Trusted Brands We Carry
        </p>
      </div>
      <Marquee pauseOnHover className="[--duration:30s]">
        {BRANDS.map((brand) => (
          <div
            key={brand}
            className="mx-8 text-muted-foreground hover:text-foreground transition-colors font-bold text-lg tracking-widest uppercase cursor-default"
          >
            {brand}
          </div>
        ))}
      </Marquee>
    </section>
  );
}