import { MarketDataService } from "@/services/market-data";
import { generatePortfolios as generatePortfoliosFromUtil, generatePortfoliosWithRealData } from "./utils/portfolio-generator"

/**
 * Portfolio Collection
 * 
 * This file creates a diverse set of 48 portfolios with various characteristics:
 * - Real market data when available (prices, allocations)
 * - Different risk profiles (Low, Moderate, High)
 * - Market sentiment indicators (Bullish, Bearish, Neutral)
 * - Fear/Greed index values (0-100)
 * - Asset-specific allocations with real asset names and symbols
 */

// Use this function to get real data, or fall back to generated data
let portfoliosPromise: Promise<any[]>;

export async function getPortfolios() {
  try {
    // Initialize the promise if it doesn't exist
    if (!portfoliosPromise) {
      portfoliosPromise = generatePortfoliosWithRealData(48);
    }
    
    // Return the result of the promise
    return await portfoliosPromise;
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    // Fall back to generated data if real data fetching fails
    return generatePortfoliosFromUtil(48);
  }
}

// For immediate SSR/static rendering, provide fallback data
// This will be hydrated with real data on the client
export const portfolios = generatePortfolios(48).map(portfolio => {
  const baseValue = portfolio.positions.reduce((sum, pos) => sum + pos.value, 0);
  return {
    ...portfolio,
    quantity: 100, // Default quantity for historical calculations
    historicalData: async () => {
      try {
        // Try to fetch real data from Alpaca
        const marketDataService = new MarketDataService(
          process.env.ALPACA_API_KEY || '',
          process.env.ALPACA_SECRET_KEY || '',
          true // isPaper mode
        )
        const end = new Date().toISOString()
        const start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
        
        const approvedPositions = [
            { symbol: 'TSLA', value: 10000 },
            { symbol: 'AAPL', value: 8000 },
            { symbol: 'MSFT', value: 12000 },
            { symbol: 'NVDA', value: 9000 },
            { symbol: 'AMZN', value: 11000 },
            { symbol: 'GOOGL', value: 10500 },
            { symbol: 'SPY', value: 10000 }
        ];
        const randomPosition = approvedPositions[Math.floor(Math.random() * approvedPositions.length)];
        const data = await marketDataService.getHistoricalBars(randomPosition.symbol, '1Month', start, end)
        
        return data.map(bar => ({
          timestamp: new Date(bar.t).toISOString().split('T')[0],
          value: bar.c * portfolio.quantity
        }))
      } catch (error) {
        console.warn('Falling back to mock historical data:', error)
        // Fallback to generated data
        return [
          { timestamp: "2023-01-01", value: baseValue * 0.85 },
          { timestamp: "2023-02-01", value: baseValue * 0.88 },
          { timestamp: "2023-03-01", value: baseValue * 0.92 },
          { timestamp: "2023-04-01", value: baseValue * 0.97 },
          { timestamp: "2023-05-01", value: baseValue * 0.99 },
          { timestamp: "2023-06-01", value: baseValue * 1.02 },
          { timestamp: "2023-07-01", value: baseValue * 1.05 },
          { timestamp: "2023-08-01", value: baseValue * 1.08 },
          { timestamp: "2023-09-01", value: baseValue * 1.12 },
          { timestamp: "2023-10-01", value: baseValue * 1.15 },
          { timestamp: "2023-11-01", value: baseValue * 1.18 },
          { timestamp: "2023-12-01", value: baseValue }
        ]
      }
    },
    costBasis: async () => {
      try {
        const response = await fetch('/api/alpaca/account')
        const accountData = await response.json()
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(accountData.cost_basis || 45500)
      } catch {
        return "$45,500" // Fallback
      }
    },
    positions: async () => {
      try {
        // Try to fetch real positions from Alpaca
        const response = await fetch('/api/alpaca/positions')
        const positions = await response.json()
        return positions.map((pos: any) => ({
          name: pos.symbol,
          symbol: pos.symbol,
          value: parseFloat(pos.market_value)
        }))
      } catch (error) {
        console.warn('Falling back to mock position data:', error)
        return [
          { name: "Apple", symbol: "AAPL", value: baseValue * 0.15 },
          { name: "Microsoft", symbol: "MSFT", value: baseValue * 0.12 },
          { name: "NVIDIA", symbol: "NVDA", value: baseValue * 0.10 },
          // Add other fallback positions as needed
        ]
      }
    },
    returnClass: portfolio.return > 0 ? "positive" : "negative",
    return: portfolio.return ? `${portfolio.return > 0 ? '+' : ''}${portfolio.return}%` : "+0.00%",
    chartVariant: "gradient",
    tags: portfolio.tags || ["stocks"],
    sentimentStrength: portfolio.sentimentStrength || 50,
    sentiment: portfolio.sentiment || "neutral",
    fearGreedIndex: portfolio.fearGreedIndex || 50,
    fearGreedLabel: portfolio.fearGreedLabel || "Neutral"
  }
  });

