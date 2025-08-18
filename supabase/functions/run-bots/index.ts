// Supabase Edge Function: run-bots
// This implementation uses Deno fetch (no external Node libs) to:
// 1. Fetch active bots from Supabase REST API
// 2. For each bot, place a DCA buy order on Alpaca using REST /v2/orders
// 3. Persist an order record to Supabase via REST
// 4. Return a summary

// avoid TypeScript/Node tooling errors in the repo by declaring Deno
declare const Deno: any;

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL');
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const ALPACA_BASE = Deno.env.get('ALPACA_BASE_URL') || Deno.env.get('NEXT_PUBLIC_ALPACA_BASE_URL') || 'https://paper-api.alpaca.markets';
const ALPACA_KEY = Deno.env.get('ALPACA_KEY');
const ALPACA_SECRET = Deno.env.get('ALPACA_SECRET');

if (!SUPABASE_URL) {
  console.warn('SUPABASE_URL is not set in environment for run-bots function');
}
if (!SERVICE_ROLE) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set in environment for run-bots function');
}
if (!ALPACA_KEY || !ALPACA_SECRET) {
  console.warn('ALPACA_KEY or ALPACA_SECRET is not set in environment for run-bots function');
}

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

async function fetchActiveBots() {
  const url = `${SUPABASE_URL}/rest/v1/bots?liquidated=eq.false&enabled=eq.true`;
  const res = await fetch(url, { headers: supabaseHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch bots: ${res.status} ${await res.text()}`);
  return await res.json();
}

async function placeAlpacaOrder(symbol: string, notional: number, clientOrderId: string) {
  const payload: any = {
    symbol,
    side: 'buy',
    notional: String(notional),
    type: 'market',
    time_in_force: 'day',
    client_order_id: clientOrderId,
  };

  const url = `${ALPACA_BASE.replace(/\/$/, '')}/v2/orders`;
  const res = await fetch(url, { method: 'POST', headers: alpacaHeaders(), body: JSON.stringify(payload) });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Alpaca order failed: ${res.status} ${text}`);
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
    price: alpacaOrder.filled_avg_price ? Number(alpacaOrder.filled_avg_price) : null,
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
    // Simple auth: require service role header or Authorization
    const incomingAuth = req.headers.get('authorization');
    if (!SERVICE_ROLE && !incomingAuth) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

    const bots = await fetchActiveBots();
    const results: any[] = [];

    for (const bot of bots) {
      try {
        // Demo MVP behavior: place a DCA buy using bot.dca_amount as notional
        const notional = Number(bot.dca_amount || bot.dca_amount || 0);
        if (!notional || notional <= 0) {
          results.push({ bot_id: bot.id, ok: false, reason: 'invalid dca_amount' });
          continue;
        }

        // Symbol resolution: use bot.symbol if exists else bot.name
        const symbol = bot.symbol || (typeof bot.name === 'string' ? bot.name.split(' ')[0] : 'AAPL');

        const clientOrderId = crypto.randomUUID();
        const alpacaOrder = await placeAlpacaOrder(symbol, notional, clientOrderId);

        // Persist order to Supabase
        const persisted = await persistOrderRecord(bot.id, alpacaOrder);

        // Update bot last_run_at
        await fetch(`${SUPABASE_URL}/rest/v1/bots?id=eq.${bot.id}`, {
          method: 'PATCH',
          headers: { ...supabaseHeaders(), Prefer: 'return=representation' },
          body: JSON.stringify({ last_run_at: new Date().toISOString() }),
        });

        results.push({ bot_id: bot.id, ok: true, alpacaOrderId: alpacaOrder.id ?? clientOrderId, persisted: persisted?.[0] ?? null });
      } catch (e) {
        console.error('bot processing error', bot.id, e);
        results.push({ bot_id: bot.id, ok: false, error: String(e) });
      }
    }

    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('run-bots error', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
