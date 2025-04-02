import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"
import { getBotsCollection, getMarketDataCollection } from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

interface BacktestResult {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnL: number
  profitFactor: number
  sharpeRatio: number
  maxDrawdown: number
  trades: Array<{
    timestamp: Date
    type: string
    price: number
    size: number
    pnl: number
    cumulative: number
  }>
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { config, startDate, endDate, initialCapital = 10000 } = data

    if (!config || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    // Get historical market data
    const marketDataCollection = await getMarketDataCollection()
    const historicalData = await marketDataCollection
      .find({
        symbol: { $in: config.assets },
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
      .sort({ timestamp: 1 })
      .toArray()

    if (historicalData.length === 0) {
      return NextResponse.json(
        { error: "No historical data available for selected period" },
        { status: 400 }
      )
    }

    // Run backtest simulation
    const results = await simulateStrategy(
      config,
      historicalData,
      initialCapital
    )

    // Calculate additional performance metrics
    const metrics = calculatePerformanceMetrics(results)

    return NextResponse.json({
      success: true,
      results: {
        ...results,
        metrics
      }
    })
  } catch (error) {
    console.error("Error running backtest:", error)
    return NextResponse.json(
      { error: "Failed to run backtest" },
      { status: 500 }
    )
  }
}

async function simulateStrategy(
  config: any,
  historicalData: any[],
  initialCapital: number
): Promise<BacktestResult> {
  let capital = initialCapital
  let position = 0
  let entryPrice = 0
  const trades = []
  let totalPnL = 0
  let winningTrades = 0
  let losingTrades = 0
  let maxDrawdown = 0
  let highWaterMark = initialCapital

  // Group data by timestamp for multi-asset strategies
  const dataByTimestamp = historicalData.reduce((acc, data) => {
    const timestamp = data.timestamp.toISOString()
    if (!acc[timestamp]) acc[timestamp] = {}
    acc[timestamp][data.symbol] = data
    return acc
  }, {})

  // Process each timestamp
  for (const timestamp of Object.keys(dataByTimestamp)) {
    const marketData = dataByTimestamp[timestamp]
    
    // Evaluate signals
    const activeSignals = evaluateSignals(config.signals, marketData)
    
    // Check conditions
    const conditions = evaluateConditions(
      config.conditions,
      activeSignals,
      marketData
    )

    // Execute actions if conditions are met
    if (conditions.length > 0) {
      for (const action of config.actions) {
        const result = executeAction(
          action,
          position,
          capital,
          marketData,
          config.config.riskManagement
        )

        if (result.trade) {
          position = result.newPosition
          const pnl = result.pnl

          trades.push({
            timestamp: new Date(timestamp),
            type: result.trade.type,
            price: result.trade.price,
            size: result.trade.size,
            pnl,
            cumulative: totalPnL + pnl
          })

          // Update metrics
          totalPnL += pnl
          if (pnl > 0) winningTrades++
          else if (pnl < 0) losingTrades++

          // Update drawdown
          const currentValue = capital + totalPnL
          if (currentValue > highWaterMark) {
            highWaterMark = currentValue
          } else {
            const drawdown = (highWaterMark - currentValue) / highWaterMark
            maxDrawdown = Math.max(maxDrawdown, drawdown)
          }
        }
      }
    }
  }

  const totalTrades = winningTrades + losingTrades
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    totalPnL,
    profitFactor: calculateProfitFactor(trades),
    sharpeRatio: calculateSharpeRatio(trades),
    maxDrawdown,
    trades
  }
}

function evaluateSignals(signals: any[], marketData: any) {
  return signals.map(signal => {
    switch (signal.type) {
      case "PRICE":
        return evaluatePriceSignal(signal, marketData)
      case "SMA":
        return evaluateSMASignal(signal, marketData)
      case "RSI":
        return evaluateRSISignal(signal, marketData)
      // Add more signal types as needed
      default:
        return null
    }
  }).filter(Boolean)
}

function evaluateConditions(
  conditions: any[],
  signals: any[],
  marketData: any
) {
  return conditions.filter(condition => {
    const signal = signals[condition.signal]
    if (!signal) return false

    switch (condition.operator) {
      case "crosses_above":
        return signal.current > condition.comparison.value &&
               signal.previous <= condition.comparison.value
      case "crosses_below":
        return signal.current < condition.comparison.value &&
               signal.previous >= condition.comparison.value
      case "greater_than":
        return signal.current > condition.comparison.value
      case "less_than":
        return signal.current < condition.comparison.value
      case "equals":
        return Math.abs(signal.current - condition.comparison.value) < 0.0001
      default:
        return false
    }
  })
}

function executeAction(
  action: any,
  currentPosition: number,
  capital: number,
  marketData: any,
  riskManagement: any
) {
  const result = {
    trade: null,
    newPosition: currentPosition,
    pnl: 0
  }

  const price = marketData[action.params.symbol]?.price
  if (!price) return result

  switch (action.type) {
    case "MARKET_BUY":
      if (action.params.unit === "percentage") {
        const size = (capital * action.params.amount) / 100
        result.newPosition = currentPosition + size
        result.trade = { type: "buy", price, size }
      }
      break
    case "MARKET_SELL":
      if (currentPosition > 0) {
        const size = action.params.unit === "percentage"
          ? currentPosition * (action.params.amount / 100)
          : Math.min(action.params.amount, currentPosition)
        result.newPosition = currentPosition - size
        result.pnl = size * (price - marketData[action.params.symbol].open)
        result.trade = { type: "sell", price, size }
      }
      break
  }

  return result
}

function calculatePerformanceMetrics(results: BacktestResult) {
  return {
    annualizedReturn: calculateAnnualizedReturn(results),
    volatility: calculateVolatility(results.trades),
    sortinoRatio: calculateSortinoRatio(results.trades),
    calmarRatio: calculateCalmarRatio(
      results.totalPnL,
      results.maxDrawdown,
      results.trades
    )
  }
}

// Helper functions for calculating various metrics
function calculateProfitFactor(trades: any[]): number {
  const profits = trades.reduce((sum, trade) => 
    trade.pnl > 0 ? sum + trade.pnl : sum, 0
  )
  const losses = Math.abs(trades.reduce((sum, trade) => 
    trade.pnl < 0 ? sum + trade.pnl : sum, 0
  ))
  return losses === 0 ? profits : profits / losses
}

function calculateSharpeRatio(trades: any[]): number {
  const returns = trades.map(t => t.pnl)
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const stdDev = Math.sqrt(
    returns.reduce((sq, r) => sq + Math.pow(r - avgReturn, 2), 0) / returns.length
  )
  return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252)
}

