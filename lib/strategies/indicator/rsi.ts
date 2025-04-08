import { MarketData } from "@/types/market"

export function calculateRSI(data: MarketData[], period: number = 14): number {
  if (data.length < period + 1) {
    throw new Error(`Insufficient data for RSI calculation. Need at least ${period + 1} periods`);
  }

  let gains = 0;
  let losses = 0;

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].price - data[i - 1].price;
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculate RSI
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
}

export function analyzeRSI(
  currentRSI: number,
  entryThreshold: number,
  exitThreshold: number
) {
  if (currentRSI <= entryThreshold) {
    return {
      signal: "buy" as const,
      confidence: Math.min(1, (entryThreshold - currentRSI) / entryThreshold)
    };
  }

  if (currentRSI >= exitThreshold) {
    return {
      signal: "sell" as const,
      confidence: Math.min(1, (currentRSI - exitThreshold) / (100 - exitThreshold))
    };
  }

  return {
    signal: "hold" as const,
    confidence: 0
  };
}
