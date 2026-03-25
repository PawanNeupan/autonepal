import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ContactInfo from '@/models/ContactInfo';
import { requireAdmin } from '@/middleware/requireAdmin';

export async function GET() {
  try {
    await connectDB();
    const contact = await ContactInfo.findOne();
    return NextResponse.json({ contact });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();

    const contact = await ContactInfo.findOneAndUpdate(
      {},
      { ...body, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'Contact info updated', contact });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}