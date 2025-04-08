import { MarketDataProvider } from './index'
import { MarketDataBar } from '@/types/market'
import Alpaca from '@alpacahq/alpaca-trade-api'

export class AlpacaProvider implements MarketDataProvider {
  private client: Alpaca
  private ws: any

  constructor(config: { apiKey: string; secretKey: string; paper?: boolean }) {
    this.client = new Alpaca({
      keyId: config.apiKey,
      secretKey: config.secretKey,
      paper: config.paper ?? true
    })
  }

  async getHistoricalData(
    symbol: string,
    timeframe: string,
    start: string,
    end: string
  ): Promise<MarketDataBar[]> {
    try {
      const bars = await this.client.getBarsV2(symbol, {
        start: new Date(start),
        end: new Date(end),
        timeframe: this.translateTimeframe(timeframe)
      })

      return Array.from(bars).map(bar => ({
        t: bar.Timestamp,
        o: bar.OpenPrice,
        h: bar.HighPrice,
        l: bar.LowPrice,
        c: bar.ClosePrice,
        v: bar.Volume
      }))
    } catch (error) {
      console.error('Alpaca API error:', error)
      throw error
    }
  }

  subscribeToRealtime(symbol: string, callback: (data: MarketDataBar) => void) {
    if (!this.ws) {
      this.ws = this.client.crypto
      this.ws.onMessage((message: any) => {
        if (message.T === 't') {
          callback({
            t: message.t,
            o: message.o,
            h: message.h,
            l: message.l,
            c: message.c,
            v: message.v
          })
        }
      })
    }
    this.ws.subscribe([symbol])
  }

  unsubscribe(symbol: string) {
    if (this.ws) {
      this.ws.unsubscribe([symbol])
    }
  }

  private translateTimeframe(timeframe: string): string {
    switch (timeframe) {
      case '1m': return '1Min'
      case '5m': return '5Min'
      case '15m': return '15Min'
      case '1h': return '1Hour'
      case '1D': return '1Day'
      default: return '1Day'
    }
  }
}
