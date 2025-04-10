import type { BacktestOptions, BacktestResult, IndicatorConfig } from "@/lib/backtesting/types"
import { calculateIndicators } from "@/lib/indicators"
import { MarketDataService } from './market-data'
import type { Bot, BotType } from '@/types/bot'

export interface BacktestResult {
  id?: string
  botName: string
  botType: BotType
  startDate: string
  endDate: string
  initialCapital: number
  finalCapital: number
  totalPnL: number
  pnlPercentage: number
  maxDrawdown: number
  sharpeRatio: number
  trades: Trade[]
  equityCurve: EquityPoint[]
  statistics: TradeStatistics
  assetPerformance: AssetPerformance[]
  monthlyReturns: MonthlyReturn[]
  drawdowns: Drawdown[]
  optimizationResults?: OptimizationResult[]
}

interface Trade {
  timestamp: string
  symbol: string
  type: 'buy' | 'sell'
  price: number
  quantity: number
  value: number
  fees?: number
  slippage?: number
}

interface EquityPoint {
  timestamp: string
  equity: number
}

interface TradeStatistics {
  totalTrades: number
  winRate: number
  profitFactor: number
  expectancy: number
  averageWin: number
  averageLoss: number
  largestWin: number
  largestLoss: number
  maxConsecutiveWins: number
  maxConsecutiveLosses: number
  averageHoldingPeriod: number
  averageDailyReturn: number
  sortinoRatio: number
  calmarRatio: number
  annualizedReturn: number
}

interface AssetPerformance {
  symbol: string
  performance: number
}

interface MonthlyReturn {
  month: string
  return: number
}

interface Drawdown {
  start: string
  end: string
  depth: number
  duration: number
}

interface OptimizationResult {
  parameter: string
  value: number
  performance: number
}

export class BacktestService {
  private marketData: MarketDataService

  constructor(apiKey: string, secretKey: string, isPaper: boolean = true) {
    this.marketData = new MarketDataService(apiKey, secretKey, isPaper)
  }

  async runBacktest(bot: Bot, startDate: string, endDate: string, initialCapital: number = 10000): Promise<BacktestResult> {
    // Get historical data for all bot assets
    const historicalData = await Promise.all(
      bot.assets.map(symbol => 
        this.marketData.getHistoricalData(symbol, '1Day', startDate, endDate)
      )
    )

    // Initialize portfolio and trade tracking
    let portfolio = {
      cash: initialCapital,
      positions: new Map<string, { quantity: number, averagePrice: number }>(),
      equity: initialCapital,
      trades: [] as Trade[],
      equityCurve: [{ timestamp: startDate, equity: initialCapital }] as EquityPoint[]
    }

    // Execute strategy based on bot type
    switch (bot.type) {
      case 'grid':
        portfolio = await this.executeGridStrategy(bot, historicalData, portfolio)
        break
      case 'dca':
        portfolio = await this.executeDCAStrategy(bot, historicalData, portfolio)
        break
      case 'basket':
        portfolio = await this.executeBasketStrategy(bot, historicalData, portfolio)
        break
      case 'indicator':
        portfolio = await this.executeIndicatorStrategy(bot, historicalData, portfolio)
        break
    }

    // Calculate performance metrics
    const statistics = this.calculateStatistics(portfolio.trades, portfolio.equityCurve)
    const assetPerformance = this.calculateAssetPerformance(portfolio.trades, historicalData)
    const monthlyReturns = this.calculateMonthlyReturns(portfolio.equityCurve)
    const drawdowns = this.calculateDrawdowns(portfolio.equityCurve)
    const { maxDrawdown, sharpeRatio } = this.calculateRiskMetrics(portfolio.equityCurve)

    return {
      botName: bot.name,
      botType: bot.type,
      startDate,
      endDate,
      initialCapital,
      finalCapital: portfolio.equity,
      totalPnL: portfolio.equity - initialCapital,
      pnlPercentage: ((portfolio.equity - initialCapital) / initialCapital) * 100,
      maxDrawdown,
      sharpeRatio,
      trades: portfolio.trades,
      equityCurve: portfolio.equityCurve,
      statistics,
      assetPerformance,
      monthlyReturns,
      drawdowns
    }
  }

