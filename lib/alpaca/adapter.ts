export type Bar = { t: string; o: number; h: number; l: number; c: number; v?: number };

export type OrderSide = 'buy' | 'sell';

export type PlaceOrderParams = {
  symbol: string;
  qty?: number;
  notional?: number; // dollar amount
  side: OrderSide;
  type?: 'market' | 'limit';
  time_in_force?: 'day' | 'gtc';
  client_order_id?: string;
};

export type OrderResult = {
  id?: string;
  client_order_id?: string;
  symbol: string;
  side: OrderSide;
  qty: number;
  filled_qty: number;
  price?: number;
  status: string;
  raw?: any;
};

export interface AlpacaAdapter {
  placeOrder(params: PlaceOrderParams): Promise<OrderResult>;
  getPosition(symbol: string): Promise<{ qty: number; avg_entry_price: number } | null>;
  getAccount(): Promise<any>;
  getBars(symbol: string, start: string, end: string, timeframe: string): Promise<Bar[]>;
}
