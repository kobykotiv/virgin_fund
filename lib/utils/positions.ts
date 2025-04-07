import { generateDemoPositions } from "../demo-data"

export interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  value: number
  pnl: number
  pnlPercentage: number
}

export function getPortfolioPositions(portfolioId: string): Position[] {
  // Get demo positions
  const allPositions = generateDemoPositions()
  
  // Create different position subsets based on portfolio type
  const positionMap: Record<string, Position[]> = {
    "tech-growth": allPositions.filter(p => 
      ["AAPL", "MSFT", "GOOGL", "NVDA"].includes(p.symbol)),
    "value-income": allPositions.filter(p => 
      ["JNJ", "SPY", "AMZN", "META"].includes(p.symbol)),
    "crypto-pioneer": allPositions.filter(p => 
      ["BTC-USD", "TSLA", "NVDA"].includes(p.symbol)),
    // Add more portfolio types as needed
  }

  // Return positions for this portfolio or a subset of demo positions
  return positionMap[portfolioId] || allPositions.slice(0, 4)
}

export function calculateAllocation(positions: Position[]): Array<{ name: string; value: number }> {
  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0)
  
  return positions.map(pos => ({
    name: pos.symbol,
    value: Math.round((pos.value / totalValue) * 100)
  }))
}
