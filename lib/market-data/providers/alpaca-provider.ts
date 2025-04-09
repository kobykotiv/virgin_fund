import Alpaca from '@alpacahq/alpaca-trade-api';
import { MarketDataProvider, Quote, BarData, Timeframe } from './base-provider';

interface AlpacaConfig {
  keyId: string;
  secretKey: string;
  paper?: boolean;
  baseUrl?: string;
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
    const ws = this.client.crypto.data_stream_v2;
    
    ws.onConnect(() => {
      console.log('Connected to Alpaca WebSocket');
      ws.subscribe([symbol]);
    });

    ws.onStockTrade((trade) => {
      if (trade.Symbol === symbol) {
        callback({
          symbol,
          price: trade.Price,
          timestamp: new Date(trade.Timestamp).getTime(),
          source: 'alpaca'
        });
      }
    });

    return () => {
      ws.unsubscribe([symbol]);
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
