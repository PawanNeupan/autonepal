import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: '' }
      );
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}