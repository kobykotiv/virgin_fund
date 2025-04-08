import { MarketDataBar } from "@/types/market"
import { EMA } from "indicators-js"

export interface MACDResult {
  macdLine: number
  signalLine: number
  histogram: number
}

export function calculateMACD(
  data: MarketDataBar[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const prices = data.map(d => d.c)
  
  // Calculate EMAs
  const fastEMA = new EMA(fastPeriod)
  const slowEMA = new EMA(slowPeriod)
  const signalEMA = new EMA(signalPeriod)

  const fastValue = fastEMA.calculate(prices)
  const slowValue = slowEMA.calculate(prices)
  
  // Calculate MACD line
  const macdLine = fastValue - slowValue
  
  // Calculate signal line
  const signalLine = signalEMA.calculate([macdLine])
  
  // Calculate histogram
  const histogram = macdLine - signalLine

  return {
    macdLine,
    signalLine,
    histogram
  }
}

export function analyzeMACD(
  macdResult: MACDResult,
  sensitivity: number = 0.2
) {
  if (macdResult.histogram > sensitivity && macdResult.macdLine > 0) {
    return {
      signal: "buy" as const,
      confidence: Math.min(1, macdResult.histogram / (sensitivity * 2))
    };
  }

  if (macdResult.histogram < -sensitivity && macdResult.macdLine < 0) {
    return {
      signal: "sell" as const,
      confidence: Math.min(1, Math.abs(macdResult.histogram) / (sensitivity * 2))
    };
  }

  return {
    signal: "hold" as const,
    confidence: 0
  };
}
