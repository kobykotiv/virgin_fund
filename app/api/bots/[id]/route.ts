import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

async function getUser(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });

  const id = params.id;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 });

  // Allow only specific fields to be updated
  const allowed = ['name', 'dca_amount', 'dca_frequency', 'stop_loss', 'stop_loss_mode', 'trailing_distance_pct', 'exchange_account', 'enabled'];
  const payload: any = {};
  for (const key of allowed) {
    if (key in body) payload[key] = body[key];
  }

  if (Object.keys(payload).length === 0) return NextResponse.json({ error: { message: 'No updatable fields provided' } }, { status: 422 });

  // Basic validation
  if (payload.exchange_account) {
    if (!['paper', 'live'].includes(payload.exchange_account)) return NextResponse.json({ error: { message: 'invalid exchange_account' } }, { status: 422 });
  }
  if (payload.stop_loss_mode) {
    if (!['none', 'fixed', 'trailing'].includes(payload.stop_loss_mode)) return NextResponse.json({ error: { message: 'invalid stop_loss_mode' } }, { status: 422 });
  }

  const { data, error } = await supabase
    .from('bots')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .match({ id: Number(id), user_id: user.id })
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: { message: error.message, code: error.code } }, { status: 500 });
  if (!data) return NextResponse.json({ error: { message: 'Bot not found' } }, { status: 404 });

  return NextResponse.json({ data });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });

  const id = params.id;

  // Soft-delete — set enabled = false and updated_at
  const { data, error } = await supabase
    .from('bots')
    .update({ enabled: false, updated_at: new Date().toISOString() })
    .match({ id: Number(id), user_id: user.id })
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: { message: error.message, code: error.code } }, { status: 500 });
  if (!data) return NextResponse.json({ error: { message: 'Bot not found' } }, { status: 404 });

  // Audit: insert a small webhook_log style entry
  try {
    await supabase.from('webhook_logs').insert({ source: 'api:bots:delete', payload: { bot_id: id, user_id: user.id, action: 'soft-delete' }, headers: {} });
  } catch (e) {
    // non-fatal
  }

  return NextResponse.json({ data });
}
