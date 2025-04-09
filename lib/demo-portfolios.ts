import { generatePortfolios, generatePortfoliosWithRealData } from "./utils/portfolio-generator"
import { v4 as uuidv4 } from 'uuid';

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
    return generatePortfolios(48);
  }
}

// For immediate SSR/static rendering, provide fallback data
// This will be hydrated with real data on the client
export const portfolios = generatePortfolios(48).map(portfolio => ({
  ...portfolio,
  id: uuidv4(), // Generate unique ID for each portfolio
  historicalData: [
    { timestamp: "2023-01-01", value: portfolio.baseValue * 0.85 },
    { timestamp: "2023-02-01", value: portfolio.baseValue * 0.88 },
    { timestamp: "2023-03-01", value: portfolio.baseValue * 0.92 },
    { timestamp: "2023-04-01", value: portfolio.baseValue * 0.97 },
    { timestamp: "2023-05-01", value: portfolio.baseValue * 0.99 },
    { timestamp: "2023-06-01", value: portfolio.baseValue * 1.02 },
    { timestamp: "2023-07-01", value: portfolio.baseValue * 1.05 },
    { timestamp: "2023-08-01", value: portfolio.baseValue * 1.08 },
    { timestamp: "2023-09-01", value: portfolio.baseValue * 1.12 },
    { timestamp: "2023-10-01", value: portfolio.baseValue * 1.15 },
    { timestamp: "2023-11-01", value: portfolio.baseValue * 1.18 },
    { timestamp: "2023-12-01", value: portfolio.baseValue }
  ],
  costBasis: "$45,500"
}));

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


