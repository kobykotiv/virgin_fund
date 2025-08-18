// Supabase Edge Function: run-bots
// This implementation uses Deno fetch (no external Node libs) to:
// 1. Fetch active bots from Supabase REST API
// 2. For each bot, ensure idempotency, place a DCA buy order on Alpaca using REST /v2/orders
// 3. Persist an order record to Supabase via REST
// 4. Mark idempotency record and update bot.last_run_at

// avoid TypeScript/Node tooling errors in the repo by declaring Deno
declare const Deno: any;

type Bot = {
  id: number;
  name?: string;
  symbol?: string;
  dca_amount?: number;
  enabled?: boolean;
  liquidated?: boolean;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL');
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const ALPACA_BASE = Deno.env.get('ALPACA_BASE_URL') || Deno.env.get('NEXT_PUBLIC_ALPACA_BASE_URL') || 'https://paper-api.alpaca.markets';
const ALPACA_KEY = Deno.env.get('ALPACA_KEY');
const ALPACA_SECRET = Deno.env.get('ALPACA_SECRET');
const ALPACA_MODE = Deno.env.get('ALPACA_MODE') || Deno.env.get('NEXT_PUBLIC_ALPACA_MODE') || 'rest';

if (!SUPABASE_URL) console.warn('SUPABASE_URL not set');
if (!SERVICE_ROLE) console.warn('SUPABASE_SERVICE_ROLE_KEY not set');
if (!ALPACA_KEY || !ALPACA_SECRET) console.warn('ALPACA_KEY or ALPACA_SECRET not set');

function supabaseHeaders() {
  return {
    apikey: SERVICE_ROLE || '',
    Authorization: `Bearer ${SERVICE_ROLE || ''}`,
    'Content-Type': 'application/json',
  };
}

function alpacaHeaders() {
  return {
    'APCA-API-KEY-ID': ALPACA_KEY || '',
    'APCA-API-SECRET-KEY': ALPACA_SECRET || '',
    'Content-Type': 'application/json',
  };
}

async function fetchActiveBots(): Promise<Bot[]> {
  const url = `${SUPABASE_URL}/rest/v1/bots?liquidated=eq.false&enabled=eq.true`;
  const res = await fetch(url, { headers: supabaseHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch bots: ${res.status} ${await res.text()}`);
  return await res.json();
}

// Idempotency helpers: check, create (pending), update
async function checkIdempotency(key: string) {
  const url = `${SUPABASE_URL}/rest/v1/idempotency_keys?key=eq.${encodeURIComponent(key)}&limit=1`;
  const res = await fetch(url, { headers: supabaseHeaders() });
  if (!res.ok) throw new Error(`Failed to query idempotency: ${res.status} ${await res.text()}`);
  const arr = await res.json();
  return arr && arr.length ? arr[0] : null;
}

async function createIdempotency(key: string, botId: number) {
  const url = `${SUPABASE_URL}/rest/v1/idempotency_keys`;
  const body = { key, bot_id: botId, status: 'pending', created_at: new Date().toISOString() };
  const res = await fetch(url, { method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'return=representation' }, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Failed to create idempotency: ${res.status} ${text}`);
  return JSON.parse(text)?.[0];
}

async function createIdempotencyAtomic(key: string, botId: number) {
  // Try to upsert using Supabase REST on_conflict behavior via Prefer: resolution=merge-duplicates
  const url = `${SUPABASE_URL}/rest/v1/idempotency_keys`;
  const body = { key, bot_id: botId, status: 'pending', created_at: new Date().toISOString() };
  const res = await fetch(url, { method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Failed to create idempotency (atomic): ${res.status} ${text}`);
  const parsed = JSON.parse(text);
  return parsed?.[0];
}

async function updateIdempotency(key: string, update: any) {
  const url = `${SUPABASE_URL}/rest/v1/idempotency_keys?key=eq.${encodeURIComponent(key)}`;
  const res = await fetch(url, { method: 'PATCH', headers: { ...supabaseHeaders(), Prefer: 'return=representation' }, body: JSON.stringify(update) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Failed to update idempotency: ${res.status} ${text}`);
  return JSON.parse(text);
}

// Retry/backoff wrapper for transient Alpaca errors (429/5xx)
async function retry<T>(fn: () => Promise<T>, attempts = 4, baseMs = 500): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastErr = e;
      const retryable = (e && e.message && /(429|5\d{2})/.test(String(e.message))) || (e && e.status && (e.status === 429 || (e.status >= 500 && e.status < 600)));
      if (!retryable) throw e;
      const wait = baseMs * Math.pow(2, i);
      console.warn(`Transient error, retrying in ${wait}ms (attempt ${i + 1}/${attempts})`, e.message || e);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// Replace inline order placing with adapter
import { placeOrder as alpacaPlaceOrder } from './adapter.ts';

// Place order using either REST or a mock adapter inline for Deno compatibility
async function placeAlpacaOrderDirect(symbol: string, notional: number, clientOrderId: string) {
  if (ALPACA_MODE === 'mock') {
    // deterministic mock response (similar to MockAdapter)
    const qty = Math.max(1, Math.floor(notional / 100));
    const price = 100;
    return {
      id: `mock-${Date.now()}`,
      client_order_id: clientOrderId,
      symbol,
      side: 'buy',
      qty,
      filled_qty: qty,
      filled_avg_price: price,
      status: 'filled',
    };
  }

  const payload: any = { symbol, side: 'buy', type: 'market', time_in_force: 'day', client_order_id: clientOrderId };
  if (notional) payload.notional = String(notional);

  const url = `${ALPACA_BASE.replace(/\/$/, '')}/v2/orders`;
  const res = await fetch(url, { method: 'POST', headers: alpacaHeaders(), body: JSON.stringify(payload) });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Alpaca order failed: ${res.status} ${text}`) as any;
    err.status = res.status;
    throw err;
  }
  return JSON.parse(text);
}

async function persistOrderRecord(botId: number, alpacaOrder: any) {
  const url = `${SUPABASE_URL}/rest/v1/order_records`;
  const body = {
    bot_id: botId,
    alpaca_order_id: alpacaOrder.id || alpacaOrder.client_order_id || null,
    type: alpacaOrder.type || 'market',
    side: alpacaOrder.side || 'buy',
    qty: alpacaOrder.qty ? Number(alpacaOrder.qty) : (alpacaOrder.filled_qty ? Number(alpacaOrder.filled_qty) : null),
    filled_qty: alpacaOrder.filled_qty ? Number(alpacaOrder.filled_qty) : 0,
    price: alpacaOrder.filled_avg_price ? Number(alpacaOrder.filled_avg_price) : (alpacaOrder.price ? Number(alpacaOrder.price) : null),
    status: alpacaOrder.status || 'unknown',
    meta: alpacaOrder,
    created_at: new Date().toISOString(),
  };
  const res = await fetch(url, { method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'return=representation' }, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Failed to persist order: ${res.status} ${text}`);
  }
  return JSON.parse(text);
}

addEventListener('fetch', (event: any) => {
  event.respondWith(handle(event.request));
});

async function handle(req: Request) {
  try {
    const incomingAuth = req.headers.get('authorization');
    if (!SERVICE_ROLE && !incomingAuth) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

    const bots = await fetchActiveBots();
    const results: any[] = [];

    for (const bot of bots) {
      try {
        const notional = Number(bot.dca_amount || 0);
        if (!notional || notional <= 0) {
          results.push({ bot_id: bot.id, ok: false, reason: 'invalid dca_amount' });
          continue;
        }

        const symbol = bot.symbol || (typeof bot.name === 'string' ? bot.name.split(' ')[0] : 'AAPL');

        // Idempotency key: allow external key via bot.last_idempotency_key or generate one per-run
        const idempotencyKey = `bot:${bot.id}:dca:${new Date().toISOString().slice(0, 10)}`; // daily DCA key

        // Check idempotency: if already present and done, skip
        const existing = await checkIdempotency(idempotencyKey);
        if (existing && existing.status === 'done') {
          results.push({ bot_id: bot.id, ok: true, skipped: true, reason: 'already_executed' });
          continue;
        }

        // If not exists, create pending idempotency record (atomic upsert to avoid race)
        if (!existing) {
          await createIdempotencyAtomic(idempotencyKey, bot.id);
        }

        // Place order with retry/backoff
        const clientOrderId = crypto.randomUUID();
        let alpacaOrder: any;
        try {
          alpacaOrder = await retry(() => alpacaPlaceOrder({ symbol, notional, client_order_id: clientOrderId }), 4, 500);
        } catch (e) {
          // increment failure_count and create alert if threshold exceeded
          try {
            await updateIdempotency(idempotencyKey, { status: 'failed', error: String(e), failure_count: (existing?.failure_count || 0) + 1, updated_at: new Date().toISOString() });
            const failCount = (existing?.failure_count || 0) + 1;
            if (failCount >= 3) {
              // insert alert
              await fetch(`${SUPABASE_URL}/rest/v1/alerts`, { method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'return=representation' }, body: JSON.stringify({ source: 'run-bots', severity: 'critical', message: `Repeated failures for idempotency ${idempotencyKey}`, metadata: { botId: bot.id, error: String(e) } }) });
            }
          } catch (ee) {
            console.error('failed to update idempotency after order failure', ee);
          }

          results.push({ bot_id: bot.id, ok: false, error: String(e) });
          continue;
        }

        // Persist order record and mark idempotency done
        const persisted = await persistOrderRecord(bot.id, alpacaOrder);
        await updateIdempotency(idempotencyKey, { status: 'done', alpaca_order_id: alpacaOrder.id || clientOrderId, updated_at: new Date().toISOString() });

        // emit simple metric: insert into webhook_logs as metric (lightweight)
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/webhook_logs`, { method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'return=representation' }, body: JSON.stringify({ source: 'run-bots-metric', payload: { bot_id: bot.id, action: 'dca_executed', alpaca_order_id: alpacaOrder.id || clientOrderId }, created_at: new Date().toISOString() }) });
        } catch (ee) {
          console.warn('failed to write metric', ee);
        }

        // Update bot.last_run_at
        await fetch(`${SUPABASE_URL}/rest/v1/bots?id=eq.${bot.id}`, {
          method: 'PATCH',
          headers: { ...supabaseHeaders(), Prefer: 'return=representation' },
          body: JSON.stringify({ last_run_at: new Date().toISOString() }),
        });

        results.push({ bot_id: bot.id, ok: true, alpacaOrderId: alpacaOrder.id ?? clientOrderId, persisted: persisted?.[0] ?? null });
      } catch (e) {
        console.error('bot processing error', (bot as any).id, e);
        results.push({ bot_id: (bot as any).id ?? null, ok: false, error: String(e) });
      }
    }

    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('run-bots error', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
