import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

async function getUser(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user;
}

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });

  const limit = Number(new URL(request.url).searchParams.get('limit') || 100);

  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', user.id)
    .order('last_trade_at', { ascending: false, nulls: 'last' })
    .limit(limit);

  if (error) return NextResponse.json({ error: { message: error.message, code: error.code } }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 });

  const { name, currency, dca_amount = 0, dca_frequency = 'manual', stop_loss = -5, stop_loss_mode = 'fixed', trailing_distance_pct = 0, exchange_account = 'paper', enabled = true } = body;

  // Basic validation
  const allowedCurrencies = ['USD', 'EUR', 'BTC', 'ETH'];
  const allowedStopModes = ['none', 'fixed', 'trailing'];
  const allowedExchange = ['paper', 'live'];

  if (!name || typeof name !== 'string') return NextResponse.json({ error: { message: 'name is required' } }, { status: 422 });
  if (!allowedCurrencies.includes(currency)) return NextResponse.json({ error: { message: 'invalid currency' } }, { status: 422 });
  if (!allowedStopModes.includes(stop_loss_mode)) return NextResponse.json({ error: { message: 'invalid stop_loss_mode' } }, { status: 422 });
  if (!allowedExchange.includes(exchange_account)) return NextResponse.json({ error: { message: 'invalid exchange_account' } }, { status: 422 });

  const insertPayload = {
    user_id: user.id,
    name,
    currency,
    dca_amount,
    dca_frequency,
    stop_loss,
    stop_loss_mode,
    trailing_distance_pct,
    exchange_account,
    enabled
  } as any;

  const { data, error } = await supabase.from('bots').insert(insertPayload).select().maybeSingle();

  if (error) return NextResponse.json({ error: { message: error.message, code: error.code } }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}
