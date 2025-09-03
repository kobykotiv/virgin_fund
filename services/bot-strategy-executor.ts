import { MarketDataService } from './market-data'
import { StrategyType, TradingBot, Order } from '@/types/bot'
import { getNumberParam } from '../src/lib/bot-helpers'

export class BotStrategyExecutor {
  private marketDataService: MarketDataService
  
  constructor(apiKey: string, secretKey: string, isPaper: boolean = true) {
    this.marketDataService = new MarketDataService(apiKey, secretKey, isPaper)
  }
  
  async executeStrategy(bot: TradingBot): Promise<Order | null> {
    try {
      // Fetch the latest market data for the bot's assets
      const latestData = await this.marketDataService.getSnapshot(bot.assets)
      
      // Execute the appropriate strategy based on the bot type
      switch (bot.strategy) {
        case 'meanReversion':
          return this.executeMeanReversionStrategy(bot, latestData)
        case 'trendFollowing':
          return this.executeTrendFollowingStrategy(bot, latestData)
        case 'gridTrading':
          return this.executeGridTradingStrategy(bot, latestData)
        case 'movingAverageCrossover':
          return this.executeMovingAverageCrossoverStrategy(bot, latestData)
        default:
          throw new Error(`Unknown strategy: ${bot.strategy}`)
      }
    } catch (error) {
      console.error(`Error executing strategy for bot ${bot.id}:`, error)
      return null
    }
  }
  
  private async executeMeanReversionStrategy(bot: TradingBot, latestData: any): Promise<Order | null> {
    const symbol = bot.assets[0]
    // Read numeric parameters safely with defaults
    const lookback = getNumberParam(bot, 'period', 14)
    const threshold = getNumberParam(bot, 'threshold', 2)
    const positionSize = getNumberParam(bot, 'positionSize', 1000)
    
    // Get historical data for calculating mean
    const endDate = new Date().toISOString()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - lookback)
    
    const historicalData = await this.marketDataService.getHistoricalBars(
      symbol,
      '1D',
      startDate.toISOString(),
      endDate
    )
    
    // Calculate mean price
    const prices = historicalData.map((bar: { h: number; l: number }) => (bar.h + bar.l) / 2)
    const mean = prices.reduce((sum: number, price: number) => sum + price, 0) / (prices.length || 1)
    
    // Current price
    const currentPrice = latestData[symbol].latestTrade.p
    
    // Calculate deviation percentage
    const deviation = (currentPrice - mean) / mean * 100
    
    // Trading logic
    if (deviation < -threshold) {
      // Price is below threshold, buy
      return this.marketDataService.placeOrder({
        symbol,
        qty: positionSize,
        side: 'buy',
        type: 'market',
        time_in_force: 'day'
      })
    } else if (deviation > threshold) {
      // Price is above threshold, sell
      return this.marketDataService.placeOrder({
        symbol,
        qty: positionSize,
        side: 'sell',
        type: 'market',
        time_in_force: 'day'
      })
    }
    
    return null // No action required
  }
  
  private async executeTrendFollowingStrategy(bot: TradingBot, latestData: any): Promise<Order | null> {
    // Implementation of trend following strategy
    // This would calculate trend indicators and execute trades based on trends
    // For brevity, we'll leave this as a placeholder
    return null
  }
  
  private async executeGridTradingStrategy(bot: TradingBot, latestData: any): Promise<Order | null> {
    // Implementation of grid trading strategy
    // This would place a grid of buy and sell orders at predetermined price levels
    // For brevity, we'll leave this as a placeholder
    return null
  }
  
  private async executeMovingAverageCrossoverStrategy(bot: TradingBot, latestData: any): Promise<Order | null> {
    // Implementation of moving average crossover strategy
    // This would calculate short and long-term moving averages and execute trades on crossovers
    // For brevity, we'll leave this as a placeholder
    return null
  }
}
