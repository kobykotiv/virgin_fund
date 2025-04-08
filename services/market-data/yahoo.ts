import { MarketDataProvider } from './index'
import { MarketDataBar } from '@/types/market'
import yahooFinance from 'yahoo-finance2'

export class YahooFinanceProvider implements MarketDataProvider {
  async getHistoricalData(
    symbol: string,
    timeframe: string,
    start: string,
    end: string
  ): Promise<MarketDataBar[]> {
    try {
      const interval = this.translateTimeframe(timeframe)
      const result = await yahooFinance.historical(symbol, {
        period1: new Date(start),
        period2: new Date(end),
        interval
      })

      return result.map(bar => ({
        t: bar.date.toISOString(),
        o: bar.open,
        h: bar.high,
        l: bar.low,
        c: bar.close,
        v: bar.volume
      }))
    } catch (error) {
      console.error('Yahoo Finance API error:', error)
      throw error
    }
  }

  private translateTimeframe(timeframe: string): string {
    switch (timeframe) {
      case '1m': return '1m'
      case '5m': return '5m'
      case '15m': return '15m'
      case '1h': return '1h'
      case '1D': return '1d'
      default: return '1d'
    }
  }
}
