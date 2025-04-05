import { isDemoMode, DEMO_PORTFOLIO_KEY } from "./demo-service"

export interface Position {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  marketValue: number
  unrealizedPnL: number
  percentChange: number
}

export interface Portfolio {
  totalValue: number
  cashBalance: number
  positions: Position[]
}

// Fetch portfolio
export async function fetchPortfolio(): Promise<Portfolio> {
  if (isDemoMode()) {
    return fetchDemoPortfolio()
  } else {
    // In a real app, this would call the API
    return fetchRealPortfolio()
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

// Real API implementations (placeholders)
function fetchRealPortfolio(): Promise<Portfolio> {
  return new Promise((resolve) => {
    // In a real app, this would call the API
    setTimeout(() => {
      resolve({
        totalValue: 0,
        cashBalance: 0,
        positions: [],
      })
    }, 500)
  })
}

