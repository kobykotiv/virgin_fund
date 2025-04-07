import { Position, Trade } from "@/types/portfolio"

export function calculatePositionValue(position: Position): {
  totalValue: number
  totalCost: number
  pnl: number
  pnlPercent: number
  trades: number
} {
  if (position.assetType === 'basket') {
    return position.positions.reduce((acc, pos) => {
      const metrics = calculatePositionValue(pos)
      return {
        totalValue: acc.totalValue + metrics.totalValue,
        totalCost: acc.totalCost + metrics.totalCost,
        pnl: acc.pnl + metrics.pnl,
        pnlPercent: ((acc.pnl + metrics.pnl) / (acc.totalCost + metrics.totalCost)) * 100,
        trades: acc.trades + metrics.trades
      }
    }, { totalValue: 0, totalCost: 0, pnl: 0, pnlPercent: 0, trades: 0 })
  }

  const value = (position.currentPrice || 0) * (position.quantity || 0)
  const cost = (position.avgPrice || 0) * (position.quantity || 0)
  const pnl = value - cost
  const pnlPercent = (pnl / cost) * 100
  const trades = position.trades?.length || 0

  return {
    totalValue: value,
    totalCost: cost,
    pnl,
    pnlPercent,
    trades
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
