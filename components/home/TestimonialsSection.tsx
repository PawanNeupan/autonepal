import { Marquee } from '@/components/ui/marquee';
import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Ramesh Sharma', location: 'Kathmandu', rating: 5, text: 'Found my dream Toyota Fortuner at an unbeatable price. The process was smooth and transparent.' },
  { name: 'Sita Thapa', location: 'Pokhara', rating: 5, text: 'Sold my old Honda City within a week. Got a fair price and the team was very professional.' },
  { name: 'Bikram Rai', location: 'Lalitpur', rating: 5, text: 'Excellent service! The appointment booking was easy and the car was exactly as described.' },
  { name: 'Priya Adhikari', location: 'Bhaktapur', rating: 5, text: 'Best car marketplace in Nepal. Transparent pricing and no hidden fees. Highly recommended!' },
  { name: 'Suresh KC', location: 'Chitwan', rating: 5, text: 'The negotiation process was fair. Got a great deal on my Hyundai Creta. Very happy!' },
  { name: 'Anita Gurung', location: 'Butwal', rating: 5, text: 'Loved the eSewa payment option. Very convenient and secure. Will definitely use again.' },
];

function ReviewCard({ name, location, rating, text }: typeof REVIEWS[0]) {
  return (
    <div className="w-72 bg-card border border-border rounded-2xl p-5 mx-3 shrink-0">
      <div className="flex gap-0.5 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
      <div>
        <div className="font-semibold text-foreground text-sm">{name}</div>
        <div className="text-muted-foreground/60 text-xs">{location}</div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-medium mb-3">
          Customer Stories
        </p>
        <h2 className="text-4xl font-black text-foreground">What Our Clients Say</h2>
      </div>

      <Marquee pauseOnHover className="[--duration:40s]">
        {REVIEWS.map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover className="[--duration:35s] mt-4">
        {[...REVIEWS].reverse().map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </Marquee>
    </section>
  );
}