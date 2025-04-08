import { Position, Trade } from "@/types/bot"

export interface PortfolioMetrics {
  sharpeRatio: number
  sortino: number
  valueAtRisk: number
  beta: number
  alpha: number
  correlationMatrix: number[][]
  maxDrawdown: number
  informationRatio: number
}

export class RiskMetrics {
  constructor(
    private positions: Position[],
    private trades: Trade[],
    private historicalData: Record<string, number[]>,
    private riskFreeRate: number = 0.02
  ) {}

  calculateMetrics(): PortfolioMetrics {
    const returns = this.calculateReturns()
    const excessReturns = returns.map(r => r - this.riskFreeRate / 252) // Daily risk-free rate
    
    return {
      sharpeRatio: this.calculateSharpeRatio(excessReturns),
      sortino: this.calculateSortino(excessReturns),
      valueAtRisk: this.calculateVaR(returns, 0.95),
      beta: this.calculateBeta(returns),
      alpha: this.calculateAlpha(returns),
      correlationMatrix: this.calculateCorrelations(),
      maxDrawdown: this.calculateMaxDrawdown(returns),
      informationRatio: this.calculateInformationRatio(returns)
    }
  }

  private calculateSharpeRatio(excessReturns: number[]): number {
    const mean = this.mean(excessReturns)
    const stdDev = this.standardDeviation(excessReturns)
    return (mean / stdDev) * Math.sqrt(252) // Annualized
  }

  private calculateVaR(returns: number[], confidence: number): number {
    const sorted = [...returns].sort((a, b) => a - b)
    const index = Math.floor((1 - confidence) * sorted.length)
    return -sorted[index]
  }

  private calculateCorrelations(): number[][] {
    const symbols = this.positions.map(p => p.symbol)
    const matrix: number[][] = []
    
    for (let i = 0; i < symbols.length; i++) {
      matrix[i] = []
      for (let j = 0; j < symbols.length; j++) {
        const returnsA = this.historicalData[symbols[i]]
        const returnsB = this.historicalData[symbols[j]]
        matrix[i][j] = this.correlation(returnsA, returnsB)
      }
    }
    
    return matrix
  }

  private mean(values: number[]): number {
    return values.reduce((sum, v) => sum + v, 0) / values.length
  }

  private standardDeviation(values: number[]): number {
    const avg = this.mean(values)
    const squareDiffs = values.map(v => Math.pow(v - avg, 2))
    return Math.sqrt(this.mean(squareDiffs))
  }

  private correlation(a: number[], b: number[]): number {
    const ma = this.mean(a), mb = this.mean(b)
    const sa = this.standardDeviation(a), sb = this.standardDeviation(b)
    
    const covSum = a.reduce((sum, _, i) => 
      sum + (a[i] - ma) * (b[i] - mb), 0
    )
    
    return covSum / (sa * sb * (a.length - 1))
  }

  private calculateReturns(): number[] {
    // Calculate daily portfolio returns
    return []
  }
}
