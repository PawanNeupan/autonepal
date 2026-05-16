import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SellRequest from '@/models/SellRequest';
import { authenticate } from '@/middleware/authenticate';
import { requireAdmin } from '@/middleware/requireAdmin';

export async function GET(req: NextRequest) {
  const { error, user } = await authenticate(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const page   = Number(searchParams.get('page')) || 1;
    const limit  = Number(searchParams.get('limit')) || 20;

    const query: any = {};
    if (user.role !== 'admin') query.user = user.userId;
    if (status) query.status = status;

    const skip  = (page - 1) * limit;
    const total = await SellRequest.countDocuments(query);
    const requests = await SellRequest.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ requests, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GET /api/sell-requests error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await authenticate(req);
  
  try {
    await connectDB();
    const body = await req.json();

    const {
      make, carModel, year, price, kmDriven,
      fuelType, transmission, color, condition,
      description, phone, images,
    } = body;

    if (!make || !carModel || !year || !price) {
      return NextResponse.json({ message: 'Make, model, year and price are required' }, { status: 400 });
    }

    const request = await SellRequest.create({
      user:         user?.userId || undefined,
      make,
      carModel,
      year,
      expectedPrice: price,
      kmDriven:     kmDriven     || 0,
      fuelType:     fuelType     || 'Petrol',
      transmission: transmission || 'Manual',
      color:        color        || '',
      condition:    condition    || 'Used',
      description:  description  || '',
      phone:        phone        || '',
      images:       images       || [],
      status:       'pending',
    });

    return NextResponse.json({ message: 'Sell request submitted', request }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/sell-requests error:', error);
    return NextResponse.json({ message: error?.message || 'Server error' }, { status: 500 });
  }
}