import { MarketDataBar } from '@/types/market'
import { YahooFinanceProvider } from './yahoo'
import { AlpacaProvider } from './alpaca'
import { MockDataProvider } from './mock'

export interface MarketDataProvider {
  getHistoricalData(
    symbol: string,
    timeframe: string,
    start: string,
    end: string
  ): Promise<MarketDataBar[]>
  
  subscribeToRealtime?(
    symbol: string,
    callback: (data: MarketDataBar) => void
  ): void
  
  unsubscribe?(symbol: string): void
}

export class MarketDataService {
  private provider: MarketDataProvider
  
  constructor(providerType: 'mock' | 'yahoo' | 'alpaca', config?: any) {
    switch (providerType) {
      case 'yahoo':
        this.provider = new YahooFinanceProvider()
        break
      case 'alpaca':
        this.provider = new AlpacaProvider(config)
        break
      default:
        this.provider = new MockDataProvider()
    }
  }

  async getHistoricalData(
    symbol: string,
    timeframe: string,
    start: string,
    end: string
  ): Promise<MarketDataBar[]> {
    try {
      return await this.provider.getHistoricalData(symbol, timeframe, start, end)
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error)
      throw error
    }
  }

  subscribeToRealtime(symbol: string, callback: (data: MarketDataBar) => void) {
    if (this.provider.subscribeToRealtime) {
      this.provider.subscribeToRealtime(symbol, callback)
    }
  }

  unsubscribe(symbol: string) {
    if (this.provider.unsubscribe) {
      this.provider.unsubscribe(symbol)
    }
  }
}
