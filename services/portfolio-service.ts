import type { Portfolio, Position } from "@/types/portfolio"
import { isDemoMode, DEMO_PORTFOLIO_KEY } from "./demo-service"

// Fetch portfolio
export async function fetchPortfolio(): Promise<Portfolio> {
  return isDemoMode()
    ? fetchDemoPortfolio()
    : {
        id: "general",
        name: "$10M Portfolio",
        focus: "General trading with a large portfolio",
        icon: "DollarSign",
        tags: ["Stocks", "Balanced"],
        risk: "Moderate",
        value: 10_245_320,
        return: 8.2,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
          { name: "Stocks", value: 45, color: "#4f46e5" },
          { name: "Bonds", value: 30, color: "#10b981" },
          { name: "Cash", value: 15, color: "#f59e0b" },
          { name: "Crypto", value: 10, color: "#8b5cf6" }
        ],
        positions: [
          {
            id: "pos1",
            assetType: "stock",
            ticker: "AAPL",
            quantity: 1000,
            avgPrice: 150,
            currentPrice: 160,
            basket: null,
            trades: [
              {
                tradeId: "trade1",
                action: "BUY",
                side: "LONG",
                quantity: 1000,
                price: 150,
                datetime: "2025-03-20T14:30:00Z"
              }
            ]
          },
          // ... other positions
        ]
      }
}

// Demo mode implementations
function fetchDemoPortfolio(): Promise<Portfolio> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const portfolio = JSON.parse(localStorage.getItem(DEMO_PORTFOLIO_KEY) || "{}")
      resolve(portfolio)
    }, 500)
  })
}

type PortfolioMetrics = {
  totalValue: number
  totalPnL: number
  totalPositions: number
}

export function calculatePortfolioMetrics(positions: Position[]): PortfolioMetrics {
  return positions.reduce<PortfolioMetrics>((acc, pos) => {
    if (pos.assetType === 'basket') {
      const basketMetrics: PortfolioMetrics = calculatePortfolioMetrics(pos.positions)
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


