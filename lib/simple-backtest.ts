// Minimal deterministic backtest implementation for SignalBuilder
// Keeps everything local and dependency-free so it's safe to run in the dev environment.

export type ConditionType = "price" | "volume" | "indicator"

export interface SignalCondition {
  id?: string
  type: ConditionType
  operator: string
  value?: string
  indicator?: string
  params?: Record<string, string>
}

export interface SignalConfig {
  name?: string
  description?: string
  timeframe?: string
  conditions: SignalCondition[]
}

export interface BacktestOptions {
  symbol?: string
  timeframe?: string
  lookback?: number
  horizon?: number // steps ahead for hypothetical return
}

export interface BacktestResult {
  symbol: string
  timeframe: string
  lookback: number
  signals: number
  hits: number
  hitRate: number
  avgReturn: number
  returns: number[]
  equityCurve?: { step: number; cumulative: number }[]
}

// Simple deterministic pseudo-random generator from string seed
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFromString(s = "") {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0
  return h >>> 0
}

import fs from "fs"
import path from "path"

export function generatePrices(symbol = "MOCK", n = 500) {
  // Try to load local historical data if available at data/historical/<symbol>.json
  try {
    const pth = path.join(process.cwd(), "data", "historical", `${symbol}.json`)
    if (fs.existsSync(pth)) {
      const raw = fs.readFileSync(pth, "utf8")
      const arr = JSON.parse(raw)
      if (Array.isArray(arr) && arr.length > 0) {
        // ensure numbers
        const nums = arr.map((v: any) => Number(v)).filter((v: number) => !Number.isNaN(v))
        if (nums.length >= n) return nums.slice(0, n)
        // if shorter than requested, pad by repeating last
        while (nums.length < n) nums.push(nums[nums.length - 1])
        return nums
      }
    }
  } catch (e) {
    // ignore and fallback to generator
    // console.warn("Historical data load failed:", e)
  }

  const seed = seedFromString(symbol)
  const rnd = mulberry32(seed)
  const prices: number[] = []
  let p = 100 + (rnd() - 0.5) * 10
  for (let i = 0; i < n; i++) {
    p = p * (1 + (rnd() - 0.48) * 0.02)
    prices.push(Number(p.toFixed(2)))
  }
  return prices
}

function sma(prices: number[], period: number) {
  const out: number[] = []
  for (let i = 0; i < prices.length; i++) {
    if (i + 1 < period) {
      out.push(NaN)
      continue
    }
    const slice = prices.slice(i + 1 - period, i + 1)
    const sum = slice.reduce((a, b) => a + b, 0)
    out.push(sum / period)
  }
  return out
}

function rsi(prices: number[], period: number) {
  const changes: number[] = []
  for (let i = 1; i < prices.length; i++) changes.push(prices[i] - prices[i - 1])
  const gains: number[] = []
  const losses: number[] = []
  for (let c of changes) {
    gains.push(Math.max(0, c))
    losses.push(Math.max(0, -c))
  }
  const out: number[] = [NaN]
  for (let i = 0; i < gains.length; i++) {
    if (i + 1 < period) {
      out.push(NaN)
      continue
    }
    const g = gains.slice(i + 1 - period, i + 1).reduce((a, b) => a + b, 0) / period
    const l = losses.slice(i + 1 - period, i + 1).reduce((a, b) => a + b, 0) / period
    const rs = g / (l || 1e-6)
    out.push(100 - 100 / (1 + rs))
  }
  return out
}

function evaluateConditionAtIndex(
  cond: SignalCondition,
  prices: number[],
  idx: number
): boolean {
  const last = prices[idx]
  if (cond.type === "price") {
    const v = Number(cond.value || 0)
    const op = cond.operator
    if (op === "above") return last > v
    if (op === "below") return last < v
    if (op === "equals") return last === v
    return false
  }
  if (cond.type === "indicator" && cond.indicator) {
    const period = Number(cond.params?.period || 14)
    if (cond.indicator === "sma") {
      const series = sma(prices.slice(0, idx + 1), period)
      const val = series[series.length - 1]
      if (isNaN(val)) return false
      if (cond.operator === "above") return last > val
      if (cond.operator === "below") return last < val
      return false
    }
    if (cond.indicator === "rsi") {
      const series = rsi(prices.slice(0, idx + 1), period)
      const val = series[series.length - 1]
      if (isNaN(val)) return false
      if (cond.operator === "above") return val > Number(cond.value || 70)
      if (cond.operator === "below") return val < Number(cond.value || 30)
      return false
    }
  }
  return false
}

export function runSimpleBacktest(config: SignalConfig, opts: BacktestOptions = {}): BacktestResult {
  const symbol = opts.symbol || "MOCK"
  const timeframe = opts.timeframe || "1d"
  const lookback = opts.lookback || 500
  const horizon = opts.horizon || 5

  const prices = generatePrices(symbol, lookback + horizon + 10)

  let signals = 0
  const returns: number[] = []

  for (let i = 20; i < prices.length - horizon; i++) {
    let ok = true
    for (const cond of config.conditions || []) {
      if (!evaluateConditionAtIndex(cond, prices, i)) {
        ok = false
        break
      }
    }
    if (ok) {
      signals++
      const entry = prices[i]
      const exit = prices[i + horizon]
      const ret = (exit - entry) / entry
  returns.push(Number(ret.toFixed(4)))
    }
  }

  const hits = returns.filter((r) => r > 0).length
  const hitRate = signals > 0 ? hits / signals : 0
  const avgReturn = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : 0

  return {
    symbol,
    timeframe,
    lookback,
    signals,
    hits,
    hitRate: Number(hitRate.toFixed(4)),
    avgReturn: Number(avgReturn.toFixed(4)),
    returns: returns.slice(0, 100),
    equityCurve: (() => {
      const curve: { step: number; cumulative: number }[] = []
      let cum = 1
      returns.forEach((r, i) => {
        cum = cum * (1 + r)
        curve.push({ step: i, cumulative: Number(cum.toFixed(4)) })
      })
      return curve
    })(),
  }
}

// Run backtest using a provided price series (close prices). Prices should be an array where later indexes are newer timestamps.
export function runBacktestWithPrices(config: SignalConfig, prices: number[], opts: BacktestOptions = {}): BacktestResult {
  const symbol = opts.symbol || "MOCK"
  const timeframe = opts.timeframe || "1d"
  const lookback = opts.lookback || prices.length
  const horizon = opts.horizon || 5

  const returns: number[] = []
  let signals = 0

  for (let i = 20; i < Math.min(prices.length - horizon, lookback); i++) {
    let ok = true
    for (const cond of config.conditions || []) {
      if (!evaluateConditionAtIndex(cond, prices, i)) {
        ok = false
        break
      }
    }
    if (ok) {
      signals++
      const entry = prices[i]
      const exit = prices[i + horizon]
      const ret = (exit - entry) / entry
  returns.push(Number(ret.toFixed(4)))
    }
  }

  const hits = returns.filter((r) => r > 0).length
  const hitRate = signals > 0 ? hits / signals : 0
  const avgReturn = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : 0

  return {
    symbol,
    timeframe,
    lookback,
    signals,
    hits,
    hitRate: Number(hitRate.toFixed(4)),
    avgReturn: Number(avgReturn.toFixed(4)),
    returns: returns.slice(0, 100),
    equityCurve: (() => {
      const curve: { step: number; cumulative: number }[] = []
      let cum = 1
      returns.forEach((r, i) => {
        cum = cum * (1 + r)
        curve.push({ step: i, cumulative: Number(cum.toFixed(4)) })
      })
      return curve
    })(),
  }
}
