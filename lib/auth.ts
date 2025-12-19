import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDbPool } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface User {
  id: number;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create a session token
export function createSessionToken(userId: number): string {
  return jwt.sign(
    { userId, type: 'session' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify session token
export function verifySessionToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; type: string };
    if (decoded.type !== 'session') {
      return null;
    }
    return { userId: decoded.userId };
  } catch {
    return null;
  }
}

// Create user
export async function createUser(username: string, password: string): Promise<User> {
  const db = getDbPool();
  const passwordHash = await hashPassword(password);
  
  const result = await db.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at, updated_at',
    [username, passwordHash]
  );
  
  return result.rows[0];
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User & { password_hash: string } | null> {
  const db = getDbPool();
  const result = await db.query(
    'SELECT id, username, password_hash, created_at, updated_at FROM users WHERE username = $1',
    [username]
  );
  
  return result.rows[0] || null;
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  const db = getDbPool();
  const result = await db.query(
    'SELECT id, username, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  
  return result.rows[0] || null;
}

// Create session in database
export async function createSession(userId: number, token: string): Promise<Session> {
  const db = getDbPool();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  const result = await db.query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING id, user_id, token, expires_at',
    [userId, token, expiresAt]
  );
  
  return result.rows[0];
}

// Get session by token
export async function getSessionByToken(token: string): Promise<Session | null> {
  const db = getDbPool();
  const result = await db.query(
    'SELECT id, user_id, token, expires_at FROM sessions WHERE token = $1 AND expires_at > NOW()',
    [token]
  );
  
  return result.rows[0] || null;
}

// Delete session
export async function deleteSession(token: string): Promise<void> {
  const db = getDbPool();
  await db.query('DELETE FROM sessions WHERE token = $1', [token]);
}

// Delete all sessions for a user
export async function deleteAllUserSessions(userId: number): Promise<void> {
  const db = getDbPool();
  await db.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
}

