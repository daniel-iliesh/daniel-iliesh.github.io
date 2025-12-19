import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getSessionByToken, getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Verify token
    const decoded = verifySessionToken(token);
    if (!decoded) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Check if session exists in database
    const session = await getSessionByToken(token);
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Get user info
    const user = await getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}

