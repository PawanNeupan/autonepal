import { verifyAccessToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function authenticate(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token      = authHeader?.split(' ')[1];

    if (!token) {
      return { error: 'Not authenticated', user: null };
    }

    const decoded = verifyAccessToken(token) as { id: string; role: string };

    const userDoc = await User.findById(decoded.id).select('-password -refreshToken');

    if (!userDoc) {
      return { error: 'User not found', user: null };
    }

    if (userDoc.isBanned) {
      return { error: 'Your account has been banned', user: null };
    }

    // Always expose userId so all API routes work consistently
    const user = {
      ...userDoc.toObject(),
      userId: userDoc._id.toString(),
      _id:    userDoc._id.toString(),
      role:   userDoc.role,
    };

    return { error: null, user };
  } catch {
    return { error: 'Invalid token', user: null };
  }
}