import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { authenticate } from '@/middleware/authenticate';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    return NextResponse.json({ message: 'Marked as read' });
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}