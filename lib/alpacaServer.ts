import { readAlpacaKeys } from './server-keys';
import { NextRequest } from 'next/server';

export interface AlpacaConfig {
  keyId: string;
  secret: string;
  isPaper: boolean;
  baseUrl: string;
}

export function getAlpacaConfig(): AlpacaConfig | null {
  const keys = readAlpacaKeys();
  if (!keys?.keyId || !keys?.secret) {
    return null;
  }

  const isPaper = process.env.ALPACA_PAPER === 'true' || !process.env.ALPACA_LIVE;
  const baseUrl = isPaper
    ? 'https://paper-api.alpaca.markets'
    : 'https://api.alpaca.markets';

  return {
    keyId: keys.keyId,
    secret: keys.secret,
    isPaper,
    baseUrl,
  };
}

export async function makeAlpacaRequest(endpoint: string, config: AlpacaConfig, options: RequestInit = {}) {
  const url = `${config.baseUrl}${endpoint}`;
  const headers = {
    'APCA-API-KEY-ID': config.keyId,
    'APCA-API-SECRET-KEY': config.secret,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Alpaca API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
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
