import yahooFinance from 'yahoo-finance2';
import Alpaca from '@alpacahq/alpaca-trade-api';

const alpaca = new Alpaca({
  keyId: process.env.NEXT_PUBLIC_ALPACA_KEY_ID || '',
  secretKey: process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY || '',
  paper: true
});

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export async function getMarketData(symbol: string): Promise<MarketData> {
  try {
    // Try Alpaca first
    const alpacaData = await alpaca.getLatestTrade(symbol);
    return {
      symbol,
      price: alpacaData.Price,
      change: 0, // Alpaca doesn't provide change in single request
      changePercent: 0,
      volume: 0,
      timestamp: new Date(alpacaData.Timestamp)
    };
  } catch (error) {
    // Fallback to Yahoo Finance
    const quote = await yahooFinance.quote(symbol);
    return {
      symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      timestamp: new Date()
    };
  }
}
