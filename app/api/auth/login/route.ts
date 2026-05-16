import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check banned
    if (user.isBanned) {
      return NextResponse.json(
        { message: `Account banned: ${user.banReason}` },
        { status: 403 }
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error?.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}