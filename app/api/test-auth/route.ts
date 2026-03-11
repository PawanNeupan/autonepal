import { authenticate } from '@/middleware/authenticate';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return error;

  return NextResponse.json({ 
    message: 'Protected route works!',
    user: user?.name 
  });
}