import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

// Auth result type for downstream usage
export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

// Next.js middleware cannot mutate the request object; return user info or error response
export async function authMiddleware(req: NextRequest): Promise<NextResponse | { user: AuthUser } | null> {
  // Await cookies() for compatibility with async API
  const cookieStore = await cookies();
  // Use the correct session cookie name (vf_session)
  const token =
    cookieStore.get('vf_session')?.value ||
    req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    // Verify token
    const decoded = verify(token, JWT_SECRET) as AuthUser;

    // Instead of mutating req, return user info for downstream usage
    return { user: decoded };
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
