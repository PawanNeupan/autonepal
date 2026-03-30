import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from './authenticate';

export async function requireAdmin(req: NextRequest) {
  const { error, user } = await authenticate(req);

  if (error) return { error, user: null };

  if (user?.role !== 'admin') {
    return { error: 'Admin access required', user: null };
  }

  return { error: null, user };
}