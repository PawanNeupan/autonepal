import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Negotiation from '@/models/Negotiation';
import { authenticate } from '@/middleware/authenticate';

export async function GET(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';

    const query: any = {};
    if (user.role !== 'admin') query.user = user.userId;
    if (status) query.status = status;

    const negotiations = await Negotiation.find(query)
      .populate('user', 'name email phone')
      .populate('car', 'title price images make carModel year')
      .sort({ createdAt: -1 });

    return NextResponse.json({ negotiations });
  } catch (error) {
    console.error('GET /api/negotiations error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { carId, offeredPrice, message } = await req.json();

    if (!carId || !offeredPrice) {
      return NextResponse.json({ message: 'Car and offered price are required' }, { status: 400 });
    }

    // Check if negotiation already exists
    const existing = await Negotiation.findOne({ user: user.userId, car: carId, status: 'pending' });
    if (existing) {
      return NextResponse.json({ message: 'You already have a pending negotiation for this car' }, { status: 400 });
    }

    const negotiation = await Negotiation.create({
      user:         user.userId,
      car:          carId,
      offeredPrice,
      message:      message || '',
      status:       'pending',
    });

    return NextResponse.json({ message: 'Negotiation submitted', negotiation }, { status: 201 });
  } catch (error) {
    console.error('POST /api/negotiations error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}