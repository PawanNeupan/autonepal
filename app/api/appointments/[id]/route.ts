import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { authenticate } from '@/middleware/authenticate';
import { requireAdmin } from '@/middleware/requireAdmin';

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

    const appointment = await Appointment.findByIdAndUpdate(id, body, { new: true })
      .populate('user', 'name email phone')
      .populate('car', 'title price images make carModel year');

    if (!appointment) return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    return NextResponse.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;

    const appointment = await Appointment.findById(id);
    if (!appointment) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    if (user.role !== 'admin' && appointment.user.toString() !== user.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await appointment.deleteOne();
    return NextResponse.json({ message: 'Appointment cancelled' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}