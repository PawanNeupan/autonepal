import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">🚗</div>
      <h1 className="text-4xl font-black text-foreground mb-3">404</h1>
      <h2 className="text-xl font-bold text-foreground mb-3">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Looks like this road leads nowhere. The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6">
            Go Home
          </Button>
        </Link>
        <Link href="/cars">
          <Button variant="outline" className="border-border px-6">
            Browse Cars
          </Button>
        </Link>
      </div>
    </div>
  );
}