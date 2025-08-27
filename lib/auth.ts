/**
 * Simple auth helper for demo / edge function use.
 * Reads broker API key from environment variables and provides a mocked fallback.
 */
export function getBrokerApiKey(): string {
  // prefer server env var, but allow NEXT_PUBLIC for client-side demo wiring
  return process.env.BROKER_API_KEY || process.env.NEXT_PUBLIC_BROKER_API_KEY || 'demo-broker-key-000';
}

export function requireBrokerApiKey(): string {
  const k = getBrokerApiKey();
  if (!k) throw new Error('Missing BROKER_API_KEY');
  return k;
}

export const MOCK_BROKER_HEADERS = (apiKey?: string) => ({
  'Authorization': `Bearer ${apiKey ?? getBrokerApiKey()}`,
  'Content-Type': 'application/json',
});
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

export async function getUserFromAuthHeader(req: any) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth) return null;
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (e) {
    console.error('getUserFromAuthHeader error', e);
    return null;
  }
}

// Minimal authOptions export to satisfy imports by API routes that call getServerSession(authOptions).
// This is intentionally lightweight; if your app uses full next-auth configuration, replace this with
// the real configuration exported from your auth module.
export const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
}
