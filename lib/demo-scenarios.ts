import { portfolios } from "./demo-portfolios"
import { PORTFOLIO_SCENARIOS } from "./portfolio-scenarios"
import { v4 as uuidv4 } from 'uuid';

export const DEMO_SCENARIOS = {
  retail: {
    id: uuidv4(),
    title: "Retail Investor",
    description: "Experience trading with a retail portfolio",
    tags: ["Stocks", "ETFs", "Mutual Funds"],
    portfolios: portfolios.slice(0, 4).map(p => ({
      id: p.id ?? uuidv4(),
      name: p.name,
      focus: p.focus,
    }))
  },
  institutional: {
    id: uuidv4(),
    title: "Institutional Investor",
    description: "Manage large-scale investment portfolios",
    tags: ["Professional", "Large Cap", "Diversified"],
    portfolios: portfolios.slice(4, 8).map(p => ({
      id: p.id ?? uuidv4(),
      name: p.name,
      focus: p.focus,
    }))
  },
  crypto: {
    id: uuidv4(),
    title: "Crypto Trader",
    description: "Trade digital assets and cryptocurrencies",
    tags: ["Crypto", "DeFi", "Web3"],
    portfolios: portfolios.slice(8, 12).map(p => ({
      id: p.id ?? uuidv4(),
      name: p.name,
      focus: p.focus,
    }))
  },
  recovery: {
    id: uuidv4(),
    title: "Recovery Plays",
    description: "Bottom-fishing and turnaround investments",
    tags: ["Value", "Turnaround", "Opportunistic"],
    scenarios: [
      {
        id: PORTFOLIO_SCENARIOS.meta2022.id,
        name: PORTFOLIO_SCENARIOS.meta2022.name,
        focus: PORTFOLIO_SCENARIOS.meta2022.focus,
      },
      {
        id: PORTFOLIO_SCENARIOS.covid2020.id,
        name: PORTFOLIO_SCENARIOS.covid2020.name,
        focus: PORTFOLIO_SCENARIOS.covid2020.focus,
      }
    ]
  },
  marketNeutral: {
    id: uuidv4(),
    title: "Market Neutral",
    description: "Long-short strategies with reduced market exposure",
    tags: ["Hedge", "Low Risk", "Pairs Trading"],
    scenarios: [
      {
        id: PORTFOLIO_SCENARIOS.marketNeutral2023.id,
        name: PORTFOLIO_SCENARIOS.marketNeutral2023.name,
        focus: PORTFOLIO_SCENARIOS.marketNeutral2023.focus,
      },
      {
        id: PORTFOLIO_SCENARIOS.alternativeAssets2022.id,
        name: PORTFOLIO_SCENARIOS.alternativeAssets2022.name,
        focus: PORTFOLIO_SCENARIOS.alternativeAssets2022.focus,
      }
    ]
  },
  memeStocks: {
    id: uuidv4(),
    title: "Meme Stock Trader",
    description: "High volatility social-driven stocks",
    tags: ["High Risk", "Social", "Momentum"],
    scenarios: [
      {
        id: PORTFOLIO_SCENARIOS.memeStocksCraze.id,
        name: PORTFOLIO_SCENARIOS.memeStocksCraze.name,
        focus: PORTFOLIO_SCENARIOS.memeStocksCraze.focus,
      },
      {
        id: PORTFOLIO_SCENARIOS.cryptoMemeIndex.id,
        name: PORTFOLIO_SCENARIOS.cryptoMemeIndex.name,
        focus: PORTFOLIO_SCENARIOS.cryptoMemeIndex.focus,
      }
    ]
  }
} as const

export type DemoScenarioKey = keyof typeof DEMO_SCENARIOS

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  portfolios?: Array<{
    id: string;
    name: string;
    focus: string;
  }>;
  scenarios?: Array<{
    id: string;
    name: string;
    focus: string;
  }>;
}
