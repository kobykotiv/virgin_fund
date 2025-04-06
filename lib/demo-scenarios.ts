import { PORTFOLIO_SCENARIOS } from "./portfolio-scenarios"

export const DEMO_SCENARIOS = {
  retail: {
    title: "Retail Investor",
    description: "Experience trading with a $100k portfolio",
    tags: ["Stocks", "Growth", "Value"],
    scenarios: [PORTFOLIO_SCENARIOS.meta2022, PORTFOLIO_SCENARIOS.chipotle2015]
  },
  institutional: {
    title: "Institutional Investor", 
    description: "Manage a $10M portfolio with advanced strategies",
    tags: ["Professional", "Large Cap", "Diversified"],
    scenarios: [PORTFOLIO_SCENARIOS.housingMarketLong, PORTFOLIO_SCENARIOS.housingMarketShort]
  },
  crypto: {
    title: "Crypto Trader",
    description: "Trade cryptocurrencies and digital assets",
    tags: ["Crypto", "High Risk", "Digital Assets"],
    scenarios: [PORTFOLIO_SCENARIOS.cryptoIndexFund, PORTFOLIO_SCENARIOS.cryptoMemeIndex]
  },
  recovery: {
    title: "Recovery Plays",
    description: "Bottom-fishing and turnaround investments",
    tags: ["Value", "Turnaround", "Opportunistic"],
    scenarios: [PORTFOLIO_SCENARIOS.meta2022, PORTFOLIO_SCENARIOS.covid2020]
  },
  marketNeutral: {
    title: "Market Neutral",
    description: "Long-short strategies with reduced market exposure",
    tags: ["Hedge", "Low Risk", "Pairs Trading"],
    scenarios: [PORTFOLIO_SCENARIOS.marketNeutral2023, PORTFOLIO_SCENARIOS.alternativeAssets2022]
  },
  memeStocks: {
    title: "Meme Stock Trader",
    description: "High volatility social-driven stocks",
    tags: ["High Risk", "Social", "Momentum"],
    scenarios: [PORTFOLIO_SCENARIOS.memeStocksCraze, PORTFOLIO_SCENARIOS.cryptoMemeIndex]
  }
} as const

export type DemoScenarioKey = keyof typeof DEMO_SCENARIOS

export interface DemoScenario {
  title: string;
  description: string;
  tags?: string[];
  scenarios: Array<{
    id: string;
    name: string;
    focus: string;
  }>;
}
