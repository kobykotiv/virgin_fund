import { Position, Trade } from "@/types/bot"
import { MarketDataBar } from "@/types/market"

export interface RiskParameters {
  maxPositionSize: number // % of portfolio
  maxDrawdown: number // % of portfolio
  stopLoss: number // % from entry
  trailingStop: boolean
  trailingStopDistance: number // % from highest
}

export class RiskManager {
  constructor(private params: RiskParameters) {}

  calculatePositionSize(
    price: number,
    portfolioValue: number,
    riskPerTrade: number
  ): number {
    const maxPositionValue = portfolioValue * (this.params.maxPositionSize / 100)
    const riskAmount = portfolioValue * (riskPerTrade / 100)
    const stopLossDistance = price * (this.params.stopLoss / 100)
    
    // Calculate position size based on risk
    const riskBasedSize = riskAmount / stopLossDistance
    
    // Calculate size based on max position
    const maxSize = Math.floor(maxPositionValue / price)
    
    // Return smaller of the two sizes
    return Math.min(riskBasedSize, maxSize)
  }

  updateStopLoss(
    position: Position,
    currentPrice: number,
    highestPrice: number
  ): number {
    if (this.params.trailingStop) {
      const trailDistance = highestPrice * (this.params.trailingStopDistance / 100)
      return Math.max(
        highestPrice - trailDistance,
        position.entryPrice * (1 - this.params.stopLoss / 100)
      )
    }
    
    return position.entryPrice * (1 - this.params.stopLoss / 100)
  }

  checkDrawdown(equityCurve: { date: string, value: number }[]): boolean {
    let peak = equityCurve[0].value
    
    for (const point of equityCurve) {
      if (point.value > peak) {
        peak = point.value
      }
      
      const drawdown = ((peak - point.value) / peak) * 100
      if (drawdown > this.params.maxDrawdown) {
        return true
      }
    }
    
    return false
  }
}
