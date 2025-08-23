import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

export interface AuthRequest extends NextRequest {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export async function authMiddleware(req: AuthRequest): Promise<NextResponse | null> {
  // Get token from cookie or authorization header
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || 
    req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    // Verify token
    const decoded = verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      email: string;
    };
    
    // Add user info to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };
    
    // Continue to the route handler
    return null;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
