import { Position, Trade } from "@/types/portfolio"

export function calculateHistoricalPerformance(positions: Position[]) {
  const tradesByDate = positions.flatMap(pos => {
    if (pos.assetType === 'basket') {
      return pos.positions.flatMap(p => p.trades || [])
    }
    return pos.trades || []
  }).reduce((acc, trade) => {
    const date = trade.datetime.split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(trade)
    return acc
  }, {} as Record<string, Trade[]>)

  return Object.entries(tradesByDate).map(([date, trades]) => {
    const dailyPnL = trades.reduce((sum, trade) => {
      const value = trade.price * trade.quantity
      return sum + (trade.action === 'SELL' ? value : -value)
    }, 0)

    return {
      date,
      value: dailyPnL,
      trades: trades.length
    }
  }).sort((a, b) => a.date.localeCompare(b.date))
}

export function calculatePositionPerformance(positions: Position[]) {
  return positions.map(pos => {
    if (pos.assetType === 'basket') {
      const metrics = pos.positions.reduce((acc, p) => {
        const value = (p.currentPrice || 0) * (p.quantity || 0)
        const cost = (p.avgPrice || 0) * (p.quantity || 0)
        return {
          value: acc.value + value,
          cost: acc.cost + cost,
          trades: acc.trades + (p.trades?.length || 0)
        }
      }, { value: 0, cost: 0, trades: 0 })

      return {
        name: pos.name,
        type: 'basket',
        value: metrics.value,
        pnl: metrics.value - metrics.cost,
        pnlPercent: ((metrics.value - metrics.cost) / metrics.cost) * 100,
        trades: metrics.trades
      }
    }

    const value = (pos.currentPrice || 0) * (pos.quantity || 0)
    const cost = (pos.avgPrice || 0) * (pos.quantity || 0)

    return {
      name: pos.ticker,
      type: pos.assetType,
      value,
      pnl: value - cost,
      pnlPercent: ((value - cost) / cost) * 100,
      trades: pos.trades?.length || 0
    }
  })
}
