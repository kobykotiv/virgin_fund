import { MarketDataBar } from "@/types/market"
import { SMA, StandardDeviation } from "indicators-js"

export interface BollingerBands {
  upper: number
  middle: number
  lower: number
  bandwidth: number
  percentB: number
}

export function calculateBollingerBands(
  data: MarketDataBar[],
  period: number = 20,
  stdDev: number = 2
): BollingerBands {
  const prices = data.map(d => d.c)
  const currentPrice = prices[prices.length - 1]
  
  // Calculate middle band (SMA)
  const sma = new SMA(period)
  const middle = sma.calculate(prices)
  
  // Calculate standard deviation
  const std = new StandardDeviation(period)
  const deviation = std.calculate(prices)
  
  // Calculate bands
  const upper = middle + (deviation * stdDev)
  const lower = middle - (deviation * stdDev)
  
  // Calculate bandwidth
  const bandwidth = ((upper - lower) / middle) * 100
  
  // Calculate %B
  const percentB = ((currentPrice - lower) / (upper - lower)) * 100

  return {
    upper,
    middle,
    lower,
    bandwidth,
    percentB
  }
}

export function analyzeBollingerBands(
  currentPrice: number,
  bands: BollingerBands,
  sensitivity: number = 0.05
) {
  const percentB = (currentPrice - bands.lower) / (bands.upper - bands.lower)
  
  if (percentB < sensitivity) {
    return {
      signal: "buy" as const,
      confidence: Math.min(1, (sensitivity - percentB) / sensitivity)
    };
  }

  if (percentB > 1 - sensitivity) {
    return {
      signal: "sell" as const,
      confidence: Math.min(1, (percentB - (1 - sensitivity)) / sensitivity)
    };
  }

  return {
    signal: "hold" as const,
    confidence: 0
  };
}
