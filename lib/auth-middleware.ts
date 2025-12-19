import { NextRequest } from 'next/server';
import { verifySessionToken, getSessionByToken } from './auth';

/**
 * Middleware utility to check authentication in API routes
 * Returns the user ID if authenticated, null otherwise
 */
export async function requireAuth(request: NextRequest): Promise<number | null> {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  // Verify token
  const decoded = verifySessionToken(token);
  if (!decoded) {
    return null;
  }

  // Check if session exists in database
  const session = await getSessionByToken(token);
  if (!session) {
    return null;
  }

  return decoded.userId;
}

