import Alpaca from '@alpacahq/alpaca-trade-api';
import { MarketDataProvider, Quote, BarData, Timeframe } from './base-provider';

interface AlpacaConfig {
  keyId: string;
  secretKey: string;
  paper?: boolean;
  baseUrl?: string;
}

/**
 * Fetches latest prices for a list of symbols from Alpaca.
 * Returns a mapping from symbol to price.
 */
export async function getAlpacaPrices(symbols: string[], vsCurrency: string = "usd"): Promise<Record<string, number>> {
  // Only USD supported for now
  if (vsCurrency.toLowerCase() !== "usd") throw new Error("Alpaca only supports USD pricing");
  const keyId = process.env.ALPACA_API_KEY_ID || "";
  const secretKey = process.env.ALPACA_API_SECRET_KEY || "";
  if (!keyId || !secretKey) throw new Error("Missing Alpaca API credentials");
  const provider = new AlpacaProvider({ keyId, secretKey, paper: true });
  const result: Record<string, number> = {};
  for (const symbol of symbols) {
    try {
      const quote = await provider.getQuote(symbol);
      result[symbol] = quote.price;
    } catch (e) {
      // skip symbol on error
    }
  }
  return result;
}

export class AlpacaProvider implements MarketDataProvider {
  private client: Alpaca;
  name = 'alpaca';

  constructor(config: AlpacaConfig) {
    this.client = new Alpaca({
      keyId: config.keyId,
      secretKey: config.secretKey,
      paper: config.paper,
      baseUrl: config.baseUrl || 'https://paper-api.alpaca.markets',
      feed: 'iex' // Use IEX as data feed
    });
  }

  async getQuote(symbol: string): Promise<Quote> {
    try {
      // Use getLatestTrade instead of lastQuote
      const trade = await this.client.getLatestTrade(symbol);
      const quote = await this.client.getLatestQuote(symbol);
      
      return {
        symbol,
        price: trade.Price,
        timestamp: new Date(trade.Timestamp).getTime(),
        source: 'alpaca',
        bid: quote.BidPrice,
        ask: quote.AskPrice,
        volume: trade.Size
      };
    } catch (error) {
      console.error('Alpaca quote error:', error);
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  }

  async getHistoricalData(symbol: string, timeframe: Timeframe): Promise<BarData[]> {
    try {
      const bars = await this.client.getBarsV2(
        symbol,
        {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
          timeframe: this.mapTimeframe(timeframe),
          limit: 100
        }
      );

      const barData: BarData[] = [];
      for await (const bar of bars) {
        barData.push({
          timestamp: new Date(bar.Timestamp).getTime(),
          open: bar.OpenPrice,
          high: bar.HighPrice,
          low: bar.LowPrice,
          close: bar.ClosePrice,
          volume: bar.Volume
        });
      }

      return barData;
    } catch (error) {
      console.error('Alpaca historical data error:', error);
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
  }

  watchSymbol(symbol: string, callback: (data: Quote) => void): () => void {
    // Not all Alpaca clients expose crypto.data_stream_v2 in every environment.
    // Guard access and gracefully fall back to a polling-based watcher when websocket isn't available.
    const ws: any =
      (this.client as any)?.crypto?.data_stream_v2 ||
      (this.client as any)?.data_stream_v2 ||
      (this.client as any)?.websocket ||
      null;

    if (!ws) {
      // Fallback: poll latest quote periodically
      const intervalMs = 3000;
      let stopped = false;

      const poll = async () => {
        if (stopped) return;
        try {
          const q = await this.getQuote(symbol);
          callback(q);
        } catch (e) {
          // swallow
        } finally {
          if (!stopped) setTimeout(poll, intervalMs);
        }
      };

      setTimeout(poll, 0);
      return () => {
        stopped = true;
      };
    }

    try {
      ws.onConnect(() => {
        try {
          console.log('Connected to Alpaca WebSocket');
          if (typeof ws.subscribe === 'function') ws.subscribe([symbol]);
        } catch (e) {
          // ignore
        }
      });

      if (typeof ws.onStockTrade === 'function') {
        ws.onStockTrade((trade: any) => {
          if (trade.Symbol === symbol) {
            callback({
              symbol,
              price: trade.Price,
              timestamp: new Date(trade.Timestamp).getTime(),
              source: 'alpaca'
            });
          }
        });
      }
    } catch (e) {
      // If websocket wiring fails, fall back to polling
      const intervalMs = 3000;
      let stopped = false;

      const poll = async () => {
        if (stopped) return;
        try {
          const q = await this.getQuote(symbol);
          callback(q);
        } catch (err) {
          // swallow
        } finally {
          if (!stopped) setTimeout(poll, intervalMs);
        }
      };

      setTimeout(poll, 0);
      return () => {
        stopped = true;
      };
    }

    return () => {
      try {
        if (typeof ws.unsubscribe === 'function') ws.unsubscribe([symbol]);
      } catch (e) {
        // ignore
      }
    };
  }

  private mapTimeframe(timeframe: Timeframe): string {
    const map: Record<Timeframe, string> = {
      '1m': '1Min',
      '5m': '5Min',
      '15m': '15Min',
      '1h': '1Hour',
      '1d': '1Day',
      '1w': '1Week'
    };
    return map[timeframe];
  }
}
