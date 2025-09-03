import type { BacktestOptions, BacktestResult, IndicatorConfig } from "@/lib/backtesting/types"
import { calculateIndicators } from "@/lib/indicators/index"

export async function runBacktest(options: BacktestOptions): Promise<BacktestResult> {
  // Fetch historical data
  const data = await fetchHistoricalData(options.symbol, options.startDate, options.endDate, options.timeframe)
  
  // Add indicators if specified
  let enrichedData = data
  if (options.indicators?.length) {
    enrichedData = calculateIndicators(data, options.indicators)
  }

  // Run strategy
  const trades = executeStrategy(enrichedData, options.strategy, options.initialCapital)
  
  // Calculate metrics
  const metrics = calculateMetrics(trades, options.initialCapital)
  
  // Generate equity curve
  const equity = generateEquityCurve(trades, options.initialCapital)

  return {
    trades,
    metrics,
    equity
  }
}

async function fetchHistoricalData(symbol: string, startDate: Date, endDate: Date, timeframe: string) {
  // Implementation depends on your data source (Alpaca, Yahoo, etc.)
  return []
}

function executeStrategy(data: any[], strategy: any, initialCapital: number) {
  switch (strategy.type) {
    case 'Grid':
      return executeGridStrategy(data, strategy.params, initialCapital)
    case 'DCA':
      return executeDCAStrategy(data, strategy.params, initialCapital)
    case 'Indicator':
      return executeIndicatorStrategy(data, strategy.params, initialCapital)
    default:
      throw new Error(`Unknown strategy type: ${strategy.type}`)
  }
}

function calculateMetrics(trades: any[], initialCapital: number) {
  // Calculate basic metrics
  const totalReturn = trades.reduce((sum, trade) => sum + trade.pnl, 0)
  const totalReturnPercent = (totalReturn / initialCapital) * 100
  const winRate = trades.filter(t => t.pnl > 0).length / trades.length
  const maxDrawdown = calculateMaxDrawdown(trades)
  const maxDrawdownPercent = maxDrawdown * 100
  const sharpeRatio = calculateSharpeRatio(trades)
  const profitFactor = calculateProfitFactor(trades)
  
  return {
    totalReturn,
    totalReturnPercent,
    maxDrawdown,
    maxDrawdownPercent,
    sharpeRatio,
    winRate,
    profitFactor,
    totalTrades: trades.length
  }
}

function calculateProfitFactor(trades: any[]) {
  const profits = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0)
  const losses = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0))
  return losses === 0 ? profits : profits / losses
}

function generateEquityCurve(trades: any[], initialCapital: number) {
  let equity = initialCapital
  let peak = initialCapital
  const curve = [{ timestamp: new Date(0), equity, drawdown: 0 }]
  
  trades.forEach(trade => {
    equity += trade.pnl
    const drawdown = Math.max(0, (peak - equity) / peak)
    if (equity > peak) peak = equity
    
    curve.push({ 
      timestamp: new Date(trade.timestamp), 
      equity,
      drawdown 
    })
  })
  
  return curve
}

function calculateMaxDrawdown(trades: any[]) {
  let peak = 0
  let maxDrawdown = 0
  
  trades.forEach(trade => {
    if (trade.equity > peak) peak = trade.equity
    const drawdown = (peak - trade.equity) / peak
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  })
  
  return maxDrawdown
}

function calculateSharpeRatio(trades: any[]) {
  if (trades.length === 0) return 0
  
  const returns = trades.map(t => t.profit)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)
  
  return stdDev === 0 ? 0 : avgReturn / stdDev
}

function executeGridStrategy(data: any[], params: any, initialCapital: number) {
  // Simple grid strategy implementation
  const trades = []
  const capital = initialCapital
  
  for (let i = 1; i < data.length; i++) {
    const currentPrice = data[i].close
    const gridSize = params.gridSize || 0.01 // 1% grid
    
    // Buy at lower grid levels
    if (currentPrice < data[i-1].close * (1 - gridSize)) {
      const quantity = capital * 0.1 / currentPrice // Use 10% of capital
      const value = quantity * currentPrice
      
      trades.push({
        timestamp: new Date(data[i].timestamp),
        type: 'buy' as const,
        price: currentPrice,
        quantity,
        value,
        pnl: 0, // Will be calculated later
        pnlPercent: 0
      })
    }
  }
  
  return trades
}

function executeDCAStrategy(data: any[], params: any, initialCapital: number) {
  // Dollar-cost averaging strategy
  const trades = []
  const interval = params.interval || 30 // days
  const capital = initialCapital
  
  for (let i = 0; i < data.length; i += interval) {
    if (i < data.length) {
      const price = data[i].close
      const amount = params.amount || capital / (data.length / interval)
      const quantity = amount / price
      
      trades.push({
        timestamp: new Date(data[i].timestamp),
        type: 'buy' as const,
        price,
        quantity,
        value: amount,
        pnl: 0,
        pnlPercent: 0
      })
    }
  }
  
  return trades
}

function executeIndicatorStrategy(data: any[], params: any, initialCapital: number) {
  // Strategy based on technical indicators
  const trades = []
  
  for (let i = 1; i < data.length; i++) {
    // Simple moving average crossover strategy
    if (data[i].sma_short && data[i].sma_long) {
      if (data[i].sma_short > data[i].sma_long && data[i-1].sma_short <= data[i-1].sma_long) {
        // Buy signal
        const quantity = initialCapital * 0.1 / data[i].close
        trades.push({
          timestamp: new Date(data[i].timestamp),
          type: 'buy' as const,
          price: data[i].close,
          quantity,
          value: quantity * data[i].close,
          pnl: 0,
          pnlPercent: 0
        })
      } else if (data[i].sma_short < data[i].sma_long && data[i-1].sma_short >= data[i-1].sma_long) {
        // Sell signal
        // Implementation would track positions and calculate profits
      }
    }
  }
  
  return trades
}
