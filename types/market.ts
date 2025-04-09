export interface MarketDataBar {
  t: string; // timestamp
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  author: string;
  created_at: string;
  updated_at: string;
  url: string;
  images?: string[];
  symbols: string[];
  source: string;
}

export interface MarketDataConfig {
  apiKey: string;
  secretKey: string;
  isPaper: boolean;
}

export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  lastUpdated: Date;
}

export interface AssetHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface MarketCalendarDay {
  date: string;
  open: string;
  close: string;
  session_open: boolean;
  session_close: boolean;
}
