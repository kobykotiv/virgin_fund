// Minimal, well-documented indicator helpers used by the backtester.
// These are conservative, type-safe implementations intended to unblock
// TypeScript checks and provide reasonable defaults for tests and UI.
// Replace with more optimized/complete versions as needed.
//
// NOTE: Many files in this repo already implement similar logic inline.
// These exported helpers provide a single place for other modules to import
// indicators from (e.g. `import { calculateEMA } from "@/lib/indicators"`).

/**
 * Calculate Exponential Moving Average (EMA)
 * @param prices array of numeric prices
 * @param period smoothing period (default 14)
 * @returns array of same length as prices where early values are 0 until the EMA can be seeded
 */
export function calculateEMA(prices: number[], period = 14): number[] {
  const ema: number[] = []

  if (!Array.isArray(prices) || prices.length === 0) {
    return ema
  }

  const multiplier = 2 / (period + 1)

  // If there are not enough prices to seed an SMA, return zeros
  if (prices.length < period) {
    for (let i = 0; i < prices.length; i++) ema.push(0)
    return ema
  }

  // Seed with SMA for first period
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += prices[i] || 0
    ema.push(0)
  }

  ema[period - 1] = sum / period

  // Calculate EMA for the rest
  for (let i = period; i < prices.length; i++) {
    const prev = ema[i - 1]
    const value = (prices[i] - prev) * multiplier + prev
    ema.push(value)
  }

  return ema
}

/**
 * Calculate Relative Strength Index (RSI)
 * Produces an array aligned with input prices. Early values are 0 until enough data.
 */
export function calculateRSI(prices: number[], period = 14): number[] {
  const rsi: number[] = []

  if (!Array.isArray(prices) || prices.length === 0) return rsi

  const gains: number[] = []
  const losses: number[] = []

  // Fill leading values with 0 for consistency with other helpers
  for (let i = 0; i < period; i++) rsi.push(0)

  for (let i = 1; i < prices.length; i++) {
    const change = (prices[i] ?? 0) - (prices[i - 1] ?? 0)
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)

    if (i >= period) {
      const recentGains = gains.slice(-period)
      const recentLosses = losses.slice(-period)

      const avgGain = recentGains.reduce((s, v) => s + v, 0) / period
      const avgLoss = recentLosses.reduce((s, v) => s + v, 0) / period

      const rs = avgLoss === 0 ? (avgGain === 0 ? 0 : Number.POSITIVE_INFINITY) : avgGain / avgLoss
      const rsiValue = rs === Number.POSITIVE_INFINITY ? 100 : 100 - 100 / (1 + rs)

      rsi.push(Number.isFinite(rsiValue) ? rsiValue : 0)
    }
  }

  // If the output is shorter than input (edge cases), pad with zeros
  while (rsi.length < prices.length) rsi.push(0)

  return rsi
}

/**
 * Calculate MACD (macd line, signal line, histogram)
 * Uses EMA helper above.
 */
export function calculateMACD(
  prices: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
): { macd: number[]; signal: number[]; histogram: number[] } {
  const macd: number[] = []
  const signal: number[] = []
  const histogram: number[] = []

  if (!Array.isArray(prices) || prices.length === 0) {
    return { macd, signal, histogram }
  }

  const emaFast = calculateEMA(prices, fastPeriod)
  const emaSlow = calculateEMA(prices, slowPeriod)

  for (let i = 0; i < prices.length; i++) {
    const a = emaFast[i] ?? 0
    const b = emaSlow[i] ?? 0
    macd.push(a - b)
  }

  const signalLine = calculateEMA(macd, signalPeriod)

  for (let i = 0; i < macd.length; i++) {
    signal.push(signalLine[i] ?? 0)
    histogram.push(macd[i] - (signalLine[i] ?? 0))
  }

  return { macd, signal, histogram }
}

/**
 * Bollinger Bands
 * Returns upper, middle (SMA), and lower arrays aligned with prices.
 */
export function calculateBollingerBands(prices: number[], period = 20, stdDev = 2): { upper: number[]; middle: number[]; lower: number[] } {
  const upper: number[] = []
  const middle: number[] = []
  const lower: number[] = []

  if (!Array.isArray(prices) || prices.length === 0) {
    return { upper, middle, lower }
  }

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(0)
      middle.push(0)
      lower.push(0)
      continue
    }

    const window = prices.slice(i - period + 1, i + 1)
    const sma = window.reduce((s, v) => s + (v ?? 0), 0) / period
    const squaredDiffs = window.map((v) => Math.pow((v ?? 0) - sma, 2))
    const variance = squaredDiffs.reduce((s, v) => s + v, 0) / period
    const sd = Math.sqrt(variance)

    middle.push(sma)
    upper.push(sma + stdDev * sd)
    lower.push(sma - stdDev * sd)
  }

  return { upper, middle, lower }
}

// Export a light-weight calculateIndicators helper for convenience.
// Accepts OHLCV-like objects or just prices depending on callers.
export function calculateIndicatorsFromOHLC(
  prices: { date?: string; open?: number; high?: number; low?: number; close: number; volume?: number }[],
  config: { type: string; entryThreshold?: number; exitThreshold?: number } & Record<string, any>,
) {
  const closes = (prices || []).map((p) => p.close ?? 0)

  switch (config.type) {
    case "rsi":
      return { rsi: calculateRSI(closes, config.period ?? 14) }
    case "macd": {
      const m = calculateMACD(closes, config.fastPeriod ?? 12, config.slowPeriod ?? 26, config.signalPeriod ?? 9)
      return { macd: m.macd, signal: m.signal, histogram: m.histogram }
    }
    case "bollinger": {
      const b = calculateBollingerBands(closes, config.period ?? 20, config.stdDev ?? 2)
      return { upper: b.upper, middle: b.middle, lower: b.lower }
    }
  default:
      return {}
  }
}

  // Backwards-compatible shim: calculateIndicators expects (data, indicatorConfigs)
  // Many callers import `calculateIndicators` — expose a thin wrapper that delegates
  // to calculateIndicatorsFromOHLC for each config and returns the original data
  // (optionally enriched by callers). This keeps runtime behavior safe while
  // satisfying TypeScript imports across the repo.
  export function calculateIndicators(data: any[], indicatorConfigs: any[] | undefined) {
    if (!Array.isArray(data) || !Array.isArray(indicatorConfigs) || indicatorConfigs.length === 0) {
      return data
    }

    // For compatibility, compute indicators for each config but do not mutate original points.
    // Consumers can call calculateIndicatorsFromOHLC directly for more structured output.
    const results: Record<string, any>[] = indicatorConfigs.map((cfg: any) => {
      return calculateIndicatorsFromOHLC(data, cfg)
    })

    // Return original data; callers expecting enriched data should handle results separately.
    // This shim avoids breaking imports while allowing gradual migration.
    return data
  }
