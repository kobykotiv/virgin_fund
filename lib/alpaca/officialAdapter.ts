import { AlpacaAdapter, Bar, PlaceOrderParams, OrderResult } from './adapter';
import Alpaca from '@alpacahq/alpaca-trade-api';

const KEY = process.env.ALPACA_KEY || process.env.NEXT_PUBLIC_ALPACA_KEY;
const SECRET = process.env.ALPACA_SECRET || process.env.NEXT_PUBLIC_ALPACA_SECRET;
const BASE_URL = process.env.ALPACA_BASE_URL || process.env.NEXT_PUBLIC_ALPACA_BASE_URL;

const alpaca = new Alpaca({
  keyId: KEY,
  secretKey: SECRET,
  paper: (process.env.NEXT_PUBLIC_ALPACA_MODE || process.env.ALPACA_MODE || 'mock') !== 'live',
  baseUrl: BASE_URL,
});

export class OfficialAdapter implements AlpacaAdapter {
  async placeOrder(params: PlaceOrderParams): Promise<OrderResult> {
    const payload: any = {
      symbol: params.symbol,
      side: params.side,
      type: params.type ?? 'market',
      time_in_force: params.time_in_force ?? 'day',
    };
    if (params.qty) payload.qty = String(params.qty);
    if (params.notional) payload.notional = String(params.notional);
    if (params.client_order_id) payload.client_order_id = params.client_order_id;

    const data = await alpaca.createOrder(payload);
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
      const p = await alpaca.getPosition(symbol);
      return { qty: Number(p.qty), avg_entry_price: Number(p.avg_entry_price) };
    } catch (e: any) {
      if (e && e.statusCode === 404) return null;
      throw e;
    }
  }

  async getAccount() {
    return await alpaca.getAccount();
  }

  async getBars(symbol: string, start: string, end: string, timeframe: string) {
    // alpaca.getBarsV2 returns an iterator; use getBars which recent versions expose
    const bars = [] as Bar[];
    const res = await alpaca.getBarsV2(symbol, {
      start: start,
      end: end,
      timeframe: timeframe,
    });
    for await (const b of res) {
      bars.push({ t: b.t.toISOString(), o: Number(b.o), h: Number(b.h), l: Number(b.l), c: Number(b.c), v: Number(b.v) });
    }
    return bars;
  }
}
