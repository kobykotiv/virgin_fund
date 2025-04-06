import { PORTFOLIO_SCENARIOS } from "./portfolio-scenarios"

// Export predefined demo scenarios for login options
export const DEMO_SCENARIOS = {
  retail: {
    title: "Retail Investor",
    description: "Experience trading with a $100k portfolio",
    scenarios: [PORTFOLIO_SCENARIOS.bitcoinEarly, PORTFOLIO_SCENARIOS.teslaEarly]
  },
  institutional: {
    title: "Institutional Investor", 
    description: "Manage a $10M portfolio with advanced strategies",
    scenarios: [PORTFOLIO_SCENARIOS.dividendKings, PORTFOLIO_SCENARIOS.divGrowthEtfs]
  },
  crypto: {
    title: "Crypto Trader",
    description: "Trade cryptocurrencies and digital assets",
    scenarios: [PORTFOLIO_SCENARIOS.cryptoIndexFund, PORTFOLIO_SCENARIOS.cryptoMemeIndex]
  },
  recovery: {
    title: "Recovery Plays",
    description: "Bottom-fishing and turnaround investments",
    scenarios: [PORTFOLIO_SCENARIOS.meta2022, PORTFOLIO_SCENARIOS.chipotle2015]
  }
} as const

export type DemoScenarioKey = keyof typeof DEMO_SCENARIOS
