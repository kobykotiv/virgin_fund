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
    console.error('Error fetching portfolios:', error);
    // Fallback to generated data
    return generatePortfolios(48);
  }
}

// This will be hydrated with real data on the client
export const portfolios = generatePortfolios(48).map((portfolio: any) => ({
  ...portfolio,
  id: uuidv4(), // Generate unique ID for each portfolio
  historicalData: [
    { timestamp: "2023-01-01", value: portfolio.value * 0.85 },
    { timestamp: "2023-02-01", value: portfolio.value * 0.88 },
    { timestamp: "2023-03-01", value: portfolio.value * 0.92 },
    { timestamp: "2023-04-01", value: portfolio.value * 0.97 },
    { timestamp: "2023-05-01", value: portfolio.value * 0.99 },
    { timestamp: "2023-06-01", value: portfolio.value * 1.02 },
    { timestamp: "2023-07-01", value: portfolio.value * 1.05 },
    { timestamp: "2023-08-01", value: portfolio.value * 1.08 },
    { timestamp: "2023-09-01", value: portfolio.value * 1.12 },
    { timestamp: "2023-10-01", value: portfolio.value * 1.15 },
    { timestamp: "2023-11-01", value: portfolio.value * 1.18 },
    { timestamp: "2023-12-01", value: portfolio.value },
  ],
}));

// Portfolio categories for filtering
export const portfolioCategories = {
  bullish: portfolios
    .filter((p: any) => p.sentiment === "bullish")
    .sort((a: any, b: any) => (b.sentimentStrength || 0) - (a.sentimentStrength || 0)),

  bearish: portfolios
    .filter((p: any) => p.sentiment === "bearish")
    .sort((a: any, b: any) => (b.sentimentStrength || 0) - (a.sentimentStrength || 0)),

  neutralSentiment: portfolios
    .filter((p: any) => p.sentiment === "neutral")
    .sort((a: any, b: any) => (b.sentimentStrength || 0) - (a.sentimentStrength || 0)),

  extremeFear: portfolios.filter((p: any) => p.fearGreedIndex && p.fearGreedIndex < 25).slice(0, 6),
  fear: portfolios.filter((p: any) => p.fearGreedIndex && p.fearGreedIndex >= 25 && p.fearGreedIndex < 40).slice(0, 6),
  neutralFearGreed: portfolios.filter((p: any) => p.fearGreedIndex && p.fearGreedIndex >= 40 && p.fearGreedIndex < 60).slice(0, 6),
  greed: portfolios.filter((p: any) => p.fearGreedIndex && p.fearGreedIndex >= 60 && p.fearGreedIndex < 75).slice(0, 6),
  extremeGreed: portfolios.filter((p: any) => p.fearGreedIndex && p.fearGreedIndex >= 75).slice(0, 6),
};
