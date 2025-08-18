import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Proxy requests to Alpaca API securely using the user's stored keys
export async function POST(req: NextRequest) {
  // Authenticate user via Supabase access token passed in Authorization header
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '') || null;
  const { data: userData, error: userError } = await supabase.auth.getUser(token as string);
  const user = userData?.user ?? null;
  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await req.json();
  const { endpoint, method = 'GET', body } = payload;
  if (!endpoint) return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });

  // Fetch user's Alpaca API keys from Supabase (table: public.alpaca_keys)
  const { data: keyData, error: keyError } = await supabase
    .from('alpaca_keys')
    .select('api_key, secret_key, is_paper')
    .eq('user_id', user.id)
    .single();

  if (keyError || !keyData) {
    return NextResponse.json({ error: 'API keys not found for user' }, { status: 403 });
  }

  const baseUrl = keyData.is_paper ? (process.env.ALPACA_PAPER_ENDPOINT || 'https://paper-api.alpaca.markets') : (process.env.ALPACA_LIVE_ENDPOINT || 'https://api.alpaca.markets');
  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    'APCA-API-KEY-ID': keyData.api_key,
    'APCA-API-SECRET-KEY': keyData.secret_key,
    'Content-Type': 'application/json',
  };

  const alpacaRes = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await alpacaRes.text();
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: alpacaRes.status });
  } catch {
    return new Response(text, { status: alpacaRes.status });
  }
}
