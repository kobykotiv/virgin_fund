import { Position, Trade } from "@/types/bot"

export interface RebalanceTarget {
  symbol: string
  targetWeight: number
  currentWeight: number
  tolerance: number // Allowable deviation before rebalance
}

export class PortfolioRebalancer {
  constructor(
    private positions: Position[],
    private totalValue: number,
    private targets: RebalanceTarget[]
  ) {}

  calculateRebalanceTrades(): Trade[] {
    const trades: Trade[] = []
    
    for (const target of this.targets) {
      const position = this.positions.find(p => p.symbol === target.symbol)
      const positionValue = position ? position.quantity * position.currentPrice : 0
      const currentWeight = positionValue / this.totalValue
      const deviation = Math.abs(currentWeight - target.targetWeight)

      if (deviation > target.tolerance) {
        const targetValue = this.totalValue * target.targetWeight
        const diffValue = targetValue - positionValue
        const direction = diffValue > 0 ? 'buy' : 'sell'
        const quantity = Math.abs(Math.floor(diffValue / position!.currentPrice))

        if (quantity > 0) {
          trades.push({
            symbol: target.symbol,
            side: direction,
            quantity,
            type: 'market',
            timestamp: new Date().toISOString(),
            price: position!.currentPrice
          })
        }
      }
    }

    return trades
  }
}
