import { verifyAccessToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function authenticate(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return {
        error: NextResponse.json(
          { message: 'Not authenticated' },
          { status: 401 }
        ),
        user: null,
      };
    }

    const decoded = verifyAccessToken(token) as { id: string; role: string };

    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return {
        error: NextResponse.json(
          { message: 'User not found' },
          { status: 401 }
        ),
        user: null,
      };
    }

    if (user.isBanned) {
      return {
        error: NextResponse.json(
          { message: 'Your account has been banned' },
          { status: 403 }
        ),
        user: null,
      };
    }

    return { error: null, user };
  } catch {
    return {
      error: NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      ),
      user: null,
    };
  }
}