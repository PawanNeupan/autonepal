import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SellRequest from '@/models/SellRequest';
import { requireAdmin } from '@/middleware/requireAdmin';

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

    const request = await SellRequest.findByIdAndUpdate(id, body, { new: true })
      .populate('user', 'name email phone');

    if (!request) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Updated', request });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}