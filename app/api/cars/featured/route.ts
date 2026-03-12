import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Car from '@/models/Car';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const cars = await Car
      .find({ isFeatured: true, status: { $ne: 'sold' } })
      .sort({ createdAt: -1 })
      .limit(8);

    return NextResponse.json({ cars });
  } catch (error) {
    console.error('GET /api/cars/featured error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}