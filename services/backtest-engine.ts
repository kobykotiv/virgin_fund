import { MarketDataService } from './market-data'
import { TradingBot, BacktestResult, Trade } from '@/types/bot'
import { MarketDataBar } from '@/types/market'

export class BacktestEngine {
  private marketDataService: MarketDataService
  
  constructor(apiKey: string, secretKey: string, isPaper: boolean = true) {
    this.marketDataService = new MarketDataService(apiKey, secretKey, isPaper)
  }
  
  async runBacktest(bot: TradingBot, startDate: string, endDate: string): Promise<BacktestResult> {
    try {
      // Initialize backtest state
      const initialCapital = 10000 // Default starting capital for backtest
      let cash = initialCapital
      let positions: Record<string, { shares: number, entryPrice: number }> = {}
      const trades: Trade[] = []
      const equityCurve: { date: string, value: number }[] = []
      
      // Fetch historical data for all assets
      const historicalDataByAsset: Record<string, MarketDataBar[]> = {}
      
      for (const symbol of bot.assets) {
        const data = await this.marketDataService.getHistoricalBars(
          symbol,
          '1D', // Daily timeframe for backtesting
          startDate,
          endDate
        )
        historicalDataByAsset[symbol] = data
      }
      
      // Get the longest data series for iteration
      const maxDataLength = Math.max(...Object.values(historicalDataByAsset).map(data => data.length))
      let mainSymbol = bot.assets[0]
      
      // Execute strategy for each day in the backtest period
      for (let i = 0; i < maxDataLength; i++) {
        const currentDate = historicalDataByAsset[mainSymbol][i]?.t
        if (!currentDate) continue
        
        // Create a snapshot of market data for this day
        const snapshot: Record<string, MarketDataBar> = {}
        for (const symbol of bot.assets) {
          if (historicalDataByAsset[symbol][i]) {
            snapshot[symbol] = historicalDataByAsset[symbol][i]
          }
        }
        
        // Apply trading strategy to generate signals
        const signals = this.generateSignals(bot, snapshot, i, historicalDataByAsset)
        
        // Execute trades based on signals
        for (const signal of signals) {
          const { symbol, action, price, shares } = signal
          
          if (action === 'buy') {
            const cost = price * shares
            if (cash >= cost) {
              // Execute buy
              cash -= cost
              
              if (positions[symbol]) {
                // Average down/up existing position
                const totalShares = positions[symbol].shares + shares
                const totalCost = (positions[symbol].shares * positions[symbol].entryPrice) + cost
                positions[symbol] = {
                  shares: totalShares,
                  entryPrice: totalCost / totalShares
                }
              } else {
                // New position
                positions[symbol] = {
                  shares,
                  entryPrice: price
                }
              }
              
              // Record trade
              trades.push({
                date: currentDate,
                symbol,
                action: 'buy',
                price,
                shares,
                value: cost
              })
            }
          } else if (action === 'sell') {
            if (positions[symbol] && positions[symbol].shares >= shares) {
              // Execute sell
              const revenue = price * shares
              cash += revenue
              
              // Update position
              positions[symbol].shares -= shares
              if (positions[symbol].shares === 0) {
                delete positions[symbol]
              }
              
              // Record trade
              trades.push({
                date: currentDate,
                symbol,
                action: 'sell',
                price,
                shares,
                value: revenue
              })
            }
          }
        }
        
        // Calculate portfolio value for this day
        let portfolioValue = cash
        for (const [symbol, position] of Object.entries(positions)) {
          if (snapshot[symbol]) {
            portfolioValue += position.shares * snapshot[symbol].c
          }
        }
        
        // Record equity curve
        equityCurve.push({
          date: currentDate,
          value: portfolioValue
        })
      }
      
      // Calculate final portfolio value
      const finalPortfolioValue = equityCurve[equityCurve.length - 1]?.value || initialCapital
      
      // Calculate performance metrics
      const roi = (finalPortfolioValue - initialCapital) / initialCapital * 100
      const winningTrades = trades.filter(t => 
        t.action === 'sell' && t.price > (positions[t.symbol]?.entryPrice || 0)
      ).length
      const winRate = trades.length > 0 ? winningTrades / trades.length * 100 : 0
      
      // Calculate max drawdown
      let maxDrawdown = 0
      let peak = equityCurve[0]?.value || initialCapital
      
      for (const point of equityCurve) {
        if (point.value > peak) {
          peak = point.value
        }
        
        const drawdown = (peak - point.value) / peak * 100
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown
        }
      }
      
      return {
        initialCapital,
        finalCapital: finalPortfolioValue,
        roi,
        trades,
        equityCurve,
        winRate,
        maxDrawdown
      }
    } catch (error) {
      console.error('Error running backtest:', error)
      throw error
    }
  }
  
  private generateSignals(
    bot: TradingBot, 
    snapshot: Record<string, MarketDataBar>, 
    currentIndex: number,
    historicalData: Record<string, MarketDataBar[]>
  ) {
    const signals: {
      symbol: string;
      action: 'buy' | 'sell';
      price: number;
      shares: number;
    }[] = []
    
    // Generate signals based on the bot's strategy
    switch (bot.strategy) {
      case 'meanReversion':
        // Implementation for mean reversion backtest
        for (const symbol of bot.assets) {
          if (!snapshot[symbol]) continue
          
          // Calculate historical mean
          const lookback = bot.parameters.period || 14
          const startIdx = Math.max(0, currentIndex - lookback)
          const priceHistory = historicalData[symbol]
            .slice(startIdx, currentIndex + 1)
            .map(bar => (bar.h + bar.l) / 2)
          
          const mean = priceHistory.reduce((sum, price) => sum + price, 0) / priceHistory.length
          const currentPrice = snapshot[symbol].c
          const deviation = (currentPrice - mean) / mean * 100
          
          if (deviation < -(bot.parameters.threshold || 2)) {
            // Price is below threshold, buy signal
            signals.push({
              symbol,
              action: 'buy',
              price: currentPrice,
              shares: Math.floor((bot.parameters.positionSize || 1000) / currentPrice)
            })
          } else if (deviation > (bot.parameters.threshold || 2)) {
            // Price is above threshold, sell signal
            signals.push({
              symbol,
              action: 'sell',
              price: currentPrice,
              shares: Math.floor((bot.parameters.positionSize || 1000) / currentPrice)
            })
          }
        }
        break
        
      // Additional strategy implementations would go here
        
      default:
        // No signals for unknown strategies
        break
    }
    
    return signals
  }
}
