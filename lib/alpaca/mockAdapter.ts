import { AlpacaAdapter, Bar, PlaceOrderParams, OrderResult } from './adapter';

export class MockAdapter implements AlpacaAdapter {
  async placeOrder(params: PlaceOrderParams): Promise<OrderResult> {
    const qty = params.qty ?? Math.max(1, Math.floor((params.notional ?? 100) / 100));
    const price = 100; // deterministic price for MVP
    return {
      id: `mock-${Date.now()}`,
      client_order_id: params.client_order_id,
      symbol: params.symbol,
      side: params.side,
      qty,
      filled_qty: qty,
      price,
      status: 'filled',
      raw: { params },
    };
  }

  async getPosition(symbol: string) {
    return null;
  }

  async getAccount() {
    return { cash: 100000, buying_power: 100000 };
  }

  async getBars(symbol: string, start: string, end: string, timeframe: string) {
    // return mock daily bars between start and end
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const bars: Bar[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const base = 100 + i * 0.5;
      bars.push({ t: d.toISOString().slice(0, 10), o: base, h: base + 1, l: base - 1, c: base + 0.5, v: 1000 });
    }
    return bars;
  }
}
