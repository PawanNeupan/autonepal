import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin pages (frontend)
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('refreshToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protect user pages (frontend)
  const protectedRoutes = [
    '/my-orders',
    '/favorites',
    '/sell',
    '/profile',
    '/notifications',
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get('refreshToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/my-orders/:path*',
    '/favorites/:path*',
    '/sell/:path*',
    '/profile/:path*',
    '/notifications/:path*',
  ],
};