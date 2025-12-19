import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '@/lib/auth';
import { initDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';

// Initialize database on first request
let dbInitialized = false;

export async function POST(request: NextRequest) {
  // Require admin authentication to create new users
  // This ensures only existing admins can create new admin accounts
  const userId = await requireAuth(request);
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized. You must be logged in as an admin to create new users.' },
      { status: 401 }
    );
  }

  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser(username, password);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

