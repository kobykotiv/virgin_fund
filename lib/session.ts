import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function verifySessionToken(token: string) {
  try {
    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function createSessionToken(payload: any) {
  // This would be implemented with jose for JWT creation
  // For now, return a mock token
  return 'mock-session-token';
}
