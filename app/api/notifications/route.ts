import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { authenticate } from '@/middleware/authenticate';
import { requireAdmin } from '@/middleware/requireAdmin';

export async function GET(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const userId = user.userId || user._id;
    const query: any = user.role === 'admin' ? {} : { user: userId };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false,
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    console.error('GET /api/notifications error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { userId, title, message, type } = await req.json();

    console.log('Sending notification:', { userId, title, message, type });

    if (!title || !message) {
      return NextResponse.json({ message: 'Title and message required' }, { status: 400 });
    }

    const notification = await Notification.create({
      user:    userId || null,
      title,
      message,
      type:    type || 'info',
      isRead:  false,
    });

    return NextResponse.json({ message: 'Notification sent', notification }, { status: 201 });
  } catch (err) {
    console.error('POST /api/notifications error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const userId = user.userId || user._id;

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({ message: 'All marked as read' });
  } catch (err) {
    console.error('PUT /api/notifications error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}