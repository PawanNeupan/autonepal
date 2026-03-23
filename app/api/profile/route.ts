import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { authenticate } from '@/middleware/authenticate';

export async function GET(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const profile = await User.findById(user.userId).select('-password');
    if (!profile) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: profile });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { name, phone, avatar } = await req.json();

    const updated = await User.findByIdAndUpdate(
      user.userId,
      { name, phone, ...(avatar && { avatar }) },
      { new: true }
    ).select('-password');

    return NextResponse.json({ message: 'Profile updated', user: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}