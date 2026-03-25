import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import Car from '@/models/Car';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: baseUrl,               lastModified: new Date(), changeFrequency: 'daily'   as const, priority: 1 },
    { url: `${baseUrl}/cars`,     lastModified: new Date(), changeFrequency: 'hourly'  as const, priority: 0.9 },
    { url: `${baseUrl}/about`,    lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`,  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/gallery`,  lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.6 },
    { url: `${baseUrl}/sell`,     lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  try {
    await connectDB();
    const cars = await Car.find({ status: 'available' }).select('_id updatedAt').limit(500);
    const carPages = cars.map((car) => ({
      url:             `${baseUrl}/cars/${car._id}`,
      lastModified:    car.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    }));
    return [...staticPages, ...carPages];
  } catch {
    return staticPages;
  }
}