// ===== CATEGORIZED COLLECTIONS =====
// These collections make it easy to display related portfolios together

/**
 * Featured collections - Portfolios for various display purposes
 */
export const featuredPortfolios = portfolios.slice(0, 24)

/**
 * Sentiment-based collections - Grouped by market outlook
 */
export const bullishPortfolios = portfolios
  .filter(p => p.sentiment === "bullish")
  .sort((a, b) => (b.sentimentStrength || 0) - (a.sentimentStrength || 0))
  .slice(0, 12)

export const bearishPortfolios = portfolios
  .filter(p => p.sentiment === "bearish")
  .sort((a, b) => (b.sentimentStrength || 0) - (a.sentimentStrength || 0))
  .slice(0, 12)

export const neutralPortfolios = portfolios
  .filter(p => p.sentiment === "neutral")
  .slice(0, 12)

/**
 * Fear/Greed indexed collections - Grouped by market psychology
 */
export const fearGreedCollections = {
  extremeFear: portfolios.filter(p => p.fearGreedIndex && p.fearGreedIndex < 25).slice(0, 6),
  fear: portfolios.filter(p => p.fearGreedIndex && p.fearGreedIndex >= 25 && p.fearGreedIndex < 40).slice(0, 6),
  neutral: portfolios.filter(p => p.fearGreedIndex && p.fearGreedIndex >= 40 && p.fearGreedIndex < 60).slice(0, 6),
  greed: portfolios.filter(p => p.fearGreedIndex && p.fearGreedIndex >= 60 && p.fearGreedIndex < 75).slice(0, 6),
  extremeGreed: portfolios.filter(p => p.fearGreedIndex && p.fearGreedIndex >= 75).slice(0, 6)
}

/**
 * Risk-based collections - Grouped by risk profile
 */
export const riskBasedCollections = {
  very_low: portfolios.filter(p => p.risk === "Very Low"),
  low: portfolios.filter(p => p.risk === "Low"),
  moderate: portfolios.filter(p => p.risk === "Moderate"),
  high: portfolios.filter(p => p.risk === "High"),
  very_high: portfolios.filter(p => p.risk === "Very High")
}

/**
 * Helper function to get portfolios by filter criteria
 * @param criteria Object containing filter criteria
 * @returns Filtered array of portfolios
 */
export function getPortfoliosByFilter(criteria: {
  sentiment?: "bullish" | "bearish" | "neutral"
  risk?: "Low" | "Moderate" | "High"
  fearGreedMin?: number
  fearGreedMax?: number
  tags?: string[]
  limit?: number
}) {
  let filtered = [...portfolios]
  
  if (criteria.sentiment) {
    filtered = filtered.filter(p => p.sentiment === criteria.sentiment)
  }
  
  if (criteria.risk) {
    filtered = filtered.filter(p => p.risk === criteria.risk)
  }
  
  if (criteria.fearGreedMin !== undefined) {
    filtered = filtered.filter(p => (p.fearGreedIndex || 0) >= criteria.fearGreedMin!)
  }
  
  if (criteria.fearGreedMax !== undefined) {
    filtered = filtered.filter(p => (p.fearGreedIndex || 0) <= criteria.fearGreedMax!)
  }
  
  if (criteria.tags && criteria.tags.length > 0) {
    filtered = filtered.filter(p => 
      criteria.tags!.some(tag => p.tags.includes(tag))
    )
  }
  
  return criteria.limit ? filtered.slice(0, criteria.limit) : filtered
}

export function generatePortfolios(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `portfolio-${i + 1}`,
    quantity: 100,
    risk: "Moderate" as "Very Low" | "Low" | "Moderate" | "High" | "Very High",
    return: Math.random() * 20 - 10,
    tags: ["stocks"],
    sentimentStrength: 50,
    sentiment: "neutral",
    fearGreedIndex: 50,
    fearGreedLabel: "Neutral",
    positions: [{ name: "S&P 500", symbol: "SPY", value: 10000 }]
  }));
}
