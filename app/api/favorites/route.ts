import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Favorite from '@/models/Favorite';
import { authenticate } from '@/middleware/authenticate';

export async function GET(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const favorites = await Favorite.find({ user: user.userId })
      .populate('car', 'title price images make carModel year fuelType transmission kmDriven status')
      .sort({ createdAt: -1 });

    return NextResponse.json({ favorites });
  } catch (err) {
    console.error('GET /api/favorites error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();

    const body = await req.json();
    const { carId } = body;

    console.log('Toggle favorite — userId:', user.userId, 'carId:', carId);

    if (!carId) {
      return NextResponse.json({ message: 'Car ID required' }, { status: 400 });
    }

    // Validate carId is a valid ObjectId
    const mongoose = await import('mongoose');
    if (!mongoose.default.Types.ObjectId.isValid(carId)) {
      return NextResponse.json({ message: 'Invalid car ID' }, { status: 400 });
    }

    const existing = await Favorite.findOne({ user: user.userId, car: carId });

    if (existing) {
      await existing.deleteOne();
      return NextResponse.json({ message: 'Removed from favorites', favorited: false });
    }

    await Favorite.create({ user: user.userId, car: carId });
    return NextResponse.json({ message: 'Added to favorites', favorited: true }, { status: 201 });

  } catch (err) {
    console.error('POST /api/favorites error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}