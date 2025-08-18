// Deno-compatible lightweight Alpaca adapter used inside the supabase Edge Function
declare const Deno: any;

const ALPACA_BASE = Deno.env.get('ALPACA_BASE_URL') || Deno.env.get('NEXT_PUBLIC_ALPACA_BASE_URL') || 'https://paper-api.alpaca.markets';
const KEY = Deno.env.get('ALPACA_KEY');
const SECRET = Deno.env.get('ALPACA_SECRET');
const MODE = Deno.env.get('ALPACA_MODE') || Deno.env.get('NEXT_PUBLIC_ALPACA_MODE') || 'rest';

function headers() {
  return {
    'APCA-API-KEY-ID': KEY || '',
    'APCA-API-SECRET-KEY': SECRET || '',
    'Content-Type': 'application/json',
  };
}

export async function placeOrder(params: { symbol: string; notional?: number; qty?: number; side?: string; client_order_id?: string }) {
  if (MODE === 'mock') {
    const notional = params.notional ?? 100;
    const qty = params.qty ?? Math.max(1, Math.floor(notional / 100));
    const price = 100;
    return {
      id: `mock-${Date.now()}`,
      client_order_id: params.client_order_id,
      symbol: params.symbol,
      side: params.side || 'buy',
      qty,
      filled_qty: qty,
      filled_avg_price: price,
      status: 'filled',
    };
  }

  const payload: any = {
    symbol: params.symbol,
    side: params.side || 'buy',
    type: 'market',
    time_in_force: 'day',
  };
  if (params.notional) payload.notional = String(params.notional);
  if (params.qty) payload.qty = String(params.qty);
  if (params.client_order_id) payload.client_order_id = params.client_order_id;

  const url = `${ALPACA_BASE.replace(/\/$/, '')}/v2/orders`;
  const res = await fetch(url, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
  const text = await res.text();
  if (!res.ok) {
    const err: any = new Error(`Alpaca order failed: ${res.status} ${text}`);
    err.status = res.status;
    throw err;
  }
  return JSON.parse(text);
}
