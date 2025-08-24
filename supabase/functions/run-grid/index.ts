// Edge Function: run-grid
// Scans bots configured with grid strategy and executes buy/sell logic on Alpaca paper trading.

declare const Deno: any;
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { decryptSecret } from '@/lib/crypto';
import { placeOrder, fetchLatestTradePrice } from './adapter';

const SUPABASE_URL = Deno?.env?.get('SUPABASE_URL') || Deno?.env?.get('NEXT_PUBLIC_SUPABASE_URL');
const serviceRole = Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY');

function supabaseHeaders() {
  return {
    apikey: serviceRole || '',
    Authorization: `Bearer ${serviceRole || ''}`,
    'Content-Type': 'application/json',
  };
}

async function fetchGridBots() {
  const url = `${SUPABASE_URL}/rest/v1/bots?type=eq.grid&enabled=eq.true`;
  const res = await fetch(url, { headers: supabaseHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch bots: ${res.status} ${await res.text()}`);
  return await res.json();
}

async function fetchUserApiKey(userId: string) {
  const url = `${SUPABASE_URL}/rest/v1/api_keys?user_id=eq.${userId}&is_active=eq.true&is_paper=eq.true&limit=1`;
  const res = await fetch(url, { headers: supabaseHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch api_keys: ${res.status} ${await res.text()}`);
  const arr = await res.json();
  return arr?.[0] ?? null;
}

async function run() {
  const bots = await fetchGridBots();
  const results: any[] = [];

  for (const bot of bots) {
    try {
      // Expect config.jsonb to contain grid params: { symbol: 'BTCUSD', grid_pct: 1, size: 100, baseUrl: 'https://paper-api.alpaca.markets' }
      const config = bot.config || {};
      const symbol = config.symbol || bot.symbol || 'BTCUSD';
      const gridPct = Number(config.grid_pct ?? 1); // percent
      const size = Number(config.size ?? config.dca_amount ?? 100);

      const keyRow = await fetchUserApiKey(bot.user_id);
      if (!keyRow) {
        results.push({ bot_id: bot.id, ok: false, reason: 'no_api_key' });
        continue;
      }

      // decrypt secret using server-side lib
      const secretBlob = keyRow.encrypted_secret;
      const secret = decryptSecret(secretBlob);
      const keyId = keyRow.api_key_hash ? null : keyRow.name; // non ideal - assume name stores key id; better: store key_id separately
      // Assumption: metadata contains key_id (alpaca key id) and optionally baseUrl
      const apiKeyId = keyRow.metadata?.key_id || keyRow.metadata?.alpaca_key_id || keyRow.name || '';
      const apiSecret = secret;
      const baseUrl = keyRow.metadata?.baseUrl || 'https://paper-api.alpaca.markets';

      // fetch current price
      const price = await fetchLatestTradePrice(apiKeyId, apiSecret, symbol, baseUrl);
      if (!price) {
        results.push({ bot_id: bot.id, ok: false, reason: 'price_fetch_failed' });
        continue;
      }

      // Determine grid step price based on gridPct
      const step = price * (gridPct / 100);

      // Decide to place buy if price <= last grid level or sell if price >= next grid level
      // For simplicity: place a buy at current price if bot has no positions (placeholder logic)
      const clientOrderId = `grid-${bot.id}-${Date.now()}`;

      const ord = await placeOrder({ keyId: apiKeyId, secretKey: apiSecret, baseUrl, symbol, notional: size, client_order_id: clientOrderId, side: 'buy' });

      // Persist via Supabase REST
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/order_records`, { method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'return=representation' }, body: JSON.stringify({ bot_id: bot.id, alpaca_order_id: ord.id || ord.client_order_id, type: ord.type, side: ord.side, qty: ord.qty || ord.filled_qty, filled_qty: ord.filled_qty || 0, price: ord.filled_avg_price || ord.price || null, status: ord.status || 'unknown', meta: ord, created_at: new Date().toISOString() }) });
      } catch (ee) {
        console.warn('persist order failed', ee);
      }

      results.push({ bot_id: bot.id, ok: true, order: ord });
    } catch (e) {
      console.error('grid bot error', e);
      results.push({ bot_id: bot.id, ok: false, error: String(e) });
    }
  }

  return results;
}

addEventListener('fetch', (ev: any) => ev.respondWith(handle(ev.request)));

async function handle(req: any) {
  try {
    const r = await run();
    return new Response(JSON.stringify({ ok: true, processed: r.length, results: r }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('run-grid error', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
