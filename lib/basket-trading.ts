import { Position, Trade } from "@/types/bot"

export interface BasketAllocation {
  symbol: string
  targetWeight: number
  currentWeight: number
  rebalanceThreshold: number
}

export class BasketTrader {
  constructor(
    private positions: Position[],
    private allocations: BasketAllocation[],
    private totalValue: number
  ) {}

  calculateRebalanceOrders(): Trade[] {
    const orders: Trade[] = []
    
    for (const allocation of this.allocations) {
      const position = this.positions.find(p => p.symbol === allocation.symbol)
      const currentValue = position ? position.quantity * position.currentPrice : 0
      const currentWeight = currentValue / this.totalValue
      const targetValue = this.totalValue * allocation.targetWeight
      const deviation = Math.abs(currentWeight - allocation.targetWeight)

      if (deviation > allocation.rebalanceThreshold) {
        const diffValue = targetValue - currentValue
        const price = position?.currentPrice || 0
        const shares = Math.floor(Math.abs(diffValue) / price)

        if (shares > 0) {
          orders.push({
            symbol: allocation.symbol,
            quantity: shares,
            side: diffValue > 0 ? 'buy' : 'sell',
            type: 'market',
            timestamp: new Date().toISOString()
          })
        }
      }
    }

    return orders
  }

  getCorrelationMatrix(): number[][] {
    // Calculate return correlations between assets
    const returns = this.positions.map(p => this.calculateReturns(p.trades))
    const matrix: number[][] = []
    
    for (let i = 0; i < returns.length; i++) {
      matrix[i] = []
      for (let j = 0; j < returns.length; j++) {
        matrix[i][j] = this.calculateCorrelation(returns[i], returns[j])
      }
    }

    return matrix
  }

  private calculateReturns(trades: Trade[]): number[] {
    // Calculate periodic returns from trade history
    return trades
      .map((trade, i) => {
        if (i === 0) return 0
        return (trade.price - trades[i-1].price) / trades[i-1].price
      })
      .slice(1)
  }

  private calculateCorrelation(a: number[], b: number[]): number {
    // Pearson correlation coefficient
    const mean = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0) / arr.length
    const ma = mean(a), mb = mean(b)
    const n = Math.min(a.length, b.length)
    
    let num = 0, dena = 0, denb = 0
    for (let i = 0; i < n; i++) {
      num += (a[i] - ma) * (b[i] - mb)
      dena += Math.pow(a[i] - ma, 2)
      denb += Math.pow(b[i] - mb, 2)
    }
    
    return num / Math.sqrt(dena * denb)
  }
}