function calculateAnnualizedReturn(results: BacktestResult): number {
  const firstTrade = results.trades[0]
  const lastTrade = results.trades[results.trades.length - 1]
  const years = (lastTrade.timestamp.getTime() - firstTrade.timestamp.getTime()) / 
                (1000 * 60 * 60 * 24 * 365)
  return years === 0 ? 0 : Math.pow(1 + results.totalPnL, 1 / years) - 1
}

function calculateVolatility(trades: any[]): number {
  const returns = trades.map(t => t.pnl)
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  return Math.sqrt(
    returns.reduce((sq, r) => sq + Math.pow(r - avgReturn, 2), 0) / returns.length
  ) * Math.sqrt(252)
}

function calculateSortinoRatio(trades: any[]): number {
  const returns = trades.map(t => t.pnl)
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const negativeReturns = returns.filter(r => r < 0)
  const downside = Math.sqrt(
    negativeReturns.reduce((sq, r) => sq + Math.pow(r - avgReturn, 2), 0) / 
    negativeReturns.length
  )
  return downside === 0 ? 0 : (avgReturn / downside) * Math.sqrt(252)
}

function calculateCalmarRatio(
  totalReturn: number,
  maxDrawdown: number,
  trades: any[]
): number {
  const years = (
    trades[trades.length - 1].timestamp.getTime() - 
    trades[0].timestamp.getTime()
  ) / (1000 * 60 * 60 * 24 * 365)
  const annualizedReturn = years === 0 ? 0 : (totalReturn / years)
  return maxDrawdown === 0 ? 0 : annualizedReturn / maxDrawdown
}