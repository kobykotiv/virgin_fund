// lib/alpaca-trading.ts

export interface BaseOrder {
  symbol: string;
  qty: number;
  side: 'buy' | 'sell';
  time_in_force: 'day' | 'gtc';
}

export interface MarketOrder extends BaseOrder {
  type: 'market';
}

export interface LimitOrder extends BaseOrder {
  type: 'limit';
  limit_price: number;
}

export type OrderParams = MarketOrder | LimitOrder | FractionalOrder;

export interface FractionalOrder {
  symbol: string;
  qty: number;
  notional?: number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  time_in_force: 'day' | 'gtc';
  limit_price?: number;
}

export interface Order {
  id: string;
  symbol: string;
  qty: number;
  status: string;
  filled_at: string;
}

export class AlpacaTradingClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(apiKey: string, apiSecret: string, baseUrl = 'https://paper-api.alpaca.markets') {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl;
  }

  async placeOrder(order: OrderParams): Promise<Order> {
    try {
      const res = await fetch(`${this.baseUrl}/v2/orders`, {
        method: 'POST',
        headers: {
          'APCA-API-KEY-ID': this.apiKey,
          'APCA-API-SECRET-KEY': this.apiSecret,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      const data = await res.json();
      return {
        id: data.id,
        symbol: data.symbol,
        qty: parseFloat(data.qty),
        status: data.status,
        filled_at: data.filled_at
      };
    } catch (error: any) {
      if (error.code === 'insufficient_funds') {
        throw new Error('Insufficient funds');
      } else if (error.code === 'market_closed') {
        throw new Error('Market is closed');
      }
      throw error;
    }
  }

  async placeFractionalOrder(symbol: string, qty: number, notional?: number): Promise<Order> {
    return this.placeOrder({
      symbol,
      qty: parseFloat(qty.toFixed(6)),
      notional,
      side: 'buy',
      type: 'market',
      time_in_force: 'day'
    });
  }
}

export class MockTradingClient {
  async placeOrder(order: any): Promise<Order> {
    return {
      id: 'mock-order-id',
      symbol: order.symbol,
      qty: order.qty,
      status: 'filled',
      filled_at: new Date().toISOString()
    };
  }
}
