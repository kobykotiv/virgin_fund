import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextRequest } from 'next/server'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // For demo purposes, accept any credentials
        if (credentials?.email && credentials?.password) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Demo User',
            alpacaApiKey: process.env.ALPACA_API_KEY || '',
            alpacaSecretKey: process.env.ALPACA_SECRET_KEY || '',
            isPaper: process.env.ALPACA_IS_PAPER === 'true'
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  }
}

// Simple user authentication for development
// In production, implement proper JWT/session validation
export async function getUserFromRequest(req: NextRequest): Promise<string | null> {
  // For development, return a mock user ID
  // In production, validate JWT token from headers
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  // Mock validation - replace with real JWT validation
  if (authHeader.startsWith('Bearer ')) {
    return 'mock-user-id';
  }

  return null;
}

export async function requireAuth(req: NextRequest): Promise<string> {
  const userId = await getUserFromRequest(req);
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}
