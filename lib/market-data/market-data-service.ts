import { MarketDataProvider, Quote } from './providers/base-provider';
import { AlpacaProvider } from './providers/alpaca-provider';
import { YahooProvider } from './providers/yahoo-provider';

export class MarketDataService {
  private provider: MarketDataProvider;
  private subscriptions: Map<string, Set<(quote: Quote) => void>> = new Map();

  constructor() {
    const config = {
      keyId: process.env.NEXT_PUBLIC_ALPACA_KEY || '',
      secretKey: process.env.NEXT_PUBLIC_ALPACA_SECRET || '',
      paper: true
    };

    this.provider = new AlpacaProvider(config);
  }

  async getQuote(symbol: string): Promise<Quote> {
    return this.provider.getQuote(symbol);
  }

  watchSymbol(symbol: string, callback: (quote: Quote) => void): () => void {
    // Initialize set of callbacks for this symbol if it doesn't exist
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set());
      
      // Start the real-time data stream for this symbol
      this.provider.watchSymbol(symbol, (quote) => {
        // Notify all callbacks for this symbol
        this.subscriptions.get(symbol)?.forEach(cb => cb(quote));
      });
    }

    // Add this callback to the set
    this.subscriptions.get(symbol)?.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(symbol);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscriptions.delete(symbol);
        }
      }
    };
  }
}
