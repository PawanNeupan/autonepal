import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import { requireAdmin } from '@/middleware/requireAdmin';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;
    const body   = await req.json();
    const review = await Review.findByIdAndUpdate(id, body, { new: true });
    if (!review) return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ message: 'Review updated', review });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}