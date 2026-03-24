import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import { authenticate } from '@/middleware/authenticate';
import { requireAdmin } from '@/middleware/requireAdmin';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page  = Number(searchParams.get('page'))  || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const skip  = (page - 1) * limit;

    const total   = await Review.countDocuments();
    const reviews = await Review.find()
      .populate('user', 'name email avatar')
      .populate('car',  'title images make carModel year')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ reviews, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { carId, rating, comment } = await req.json();

    if (!carId || !rating) {
      return NextResponse.json({ message: 'Car and rating are required' }, { status: 400 });
    }

    const existing = await Review.findOne({ user: user.userId, car: carId });
    if (existing) {
      return NextResponse.json({ message: 'You have already reviewed this car' }, { status: 400 });
    }

    const review = await Review.create({
      user:    user.userId,
      car:     carId,
      rating,
      comment: comment || '',
    });

    return NextResponse.json({ message: 'Review submitted', review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}