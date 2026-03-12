import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { authenticate } from '@/middleware/authenticate';
import { requireAdmin } from '@/middleware/requireAdmin';

// GET /api/orders — admin gets all, user gets own
export async function GET(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const page   = Number(searchParams.get('page')) || 1;
    const limit  = Number(searchParams.get('limit')) || 20;

    const query: any = {};
    if (user.role !== 'admin') query.user = user.userId;
    if (status) query.status = status;

    const skip  = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('car', 'title price images make carModel year')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ orders, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST /api/orders — user creates order
export async function POST(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { carId, paymentMethod, notes } = await req.json();

    if (!carId) return NextResponse.json({ message: 'Car ID is required' }, { status: 400 });

    const order = await Order.create({
      user:          user.userId,
      car:           carId,
      status:        'pending',
      paymentMethod: paymentMethod || 'cash',
      notes:         notes || '',
    });

    return NextResponse.json({ message: 'Order created', order }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}