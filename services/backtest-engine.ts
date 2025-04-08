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
    try {
      const signals = []
      
      switch (bot.strategy) {
        case 'meanReversion':
          signals.push(...this.generateMeanReversionSignals(bot, snapshot, currentIndex, historicalData))
          break
          
        case 'trendFollowing':
          signals.push(...this.generateTrendFollowingSignals(bot, snapshot, currentIndex, historicalData))
          break
          
        case 'breakout':
          signals.push(...this.generateBreakoutSignals(bot, snapshot, currentIndex, historicalData))
          break
          
        case 'rsi':
          signals.push(...this.generateRSISignals(bot, snapshot, currentIndex, historicalData))
          break
          
        default:
          throw new Error(`Unsupported strategy type: ${bot.strategy}`)
      }
      
      // Apply position sizing and risk management
      return this.applyRiskManagement(signals, bot, snapshot)
      
    } catch (error) {
      console.error('Error generating signals:', error)
      return []
    }
  }

  private applyRiskManagement(
    signals: any[],
    bot: TradingBot,
    snapshot: Record<string, MarketDataBar>
  ) {
    return signals.map(signal => {
      // Calculate position size based on risk per trade
      const riskPerTrade = bot.parameters.riskPerTrade || 0.01 // 1% default risk
      const accountValue = this.getAccountValue()
      const riskAmount = accountValue * riskPerTrade
      
      // Calculate stop loss distance
      const stopLoss = this.calculateStopLoss(signal, bot, snapshot)
      
      // Calculate position size based on risk
      const positionSize = Math.floor(riskAmount / (signal.price - stopLoss))
      
      return {
        ...signal,
        shares: positionSize,
        stopLoss,
        takeProfit: this.calculateTakeProfit(signal, stopLoss, bot)
      }
    })
  }

  private calculateStopLoss(signal: any, bot: TradingBot, snapshot: MarketDataBar) {
    const atr = this.calculateATR(snapshot, bot.parameters.atrPeriod || 14)
    const stopMultiplier = bot.parameters.stopMultiplier || 2
    
    return signal.action === 'buy'
      ? signal.price - (atr * stopMultiplier)
      : signal.price + (atr * stopMultiplier)
  }

  private calculateTakeProfit(signal: any, stopLoss: number, bot: TradingBot) {
    const riskRewardRatio = bot.parameters.riskRewardRatio || 2
    const risk = Math.abs(signal.price - stopLoss)
    
    return signal.action === 'buy'
      ? signal.price + (risk * riskRewardRatio)
      : signal.price - (risk * riskRewardRatio)
  }

  private calculateATR(data: MarketDataBar[], period: number): number {
    // Implement ATR calculation
    // ...
    return 0
  }

  // Strategy implementations
  private generateTrendFollowingSignals(
    bot: TradingBot,
    snapshot: Record<string, MarketDataBar>,
    currentIndex: number,
    historicalData: Record<string, MarketDataBar[]>
  ) {
    const signals = []
    
    for (const symbol of bot.assets) {
      if (!snapshot[symbol]) continue
      
      const ema20 = this.calculateEMA(historicalData[symbol], 20, currentIndex)
      const ema50 = this.calculateEMA(historicalData[symbol], 50, currentIndex)
      
      if (ema20 > ema50) {
        signals.push({
          symbol,
          action: 'buy',
          price: snapshot[symbol].c
        })
      } else if (ema20 < ema50) {
        signals.push({
          symbol,
          action: 'sell',
          price: snapshot[symbol].c
        })
      }
    }
    
    return signals
  }

  private generateBreakoutSignals(
    bot: TradingBot,
    snapshot: Record<string, MarketDataBar>,
    currentIndex: number,
    historicalData: Record<string, MarketDataBar[]>
  ) {
    const signals = []
    const period = bot.parameters.breakoutPeriod || 20
    
    for (const symbol of bot.assets) {
      if (!snapshot[symbol]) continue
      
      const highs = historicalData[symbol]
        .slice(currentIndex - period, currentIndex)
        .map(bar => bar.h)
      
      const lows = historicalData[symbol]
        .slice(currentIndex - period, currentIndex)
        .map(bar => bar.l)
      
      const resistance = Math.max(...highs)
      const support = Math.min(...lows)
      const currentPrice = snapshot[symbol].c
      
      if (currentPrice > resistance) {
        signals.push({
          symbol,
          action: 'buy',
          price: currentPrice
        })
      } else if (currentPrice < support) {
        signals.push({
          symbol,
          action: 'sell',
          price: currentPrice
        })
      }
    }
    
    return signals
  }

  private calculateEMA(data: MarketDataBar[], period: number, currentIndex: number): number {
    // Implement EMA calculation
    // ...
    return 0
  }
}
