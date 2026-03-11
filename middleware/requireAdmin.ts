import { authenticate } from './authenticate';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAdmin(req: NextRequest) {
  const { error, user } = await authenticate(req);

  if (error) return { error, user: null };

  if (user?.role !== 'admin') {
    return {
      error: NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}