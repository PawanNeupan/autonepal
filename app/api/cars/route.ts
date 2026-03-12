import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Car from '@/models/Car';
import { requireAdmin } from '@/middleware/requireAdmin';

// GET /api/cars — public, with filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search       = searchParams.get('search') || '';
    const brand        = searchParams.get('brand') || '';
    const fuel         = searchParams.get('fuel') || '';
    const transmission = searchParams.get('transmission') || '';
    const minPrice     = Number(searchParams.get('minPrice')) || 0;
    const maxPrice     = Number(searchParams.get('maxPrice')) || 999999999;
    const sort         = searchParams.get('sort') || 'newest';
    const page         = Number(searchParams.get('page')) || 1;
    const limit        = Number(searchParams.get('limit')) || 12;
    const featured     = searchParams.get('featured');

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { make:        { $regex: search, $options: 'i' } },
        { carModel:    { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (brand)        query.make         = { $regex: brand, $options: 'i' };
    if (fuel)         query.fuelType     = fuel;
    if (transmission) query.transmission = transmission;
    if (featured === 'true') query.isFeatured = true;

    query.price = { $gte: minPrice, $lte: maxPrice };

    // Sort
    const sortMap: Record<string, any> = {
      newest:     { createdAt:  -1 },
      oldest:     { createdAt:   1 },
      price_low:  { price:       1 },
      price_high: { price:      -1 },
      km_low:     { kmDriven:    1 },
    };
    const sortObj = sortMap[sort] || sortMap.newest;

    const skip  = (page - 1) * limit;
    const total = await Car.countDocuments(query);
    const cars  = await Car.find(query).sort(sortObj).skip(skip).limit(limit);

    return NextResponse.json({
      cars,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/cars error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST /api/cars — admin only
export async function POST(req: NextRequest) {
  const { error, user } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();

    const {
      title, make, carModel: model, year, price,
      kmDriven, fuelType, transmission, color,
      engineCC, bodyType, condition, description,
      features, images, status, isFeatured,
      source, adminNotes,
    } = body;

    // Validate required fields
    if (!title || !make || !model || !year || !price || !fuelType || !transmission || !bodyType || !condition || !color) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const car = await Car.create({
      title,
      make,
      carModel:    model,
      year,
      price,
      kmDriven:    kmDriven    || 0,
      fuelType,
      transmission,
      color,
      engineCC:    engineCC    || 0,
      bodyType,
      condition,
      description: description || '',
      features:    features    || [],
      images:      images      || [],
      status:      status      || 'available',
      isFeatured:  isFeatured  || false,
      source:      source      || 'inventory',
      adminNotes:  adminNotes  || '',
      createdBy:   user.userId,
    });

    return NextResponse.json({ message: 'Car created', car }, { status: 201 });
  } catch (error) {
    console.error('POST /api/cars error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}