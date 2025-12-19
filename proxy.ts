import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Normalize pathname for comparison (handle trailing slash from next.config.js)
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  
  // Exclude login page and API routes from protection
  // Check both with and without trailing slash since next.config has trailingSlash: true
  if (normalizedPath === '/admin/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Only protect /admin routes (excluding login)
  if (normalizedPath.startsWith('/admin') && normalizedPath !== '/admin/login') {
    const token = request.cookies.get('auth-token')?.value;

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/admin/login/', request.url); // Add trailing slash for consistency
      // Only set redirect if we're not already going to login
      if (normalizedPath !== '/admin/login') {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Token exists, let it through (API routes will verify it)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all /admin routes - we'll exclude login in the function
    '/admin/:path*',
  ],
};

