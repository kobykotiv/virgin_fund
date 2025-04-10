import type { BotWithPortfolio } from "@/components/dashboard"
import type { Position } from "@/types/portfolio"

export const generateEquityCurveData = (bot: BotWithPortfolio) => {
  // Generate 30 days of equity curve data
  const data = []
  let currentValue = 10000 // Starting value
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Add some random variation but trend according to bot's performance
    const trend = (bot.performance?.pnlPercentage || 0) / 30
    const randomVariation = (Math.random() - 0.5) * 200
    currentValue = currentValue * (1 + trend) + randomVariation

    data.push({
      date: date.toISOString().split('T')[0],
      value: currentValue
    })
  }

  return data
}

export const generateRollingReturnsData = (bot: BotWithPortfolio) => {
  // Generate 30 days of rolling returns data
  const data = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  let previousReturn = 0
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Generate returns with some mean reversion
    const meanReversion = (0 - previousReturn) * 0.3
    const randomComponent = (Math.random() - 0.5) * 2
    const dailyReturn = meanReversion + randomComponent + ((bot.performance?.pnlPercentage || 0) / 30)
    previousReturn = dailyReturn

    data.push({
      date: date.toISOString().split('T')[0],
      return: dailyReturn
    })
  }

  return data
}

export const generateTradeDistributionData = (bot: BotWithPortfolio) => {
  // Generate trade P&L distribution
  const ranges = [
    '-5% or less',
    '-5% to -2%',
    '-2% to 0%',
    '0% to 2%',
    '2% to 5%',
    '5% or more'
  ]

  // Generate distribution based on win rate
  const winRate = bot.performance?.winRate || 50
  const totalTrades = bot.performance?.totalTrades || 100
  
  return ranges.map((range, index) => {
    let count
    if (index < 3) {
      // Losing trades
      count = Math.round((totalTrades * (100 - winRate) / 100) / 3)
    } else {
      // Winning trades
      count = Math.round((totalTrades * winRate / 100) / 3)
    }

    return {
      range,
      count: count + Math.round((Math.random() - 0.5) * count * 0.2) // Add some noise
    }
  })
}

export const generateTradeTimingData = (bot: BotWithPortfolio) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  return hours.map(hour => ({
    hour: `${hour}:00`,
    volume: Math.floor(Math.random() * 50)
  }))
}

export const generateAssetAllocationData = (bot: BotWithPortfolio) => {
  if (bot.settings?.type === 'basket') {
    return Object.entries(bot.settings.targetAllocation).map(([symbol, weight]) => ({
      name: symbol,
      value: weight
    }))
  }

  // For non-basket bots, return single asset allocation
  return [{
    name: bot.settings?.symbol || 'Unknown',
    value: 1
  }]
}

export const generateStrategyAttributionData = (bot: BotWithPortfolio) => {
  if (bot.settings?.type === 'signal') {
    return bot.settings.indicators.map(indicator => ({
      name: `${indicator.type.toUpperCase()} (${indicator.timeframe})`,
      value: Math.random() // In a real implementation, this would be the strategy's contribution to returns
    }))
  }

  return [{
    name: bot.type,
    value: 1
  }]
}

export const generateCorrelationData = (bot: BotWithPortfolio) => {
  const assets = bot.settings?.type === 'basket' 
    ? Object.keys(bot.settings.targetAllocation)
    : [bot.settings?.symbol || 'Unknown']

  return assets.map(asset1 => ({
    name: asset1,
    ...Object.fromEntries(
      assets.map(asset2 => [
        asset2,
        asset1 === asset2 ? 1 : (Math.random() * 2 - 1)
      ])
    )
  }))
}

export const calculatePortfolioMetrics = (positions: Position[]): { 
  totalValue: number
  totalPnL: number
  totalPositions: number 
} => {
  return positions.reduce((acc, pos) => {
    if (pos.assetType === 'basket') {
      const basketMetrics = calculatePortfolioMetrics(pos.positions || [])
      return {
        totalValue: acc.totalValue + basketMetrics.totalValue,
        totalPnL: acc.totalPnL + basketMetrics.totalPnL,
        totalPositions: acc.totalPositions + basketMetrics.totalPositions
      }
    }

    const value = (pos.currentPrice || 0) * (pos.quantity || 0)
    const cost = (pos.avgPrice || 0) * (pos.quantity || 0)
    const pnl = value - cost

    return {
      totalValue: acc.totalValue + value,
      totalPnL: acc.totalPnL + pnl,
      totalPositions: acc.totalPositions + 1
    }
  }, { totalValue: 0, totalPnL: 0, totalPositions: 0 })
}