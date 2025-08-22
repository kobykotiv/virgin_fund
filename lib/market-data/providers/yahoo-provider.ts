import yahooFinance from 'yahoo-finance2';
import { MarketDataProvider, Quote, BarData, Timeframe } from './base-provider';

export class YahooProvider implements MarketDataProvider {
  name = 'yahoo';

  async getQuote(symbol: string): Promise<Quote> {
    const data = await yahooFinance.quote(symbol);
    return {
      symbol,
      price: (data as any)?.regularMarketPrice ?? 0,
      timestamp: Date.now(),
      source: 'yahoo',
      volume: (data as any)?.regularMarketVolume ?? 0
    };
  }

  async getHistoricalData(symbol: string, timeframe: Timeframe): Promise<BarData[]> {
    // yahoo-finance2 historical() expects daily/weekly/monthly intervals.
    // Map intraday timeframes to a daily request to satisfy typings and provide usable history.
    const period1 = this.getStartDate(timeframe);
    const interval = this.mapTimeframe(timeframe) as any; // cast to any to satisfy yahoo-finance2 typings

    const data = await yahooFinance.historical(symbol, {
      period1,
      interval,
    } as any);

    const bars = (data || []) as any[];
    return bars.map((bar: any) => ({
      timestamp: new Date(bar.date).getTime(),
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume ?? 0
    }));
  }

  // Lightweight realtime watcher: poll quotes periodically when websocket isn't available.
  watchSymbol(symbol: string, callback: (data: Quote) => void): () => void {
    const intervalMs = 5000;
    let stopped = false;

    const poll = async () => {
      if (stopped) return;
      try {
        const q = await this.getQuote(symbol);
        callback(q);
      } catch (e) {
        // swallow polling errors
      } finally {
        if (!stopped) setTimeout(poll, intervalMs);
      }
    };

    // start immediate poll loop
    setTimeout(poll, 0);

    return () => {
      stopped = true;
    };
  }

  // Derive a sensible start date for yahoo's historical API based on timeframe
  getStartDate(timeframe: Timeframe): Date {
    // Use Timeframe values defined in base-provider: '1m' | '5m' | '15m' | '1h' | '1d' | '1w'
    switch (timeframe) {
      case '1m':
      case '5m':
      case '15m':
      case '1h':
        // return last 7 days for intraday-ish requests
        return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case '1d':
        // 1 month for daily
        return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      case '1w':
        // 1 year for weekly
        return new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  // Map internal timeframe to yahoo-finance2 interval strings (restrict to daily/weekly/monthly)
  mapTimeframe(timeframe: Timeframe): '1d' | '1wk' | '1mo' {
    // For intraday/short timeframes, request daily data and let caller aggregate if needed.
    switch (timeframe) {
      case '1w':
        return '1wk';
      case '1d':
        return '1d';
      default:
        return '1d';
    }
  }
}
