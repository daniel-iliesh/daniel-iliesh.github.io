import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getSessionByToken } from '@/lib/auth';

// This is a protected API route that requires authentication
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifySessionToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if session exists in database
    const session = await getSessionByToken(token);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // User is authenticated
    return NextResponse.json(
      {
        authenticated: true,
        message: 'This is a protected resource',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

