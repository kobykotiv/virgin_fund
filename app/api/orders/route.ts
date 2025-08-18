import { NextRequest, NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabaseServerClient';

// POST /api/orders - Place a new order
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '') || null;
  const { data: userData } = await serverSupabase.auth.getUser(token as string);
  const user = userData?.user ?? null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { symbol, side, quantity, price, type } = await req.json();
  if (!symbol || !side || !quantity || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Insert order into Supabase orders table (status pending)
  const { data, error } = await serverSupabase.from('orders').insert([
    { user_id: user.id, symbol, side, quantity, price, type, status: 'pending' }
  ]).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const orderRecord = data ? data[0] : null;

  // Proxy to Alpaca using user's stored keys
  const tokenForProxy = token;
  const proxyRes = await fetch('/api/alpaca-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenForProxy}` },
    body: JSON.stringify({ endpoint: '/v2/orders', method: 'POST', body: { symbol, qty: quantity, side, type, time_in_force: 'day', limit_price: type === 'limit' ? price : undefined } })
  });

  const result = await proxyRes.json();

  // Update order record with status from Alpaca
  if (result && result.id) {
    await serverSupabase.from('orders').update({ status: 'filled', external_id: result.id }).eq('id', orderRecord.id);
  } else {
    await serverSupabase.from('orders').update({ status: 'error' }).eq('id', orderRecord.id);
  }

  return NextResponse.json({ order: { ...orderRecord, external: result } });
}

// GET /api/orders - Get all orders for a user
export async function GET(req: NextRequest) {
  const user = req.nextUrl.searchParams.get('user');
  if (!user) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const { data, error } = await serverSupabase.from('orders').select('*').eq('user_id', user).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
