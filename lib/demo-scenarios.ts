export type DemoScenario = {
  id: string
  name: string
  description: string
  icon: string
  portfolioValue: string
  returns: {
    daily: string
    weekly: string
    monthly: string
    yearly: string
  }
  strategy: string
  assets: Array<{
    symbol: string
    name: string
    allocation: number
    performance: number
  }>
}

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  "middle-life": {
    id: "middle-life",
    name: "Middle Life Portfolio",
    description: "A balanced portfolio for mid-career investors focusing on growth with moderate risk",
    icon: "BarChart2",
    portfolioValue: "$487,250",
    returns: {
      daily: "+0.3%",
      weekly: "+1.2%",
      monthly: "+3.8%",
      yearly: "+12.4%",
    },
    strategy: "Balanced allocation across equities, bonds, and alternative investments with automated rebalancing",
    assets: [
      { symbol: "VTI", name: "Vanguard Total Stock Market ETF", allocation: 40, performance: 14.2 },
      { symbol: "VXUS", name: "Vanguard Total International Stock ETF", allocation: 20, performance: 8.7 },
      { symbol: "BND", name: "Vanguard Total Bond Market ETF", allocation: 20, performance: 3.2 },
      { symbol: "BNDX", name: "Vanguard Total International Bond ETF", allocation: 10, performance: 2.8 },
      { symbol: "VNQ", name: "Vanguard Real Estate ETF", allocation: 5, performance: 9.5 },
      { symbol: "BTC", name: "Bitcoin", allocation: 3, performance: 42.1 },
      { symbol: "ETH", name: "Ethereum", allocation: 2, performance: 37.6 },
    ],
  },
  signals: {
    id: "signals",
    name: "Signal Provider Portfolio",
    description: "A dynamic portfolio that follows professional trading signals from top providers",
    icon: "Signal",
    portfolioValue: "$325,780",
    returns: {
      daily: "+0.8%",
      weekly: "+2.7%",
      monthly: "+8.2%",
      yearly: "+28.6%",
    },
    strategy: "Automated execution of trading signals from multiple verified providers with risk management",
    assets: [
      { symbol: "AAPL", name: "Apple Inc.", allocation: 15, performance: 22.4 },
      { symbol: "MSFT", name: "Microsoft Corporation", allocation: 12, performance: 28.7 },
      { symbol: "AMZN", name: "Amazon.com Inc.", allocation: 10, performance: 18.3 },
      { symbol: "TSLA", name: "Tesla Inc.", allocation: 8, performance: 32.6 },
      { symbol: "NVDA", name: "NVIDIA Corporation", allocation: 7, performance: 45.2 },
      { symbol: "BTC", name: "Bitcoin", allocation: 15, performance: 42.1 },
      { symbol: "ETH", name: "Ethereum", allocation: 10, performance: 37.6 },
      { symbol: "SOL", name: "Solana", allocation: 5, performance: 58.9 },
      { symbol: "CASH", name: "Cash Reserve", allocation: 18, performance: 0 },
    ],
  },
  grid: {
    id: "grid",
    name: "1% Grid Trading Strategy",
    description: "Automated grid trading strategy that buys and sells at 1% price intervals",
    icon: "Grid",
    portfolioValue: "$215,430",
    returns: {
      daily: "+0.5%",
      weekly: "+3.2%",
      monthly: "+9.7%",
      yearly: "+32.1%",
    },
    strategy: "Places buy and sell orders at 1% intervals to capitalize on market volatility",
    assets: [
      { symbol: "BTC", name: "Bitcoin", allocation: 30, performance: 42.1 },
      { symbol: "ETH", name: "Ethereum", allocation: 25, performance: 37.6 },
      { symbol: "BNB", name: "Binance Coin", allocation: 15, performance: 28.3 },
      { symbol: "SOL", name: "Solana", allocation: 10, performance: 58.9 },
      { symbol: "ADA", name: "Cardano", allocation: 8, performance: 15.7 },
      { symbol: "DOT", name: "Polkadot", allocation: 7, performance: 22.4 },
      { symbol: "CASH", name: "Cash Reserve", allocation: 5, performance: 0 },
    ],
  },
  general: {
    id: "general",
    name: "$10M Demo Portfolio",
    description: "Experience managing a large diversified portfolio with advanced analytics",
    icon: "DollarSign",
    portfolioValue: "$10,000,000",
    returns: {
      daily: "+0.2%",
      weekly: "+1.1%",
      monthly: "+3.5%",
      yearly: "+15.8%",
    },
    strategy: "Diversified allocation across multiple asset classes with institutional-grade risk management",
    assets: [
      { symbol: "SPY", name: "SPDR S&P 500 ETF", allocation: 25, performance: 12.5 },
      { symbol: "QQQ", name: "Invesco QQQ Trust", allocation: 15, performance: 18.7 },
      { symbol: "AAPL", name: "Apple Inc.", allocation: 5, performance: 22.4 },
      { symbol: "MSFT", name: "Microsoft Corporation", allocation: 5, performance: 28.7 },
      { symbol: "AMZN", name: "Amazon.com Inc.", allocation: 5, performance: 18.3 },
      { symbol: "BND", name: "Vanguard Total Bond Market ETF", allocation: 15, performance: 3.2 },
      { symbol: "GLD", name: "SPDR Gold Shares", allocation: 5, performance: 8.1 },
      { symbol: "VNQ", name: "Vanguard Real Estate ETF", allocation: 10, performance: 9.5 },
      { symbol: "BTC", name: "Bitcoin", allocation: 5, performance: 42.1 },
      { symbol: "ETH", name: "Ethereum", allocation: 3, performance: 37.6 },
      { symbol: "CASH", name: "Cash Reserve", allocation: 7, performance: 0 },
    ],
  },
  crypto: {
    id: "crypto",
    name: "Crypto Trading Portfolio",
    description: "Specialized portfolio focused on cryptocurrency trading with advanced market analysis",
    icon: "Bitcoin",
    portfolioValue: "$750,000",
    returns: {
      daily: "+1.2%",
      weekly: "+5.8%",
      monthly: "+18.3%",
      yearly: "+124.7%",
    },
    strategy: "Active cryptocurrency trading using technical analysis and market sentiment indicators",
    assets: [
      { symbol: "BTC", name: "Bitcoin", allocation: 35, performance: 42.1 },
      { symbol: "ETH", name: "Ethereum", allocation: 25, performance: 37.6 },
      { symbol: "SOL", name: "Solana", allocation: 10, performance: 58.9 },
      { symbol: "ADA", name: "Cardano", allocation: 8, performance: 15.7 },
      { symbol: "DOT", name: "Polkadot", allocation: 7, performance: 22.4 },
      { symbol: "AVAX", name: "Avalanche", allocation: 5, performance: 45.2 },
      { symbol: "LINK", name: "Chainlink", allocation: 5, performance: 28.3 },
      { symbol: "CASH", name: "Stablecoin Reserve", allocation: 5, performance: 0 },
    ],
  },
  ai: {
    id: "ai",
    name: "AI-Powered Trading",
    description: "Cutting-edge portfolio managed by artificial intelligence and machine learning algorithms",
    icon: "Brain",
    portfolioValue: "$1,250,000",
    returns: {
      daily: "+0.7%",
      weekly: "+3.5%",
      monthly: "+12.8%",
      yearly: "+42.3%",
    },
    strategy: "Machine learning algorithms analyze market patterns and predict price movements with high accuracy",
    assets: [
      { symbol: "NVDA", name: "NVIDIA Corporation", allocation: 15, performance: 45.2 },
      { symbol: "TSLA", name: "Tesla Inc.", allocation: 12, performance: 32.6 },
      { symbol: "GOOGL", name: "Alphabet Inc.", allocation: 10, performance: 28.7 },
      { symbol: "AMZN", name: "Amazon.com Inc.", allocation: 10, performance: 18.3 },
      { symbol: "META", name: "Meta Platforms Inc.", allocation: 8, performance: 25.4 },
      { symbol: "MSFT", name: "Microsoft Corporation", allocation: 8, performance: 28.7 },
      { symbol: "AMD", name: "Advanced Micro Devices", allocation: 7, performance: 35.8 },
      { symbol: "CRM", name: "Salesforce Inc.", allocation: 7, performance: 22.1 },
      { symbol: "PLTR", name: "Palantir Technologies", allocation: 5, performance: 48.3 },
      { symbol: "BTC", name: "Bitcoin", allocation: 10, performance: 42.1 },
      { symbol: "ETH", name: "Ethereum", allocation: 8, performance: 37.6 },
    ],
  },
}

