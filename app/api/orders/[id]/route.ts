import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { authenticate } from '@/middleware/authenticate';
import { requireAdmin } from '@/middleware/requireAdmin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('car', 'title price images make carModel year');

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    if (user.role !== 'admin' && order.user._id.toString() !== user.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const order = await Order.findByIdAndUpdate(id, body, { new: true })
      .populate('user', 'name email phone')
      .populate('car', 'title price images make carModel year');

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    return NextResponse.json({ message: 'Order updated', order });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}