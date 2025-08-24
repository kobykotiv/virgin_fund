// Lightweight Alpaca adapter that accepts API credentials at call time.
// Designed for use inside Edge Functions/servers where per-user creds are available.

type PlaceOrderParams = {
  keyId: string;
  secretKey: string;
  baseUrl?: string; // e.g. https://paper-api.alpaca.markets
  symbol: string;
  notional?: number;
  qty?: number;
  side?: 'buy' | 'sell';
  type?: string;
  time_in_force?: string;
  client_order_id?: string;
};

export async function placeOrder(params: PlaceOrderParams) {
  const base = (params.baseUrl || 'https://paper-api.alpaca.markets').replace(/\/$/, '');
  const url = `${base}/v2/orders`;
  const payload: any = {
    symbol: params.symbol,
    side: params.side || 'buy',
    type: params.type || 'market',
    time_in_force: params.time_in_force || 'day',
  };
  if (params.notional) payload.notional = String(params.notional);
  if (params.qty) payload.qty = String(params.qty);
  if (params.client_order_id) payload.client_order_id = params.client_order_id;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'APCA-API-KEY-ID': params.keyId,
      'APCA-API-SECRET-KEY': params.secretKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    const err: any = new Error(`Alpaca order failed: ${res.status} ${text}`);
    err.status = res.status;
    throw err;
  }
  return JSON.parse(text);
}

export async function fetchLatestTradePrice(keyId: string, secretKey: string, symbol: string, baseUrl?: string): Promise<number | null> {
  // Use Alpaca data API to fetch latest trade. This endpoint and path may vary by subscription.
  // We'll try the v2 stocks trades latest endpoint.
  const dataBase = 'https://data.alpaca.markets';
  const url = `${dataBase}/v2/stocks/${encodeURIComponent(symbol)}/trades/latest`;
  try {
    const res = await fetch(url, { headers: { 'APCA-API-KEY-ID': keyId, 'APCA-API-SECRET-KEY': secretKey } });
    if (!res.ok) return null;
    const json = await res.json();
    // expected shape: { trade: { p: price } }
    const price = json?.trade?.p ?? json?.price ?? null;
    return price ? Number(price) : null;
  } catch (e) {
    return null;
  }
}
