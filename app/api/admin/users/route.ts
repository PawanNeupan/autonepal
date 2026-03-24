import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/middleware/requireAdmin';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role   = searchParams.get('role')   || '';
    const page   = Number(searchParams.get('page'))  || 1;
    const limit  = Number(searchParams.get('limit')) || 20;

    const query: any = {};
    if (role)   query.role = role;
    if (search) query.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];

    const skip  = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ users, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}