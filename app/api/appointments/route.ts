import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { authenticate } from '@/middleware/authenticate';
import { requireAdmin } from '@/middleware/requireAdmin';

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
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('user', 'name email phone')
      .populate('car', 'title price images make carModel year')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ appointments, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GET /api/appointments error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { carId, date, timeSlot, notes } = await req.json();

    if (!carId || !date || !timeSlot) {
      return NextResponse.json({ message: 'Car, date and time slot are required' }, { status: 400 });
    }

    const appointment = await Appointment.create({
      user:     user.userId,
      car:      carId,
      date:     new Date(date),
      timeSlot,
      notes:    notes || '',
      status:   'pending',
    });

    return NextResponse.json({ message: 'Appointment booked', appointment }, { status: 201 });
  } catch (error) {
    console.error('POST /api/appointments error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}