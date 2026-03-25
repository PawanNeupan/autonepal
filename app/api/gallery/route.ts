import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Gallery from '@/models/Gallery';
import { requireAdmin } from '@/middleware/requireAdmin';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const gallery = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ gallery });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { url, publicId, caption, category, order } = await req.json();

    if (!url || !publicId) {
      return NextResponse.json({ message: 'Image URL and publicId are required' }, { status: 400 });
    }

    const item = await Gallery.create({
      url, publicId,
      caption:  caption  || '',
      category: category || 'general',
      order:    order    || 0,
    });

    return NextResponse.json({ message: 'Image added to gallery', item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}