import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyRefreshToken(refreshToken) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id.toString(), user.role);

    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid refresh token' },
      { status: 401 }
    );
  }
}