import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/middleware/requireAdmin';
import Car from '@/models/Car';
import User from '@/models/User';
import Order from '@/models/Order';
import Appointment from '@/models/Appointment';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      totalCars,
      availableCars,
      totalOrders,
      pendingOrders,
      totalAppointments,
      todayAppointments,
      totalUsers,
      newUsersThisWeek,
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'available' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
    ]);

    return NextResponse.json({
      totalCars,
      availableCars,
      totalOrders,
      pendingOrders,
      totalAppointments,
      todayAppointments,
      totalUsers,
      newUsersThisWeek,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