  private async executeGridStrategy(bot: Bot, historicalData: any[], portfolio: any) {
    const { gridSize = 1, upperLimit, lowerLimit, quantity } = bot.gridConfig || {}
    
    // Process each asset's historical data
    for (let i = 0; i < bot.assets.length; i++) {
      const symbol = bot.assets[i]
      const data = historicalData[i]

      // Calculate grid levels
      const levels = []
      const gridCount = Math.floor((upperLimit - lowerLimit) / gridSize)
      for (let j = 0; j <= gridCount; j++) {
        levels.push(lowerLimit + (j * gridSize))
      }

      // Process each historical data point
      for (let j = 1; j < data.length; j++) {
        const currentPrice = data[j].close
        const timestamp = data[j].timestamp

        // Check each grid level for potential trades
        levels.forEach(level => {
          const previousPrice = data[j-1].close
          
          // Buy signal: price crosses below a grid level
          if (previousPrice >= level && currentPrice < level) {
            if (portfolio.cash >= quantity * currentPrice) {
              // Execute buy
              const position = portfolio.positions.get(symbol) || { quantity: 0, averagePrice: 0 }
              const newQuantity = position.quantity + quantity
              const newAveragePrice = ((position.quantity * position.averagePrice) + (quantity * currentPrice)) / newQuantity
              
              portfolio.positions.set(symbol, {
                quantity: newQuantity,
                averagePrice: newAveragePrice
              })
              
              portfolio.cash -= quantity * currentPrice
              
              portfolio.trades.push({
                timestamp,
                symbol,
                type: 'buy',
                price: currentPrice,
                quantity,
                value: quantity * currentPrice
              })
            }
          }
          
          // Sell signal: price crosses above a grid level
          else if (previousPrice <= level && currentPrice > level) {
            const position = portfolio.positions.get(symbol)
            if (position && position.quantity >= quantity) {
              // Execute sell
              const newQuantity = position.quantity - quantity
              portfolio.positions.set(symbol, {
                quantity: newQuantity,
                averagePrice: position.averagePrice
              })
              
              portfolio.cash += quantity * currentPrice
              
              portfolio.trades.push({
                timestamp,
                symbol,
                type: 'sell',
                price: currentPrice,
                quantity,
                value: quantity * currentPrice
              })
            }
          }
        })

        // Update equity curve
        const totalEquity = portfolio.cash + 
          Array.from(portfolio.positions.entries()).reduce((sum, [sym, pos]) => {
            const price = sym === symbol ? currentPrice : historicalData[bot.assets.indexOf(sym)][j].close
            return sum + (pos.quantity * price)
          }, 0)

        portfolio.equity = totalEquity
        portfolio.equityCurve.push({
          timestamp,
          equity: totalEquity
        })
      }
    }

    return portfolio
  }

  private async executeDCAStrategy(bot: Bot, historicalData: any[], portfolio: any) {
    const { interval, amount } = bot.dcaConfig || {}
    // Implement dollar-cost averaging strategy
    // ...
    return portfolio
  }

  private async executeBasketStrategy(bot: Bot, historicalData: any[], portfolio: any) {
    const { rebalancePeriod, targetAllocation } = bot.basketConfig || {}
    // Implement basket trading strategy
    // ...
    return portfolio
  }

  private async executeIndicatorStrategy(bot: Bot, historicalData: any[], portfolio: any) {
    const { indicator, parameters } = bot.indicatorConfig || {}
    // Implement indicator-based strategy
    // ...
    return portfolio
  }

