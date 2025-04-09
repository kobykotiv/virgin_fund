import { portfolios } from "./demo-portfolios"
import { PORTFOLIO_SCENARIOS } from "./portfolio-scenarios"
import { v4 as uuidv4 } from 'uuid';

export const DEMO_SCENARIOS = {
  retail: {
    id: uuidv4(),
    title: "Retail Investor",
    description: "Experience trading with a retail portfolio",
    tags: ["Stocks", "ETFs", "Mutual Funds"],
    portfolios: portfolios.slice(0, 4)
  },
  institutional: {
    id: uuidv4(),
    title: "Institutional Investor",
    description: "Manage large-scale investment portfolios",
    tags: ["Professional", "Large Cap", "Diversified"],
    portfolios: portfolios.slice(4, 8)
  },
  crypto: {
    id: uuidv4(),
    title: "Crypto Trader",
    description: "Trade digital assets and cryptocurrencies",
    tags: ["Crypto", "DeFi", "Web3"],
    portfolios: portfolios.slice(8, 12)
  },
  recovery: {
    id: uuidv4(),
    title: "Recovery Plays",
    description: "Bottom-fishing and turnaround investments",
    tags: ["Value", "Turnaround", "Opportunistic"],
    scenarios: [PORTFOLIO_SCENARIOS.meta2022, PORTFOLIO_SCENARIOS.covid2020]
  },
  marketNeutral: {
    id: uuidv4(),
    title: "Market Neutral",
    description: "Long-short strategies with reduced market exposure",
    tags: ["Hedge", "Low Risk", "Pairs Trading"],
    scenarios: [PORTFOLIO_SCENARIOS.marketNeutral2023, PORTFOLIO_SCENARIOS.alternativeAssets2022]
  },
  memeStocks: {
    id: uuidv4(),
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
