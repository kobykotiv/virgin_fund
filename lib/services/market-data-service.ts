import { MarketDataModel, AssetModel, IMarketData } from '../auth/models'
import { Model } from 'mongoose'

export class MarketDataService {
  private static instance: MarketDataService
  private updateInterval: NodeJS.Timeout | null = null
  private alpacaClient: any // Replace with actual Alpaca client type

  private constructor() {}

  static getInstance(): MarketDataService {
    if (!this.instance) {
      this.instance = new MarketDataService()
    }
    return this.instance
  }

  async startUpdates(intervalMs: number = 60000) {
    if (this.updateInterval) return
    await this.updateAllMarketData()
    this.updateInterval = setInterval(() => this.updateAllMarketData(), intervalMs)
  }

  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  async updateAllMarketData() {
    try {
      const assets = await AssetModel.find({ active: true })
      const updates = await Promise.all(
        assets.map(async (asset) => {
          const data = await this.fetchMarketData(asset.symbol)
          return MarketDataModel.create({
            symbol: asset.symbol,
            timestamp: new Date(),
            price: data.price,
            volume: data.volume,
            change: data.change,
            changePercent: data.changePercent
          })
        })
      )
      return updates
    } catch (error) {
      console.error('Failed to update market data:', error)
      throw error
    }
  }

  private async fetchMarketData(symbol: string) {
    // Implement actual market data fetching logic
    return {
      price: 0,
      volume: 0,
      changePercent: 0
    }
  }

  async getHistoricalData(symbol: string, timeframe: string, limit: number) {
    const data = await MarketDataModel.findLatestBars(
      symbol,
      timeframe,
      limit
    )
    if (data) return data

    // If no cached data, fetch from Alpaca
    // const end = new Date()
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)

    return await MarketDataModel.fetchFromAlpaca(symbol, timeframe, start, end)
  }
}