  private calculateStatistics(trades: Trade[], equityCurve: EquityPoint[]): TradeStatistics {
    // Calculate basic metrics
    const winningTrades = trades.filter(t => {
      if (t.type === 'buy') return false
      const buyTrade = trades.find(bt => 
        bt.type === 'buy' && 
        bt.symbol === t.symbol && 
        new Date(bt.timestamp) < new Date(t.timestamp)
      )
      return buyTrade && (t.price - buyTrade.price) > 0
    })

    const winRate = winningTrades.length / (trades.length / 2) // Divide by 2 since we count pairs
    
    // Calculate profit factor and other metrics
    let totalProfit = 0
    let totalLoss = 0
    let largestWin = 0
    let largestLoss = 0
    let consecutiveWins = 0
    let consecutiveLosses = 0
    let maxConsecutiveWins = 0
    let maxConsecutiveLosses = 0
    let totalHoldingPeriod = 0

    for (let i = 0; i < trades.length; i++) {
      const trade = trades[i]
      if (trade.type === 'sell') {
        const buyTrade = trades.find(t => 
          t.type === 'buy' && 
          t.symbol === trade.symbol && 
          new Date(t.timestamp) < new Date(trade.timestamp)
        )

        if (buyTrade) {
          const profit = (trade.price - buyTrade.price) * trade.quantity
          if (profit > 0) {
            totalProfit += profit
            largestWin = Math.max(largestWin, profit)
            consecutiveWins++
            consecutiveLosses = 0
          } else {
            totalLoss += Math.abs(profit)
            largestLoss = Math.max(largestLoss, Math.abs(profit))
            consecutiveLosses++
            consecutiveWins = 0
          }

          maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins)
          maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses)

          // Calculate holding period
          const holdingPeriod = (new Date(trade.timestamp).getTime() - new Date(buyTrade.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          totalHoldingPeriod += holdingPeriod
        }
      }
    }

    const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss
    const averageWin = winningTrades.length === 0 ? 0 : totalProfit / winningTrades.length
    const averageLoss = (trades.length / 2 - winningTrades.length) === 0 ? 0 : totalLoss / (trades.length / 2 - winningTrades.length)
    const expectancy = (winRate * averageWin) - ((1 - winRate) * averageLoss)
    const averageHoldingPeriod = totalHoldingPeriod / (trades.length / 2)

    // Calculate daily returns and related metrics
    const dailyReturns = []
    for (let i = 1; i < equityCurve.length; i++) {
      const dailyReturn = (equityCurve[i].equity - equityCurve[i-1].equity) / equityCurve[i-1].equity
      dailyReturns.push(dailyReturn)
    }

    const averageDailyReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length
    const annualizedReturn = Math.pow(1 + averageDailyReturn, 252) - 1

    // Calculate Sortino ratio using downside deviation
    const downsideReturns = dailyReturns.filter(r => r < 0)
    const downsideDeviation = Math.sqrt(
      downsideReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / downsideReturns.length
    )
    const sortinoRatio = downsideDeviation === 0 ? 0 : (averageDailyReturn - 0.02/252) / downsideDeviation * Math.sqrt(252)

    // Calculate Calmar ratio using max drawdown
    const calmarRatio = maxConsecutiveLosses === 0 ? 0 : annualizedReturn / maxConsecutiveLosses

    return {
      totalTrades: trades.length,
      winRate,
      profitFactor,
      expectancy,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      maxConsecutiveWins,
      maxConsecutiveLosses,
      averageHoldingPeriod,
      averageDailyReturn,
      sortinoRatio,
      calmarRatio,
      annualizedReturn
    }
  }

  private calculateAssetPerformance(trades: Trade[], historicalData: any[]): AssetPerformance[] {
    const assetPerformance = new Map<string, {
      totalPnL: number,
      initialValue: number,
      finalValue: number
    }>()

    // Initialize asset performance tracking
    trades.forEach(trade => {
      if (!assetPerformance.has(trade.symbol)) {
        const assetData = historicalData.find(d => d[0].symbol === trade.symbol)
        if (assetData) {
          assetPerformance.set(trade.symbol, {
            totalPnL: 0,
            initialValue: assetData[0].close,
            finalValue: assetData[assetData.length - 1].close
          })
        }
      }
    })

    // Calculate P&L for each trade
    trades.forEach(trade => {
      const assetMetrics = assetPerformance.get(trade.symbol)
      if (assetMetrics) {
        if (trade.type === 'buy') {
          assetMetrics.totalPnL -= trade.value
        } else {
          assetMetrics.totalPnL += trade.value
        }
      }
    })

    // Convert to percentage returns
    return Array.from(assetPerformance.entries()).map(([symbol, metrics]) => ({
      symbol,
      performance: ((metrics.finalValue - metrics.initialValue) / metrics.initialValue) * 100
    }))
  }

