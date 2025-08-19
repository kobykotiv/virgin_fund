import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}
if (!WEBHOOK_SECRET) {
  throw new Error('Missing WEBHOOK_SECRET in environment');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

export async function POST(request: Request) {
  const idempotencyKey = request.headers.get('idempotency-key');
  if (!idempotencyKey) return NextResponse.json({ error: { message: 'Missing Idempotency-Key header' } }, { status: 429 });

  const signature = request.headers.get('x-signature');
  const rawBody = await request.text();

  // Validate HMAC signature
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
  if (!signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return NextResponse.json({ error: { message: 'Invalid signature' } }, { status: 401 });
  }

  // Check idempotency
  const { data: existingKey } = await supabase.from('idempotency_keys').select('*').eq('key', idempotencyKey).maybeSingle();
  if (existingKey) {
    return NextResponse.json({ data: { idempotency: existingKey.key, response: existingKey.response } });
  }

  // Reserve idempotency key (simple optimistic insert)
  const reserve = await supabase.from('idempotency_keys').insert({ key: idempotencyKey }).select().maybeSingle();
  if (reserve.error && reserve.error.code !== '23505') {
    // 23505 unique_violation (Postgres) may be returned on conflict; ignore here and fetch existing
    return NextResponse.json({ error: { message: reserve.error.message } }, { status: 500 });
  }

  // Persist webhook log
  const headersObj: Record<string, string> = {};
  request.headers.forEach((v, k) => (headersObj[k] = v));

  const payloadJson = rawBody;
  const { data: logRow, error: logErr } = await supabase.from('webhook_logs').insert({ source: 'trading-webhook', payload: payloadJson, headers: headersObj }).select().maybeSingle();
  if (logErr) {
    return NextResponse.json({ error: { message: logErr.message } }, { status: 500 });
  }

  // Update idempotency key with a small response payload
  try {
    await supabase.from('idempotency_keys').update({ response: { webhook_log_id: logRow?.id } }).match({ key: idempotencyKey });
  } catch (e) {
    // non-fatal
  }

  return NextResponse.json({ data: { webhook_log_id: logRow?.id } });
}
