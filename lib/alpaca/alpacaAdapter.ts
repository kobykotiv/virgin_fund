import { AlpacaAdapter, Bar, PlaceOrderParams, OrderResult } from './adapter';
import axios from 'axios';

const ALPACA_BASE = process.env.ALPACA_BASE_URL || process.env.NEXT_PUBLIC_ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';
const KEY = process.env.ALPACA_KEY || process.env.NEXT_PUBLIC_ALPACA_KEY;
const SECRET = process.env.ALPACA_SECRET || process.env.NEXT_PUBLIC_ALPACA_SECRET;

function headers() {
  return {
    'APCA-API-KEY-ID': KEY,
    'APCA-API-SECRET-KEY': SECRET,
  };
}

export class AlpacaAdapterImpl implements AlpacaAdapter {
  async placeOrder(params: PlaceOrderParams): Promise<OrderResult> {
    const payload: any = { symbol: params.symbol, side: params.side, type: params.type ?? 'market', time_in_force: params.time_in_force ?? 'day' };
    if (params.qty) payload.qty = String(params.qty);
    if (params.notional) payload.notional = String(params.notional);
    if (params.client_order_id) payload.client_order_id = params.client_order_id;

    const url = `${ALPACA_BASE}/v2/orders`;
    const res = await axios.post(url, payload, { headers: headers() });
    const data = res.data;
    return {
      id: data.id,
      client_order_id: data.client_order_id,
      symbol: data.symbol,
      side: data.side,
      qty: Number(data.qty),
      filled_qty: Number(data.filled_qty ?? 0),
      price: data.filled_avg_price ? Number(data.filled_avg_price) : undefined,
      status: data.status,
      raw: data,
    };
  }

  async getPosition(symbol: string) {
    try {
      const url = `${ALPACA_BASE}/v2/positions/${encodeURIComponent(symbol)}`;
      const res = await axios.get(url, { headers: headers() });
      const d = res.data;
      return { qty: Number(d.qty), avg_entry_price: Number(d.avg_entry_price) };
    } catch (e: any) {
      if (e.response && e.response.status === 404) return null;
      throw e;
    }
  }

  async getAccount() {
    const url = `${ALPACA_BASE}/v2/account`;
    const res = await axios.get(url, { headers: headers() });
    return res.data;
  }

  async getBars(symbol: string, start: string, end: string, timeframe: string) {
    // use v2/stocks/{symbol}/bars
    const url = `${ALPACA_BASE}/v2/stocks/${encodeURIComponent(symbol)}/bars`;
    const res = await axios.get(url, {
      headers: headers(),
      params: {
        start: start,
        end: end,
        timeframe: timeframe,
        limit: 10000,
      },
    });
    const bars: Bar[] = (res.data && res.data.bars) ? res.data.bars.map((b: any) => ({ t: b.t, o: Number(b.o), h: Number(b.h), l: Number(b.l), c: Number(b.c), v: Number(b.v) })) : [];
    return bars;
  }
}
