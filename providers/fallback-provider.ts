// FallbackProvider for MarketDataProvider interface

import type { MarketDataProvider, Quote, BarData } from "./market-data-provider"

export class FallbackProvider implements MarketDataProvider {
  private providers: MarketDataProvider[]

  constructor(providers: MarketDataProvider[]) {
    this.providers = providers
  }

  async getQuote(symbol: string): Promise<Quote> {
    for (const provider of this.providers) {
      try {
        return await provider.getQuote(symbol)
      } catch (error) {
        continue
      }
    }
    throw new Error("All providers failed")
  }

  async getHistoricalData(symbol: string, timeframe: any): Promise<BarData[]> {
    for (const provider of this.providers) {
      try {
        // allow providers to accept various timeframe shapes (string | object) in this fallback stub
        return await provider.getHistoricalData(symbol, timeframe as any)
      } catch (error) {
        continue
      }
    }
    throw new Error("All providers failed")
  }

  watchSymbol(symbol: string, callback: (data: Quote) => void): void {
    for (const provider of this.providers) {
      try {
        provider.watchSymbol(symbol, callback)
        return
      } catch (error) {
        continue
      }
    }
    throw new Error("All providers failed")
  }
}
