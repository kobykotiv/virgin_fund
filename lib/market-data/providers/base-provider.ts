export interface Quote {
  symbol: string;
  price: number;
  timestamp: number;
  source: 'alpaca' | 'yahoo' | 'mock';
  bid?: number;
  ask?: number;
  volume?: number;
}

export interface BarData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '1d' | '1w';

export interface MarketDataProvider {
  name: string;
  getQuote(symbol: string): Promise<Quote>;
  getHistoricalData(symbol: string, timeframe: Timeframe): Promise<BarData[]>;
  watchSymbol(symbol: string, callback: (data: Quote) => void): () => void;
}
