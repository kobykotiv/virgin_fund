import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Environment validation
const envSchema = z.object({
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  FRONTEND_ORIGIN: z.string().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const env = envSchema.parse(process.env);

// JWT payload schema
const JWTPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().email().optional(),
  tenantId: z.string(),
  role: z.string().default('user'),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

/**
 * Demo user for development - replace with real user lookup in production
 */
export function getCurrentUser(payload: JWTPayload) {
  return {
    id: payload.userId,
    email: payload.email || `user-${payload.userId}@demo.com`,
    tenantId: payload.tenantId,
    role: payload.role,
    name: `Demo User ${payload.userId}`,
    preferences: {
      currency: 'USD',
      timezone: 'UTC',
      notifications: true,
    },
  };
}

/**
 * Middleware to validate x-tenant-id header and JWT authorization
 */
export function authMiddleware(req: Request): { user: any; tenantId: string } | Response {
  try {
    // Extract tenant ID from header
    const tenantId = req.headers.get('x-tenant-id');
    if (!tenantId) {
      return new Response(
        JSON.stringify({ error: 'Missing x-tenant-id header' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract and validate Bearer token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const payload = jwt.verify(token, env.JWT_SECRET) as any;
    const validatedPayload = JWTPayloadSchema.parse(payload);

    // Ensure tenant ID matches
    if (validatedPayload.tenantId !== tenantId) {
      return new Response(
        JSON.stringify({ error: 'Tenant ID mismatch' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = getCurrentUser(validatedPayload);

    return { user, tenantId };
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Handle JWT-specific errors
    if (error instanceof jwt.JsonWebTokenError) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return new Response(
        JSON.stringify({ error: 'Token expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Generate a demo JWT token for testing
 */
export function generateDemoToken(userId: string, tenantId: string): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId,
    email: `demo-${userId}@virgin-fund.com`,
    tenantId,
    role: 'user',
  };

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Create CORS headers for API responses
 */
export function createCORSHeaders(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [env.FRONTEND_ORIGIN, 'http://localhost:3000', 'http://localhost:3001'];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin! : env.FRONTEND_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-id',
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * Handle preflight CORS requests
 */
export function handleCORS(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: createCORSHeaders(request),
    });
  }
  return null;
}