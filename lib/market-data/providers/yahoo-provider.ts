import yahooFinance from 'yahoo-finance2';
import { MarketDataProvider, Quote, BarData, Timeframe } from './base-provider';

export class YahooProvider implements MarketDataProvider {
  name = 'yahoo';

  async getQuote(symbol: string): Promise<Quote> {
    const data = await yahooFinance.quote(symbol);
    return {
      symbol,
      price: data.regularMarketPrice,
      timestamp: Date.now(),
      source: 'yahoo',
      volume: data.regularMarketVolume
    };
  }

  async getHistoricalData(symbol: string, timeframe: Timeframe): Promise<BarData[]> {
    const data = await yahooFinance.historical(symbol, {
      period1: this.getStartDate(timeframe),
      interval: this.mapTimeframe(timeframe)
    });
    
    return data.map(bar => ({
      timestamp: new Date(bar.date).getTime(),
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume
    }));
  }
}