  private calculateMonthlyReturns(equityCurve: EquityPoint[]): MonthlyReturn[] {
    const monthlyData = new Map<string, {
      startEquity: number,
      endEquity: number
    }>()

    // Group equity points by month
    equityCurve.forEach(point => {
      const date = new Date(point.timestamp)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          startEquity: point.equity,
          endEquity: point.equity
        })
      } else {
        monthlyData.get(monthKey)!.endEquity = point.equity
      }
    })

    // Calculate monthly returns
    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        return: ((data.endEquity - data.startEquity) / data.startEquity) * 100
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  private calculateDrawdowns(equityCurve: EquityPoint[]): Drawdown[] {
    const drawdowns: Drawdown[] = []
    let peak = equityCurve[0].equity
    let currentDrawdown: Partial<Drawdown> | null = null

    equityCurve.forEach(point => {
      if (point.equity > peak) {
        peak = point.equity
        if (currentDrawdown) {
          // End current drawdown if we reach a new peak
          currentDrawdown.end = point.timestamp
          currentDrawdown.duration = Math.round(
            (new Date(point.timestamp).getTime() - new Date(currentDrawdown.start!).getTime()) / 
            (1000 * 60 * 60 * 24)
          )
          drawdowns.push(currentDrawdown as Drawdown)
          currentDrawdown = null
        }
      } else {
        const drawdown = (peak - point.equity) / peak * 100
        if (!currentDrawdown && drawdown > 1) { // Only track drawdowns > 1%
          currentDrawdown = {
            start: point.timestamp,
            depth: drawdown
          }
        } else if (currentDrawdown && drawdown > currentDrawdown.depth!) {
          currentDrawdown.depth = drawdown
        }
      }
    })

    // Add final drawdown if still ongoing
    if (currentDrawdown) {
      currentDrawdown.end = equityCurve[equityCurve.length - 1].timestamp
      currentDrawdown.duration = Math.round(
        (new Date(currentDrawdown.end).getTime() - new Date(currentDrawdown.start!).getTime()) / 
        (1000 * 60 * 60 * 24)
      )
      drawdowns.push(currentDrawdown as Drawdown)
    }

    // Sort by depth in descending order
    return drawdowns.sort((a, b) => b.depth - a.depth)
  }

  private calculateRiskMetrics(equityCurve: EquityPoint[]) {
    // Calculate maximum drawdown
    let maxDrawdown = 0
    let peak = equityCurve[0].equity

    for (const point of equityCurve) {
      if (point.equity > peak) {
        peak = point.equity
      }
      const drawdown = (peak - point.equity) / peak * 100
      maxDrawdown = Math.max(maxDrawdown, drawdown)
    }

    // Calculate Sharpe ratio
    const returns = []
    for (let i = 1; i < equityCurve.length; i++) {
      const dailyReturn = (equityCurve[i].equity - equityCurve[i-1].equity) / equityCurve[i-1].equity
      returns.push(dailyReturn)
    }

    const averageReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - averageReturn, 2), 0) / returns.length
    )
    const riskFreeRate = 0.02 / 252 // Assuming 2% annual risk-free rate
    const sharpeRatio = stdDev === 0 ? 0 : (averageReturn - riskFreeRate) / stdDev * Math.sqrt(252)

    return {
      maxDrawdown,
      sharpeRatio
    }
  }

  async optimizeStrategy(
    bot: Bot,
    startDate: string,
    endDate: string,
    parameterToOptimize: string,
    rangeStart: number,
    rangeEnd: number,
    steps: number
  ): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = []
    const stepSize = (rangeEnd - rangeStart) / steps

    for (let i = 0; i <= steps; i++) {
      const paramValue = rangeStart + (i * stepSize)
      const botCopy = JSON.parse(JSON.stringify(bot))

      // Update the parameter being optimized
      if (parameterToOptimize.startsWith('indicator.')) {
        const param = parameterToOptimize.split('.')[1]
        if (botCopy.indicatorConfig) {
          botCopy.indicatorConfig[param] = paramValue
        }
      } else if (parameterToOptimize.startsWith('grid.')) {
        const param = parameterToOptimize.split('.')[1]
        if (botCopy.gridConfig) {
          botCopy.gridConfig[param] = paramValue
        }
      } else if (parameterToOptimize === 'stopLoss') {
        botCopy.stopLoss = paramValue
      } else if (parameterToOptimize === 'takeProfit') {
        botCopy.takeProfit = paramValue
      }

      const result = await this.runBacktest(botCopy, startDate, endDate)
      results.push({
        parameter: parameterToOptimize,
        value: paramValue,
        performance: result.sharpeRatio // Using Sharpe ratio as the optimization metric
      })
    }

    // Sort results by performance
    return results.sort((a, b) => b.performance - a.performance)
  }
}
