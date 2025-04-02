export function evaluatePriceSignal(signal: any, marketData: any) {
  const { symbol, timeframe, type } = signal.params
  const data = marketData[symbol]
  if (!data) return null

  const previous = data.previousClose || data.open
  const current = type === "close" ? data.close :
                 type === "open" ? data.open :
                 type === "high" ? data.high :
                 type === "low" ? data.low :
                 type === "volume" ? data.volume : data.close

  return {
    type: "PRICE",
    symbol,
    timeframe,
    previous,
    current,
    change: ((current - previous) / previous) * 100
  }
}

export function evaluateSMASignal(signal: any, marketData: any) {
  const { symbol, period, source } = signal.params
  const data = marketData[symbol]?.historicalData
  if (!data || data.length < period) return null

  const values = data.map(d => d[source] || d.close)
  const sma = calculateSMA(values, period)
  const current = sma[sma.length - 1]
  const previous = sma[sma.length - 2]

  return {
    type: "SMA",
    symbol,
    period,
    previous,
    current,
    trend: current > previous ? "up" : "down"
  }
}

export function evaluateEMASignal(signal: any, marketData: any) {
  const { symbol, period, source } = signal.params
  const data = marketData[symbol]?.historicalData
  if (!data || data.length < period) return null

  const values = data.map(d => d[source] || d.close)
  const ema = calculateEMA(values, period)
  const current = ema[ema.length - 1]
  const previous = ema[ema.length - 2]

  return {
    type: "EMA",
    symbol,
    period,
    previous,
    current,
    trend: current > previous ? "up" : "down"
  }
}

export function evaluateRSISignal(signal: any, marketData: any) {
  const { symbol, period } = signal.params
  const data = marketData[symbol]?.historicalData
  if (!data || data.length < period + 1) return null

  const closes = data.map(d => d.close)
  const rsi = calculateRSI(closes, period)
  const current = rsi[rsi.length - 1]
  const previous = rsi[rsi.length - 2]

  return {
    type: "RSI",
    symbol,
    period,
    previous,
    current,
    isOverbought: current > 70,
    isOversold: current < 30,
    trend: current > previous ? "up" : "down"
  }
}

export function evaluateMACDSignal(signal: any, marketData: any) {
  const { symbol, fastPeriod, slowPeriod, signalPeriod } = signal.params
  const data = marketData[symbol]?.historicalData
  if (!data || data.length < Math.max(fastPeriod, slowPeriod) + signalPeriod) return null

  const closes = data.map(d => d.close)
  const macd = calculateMACD(closes, fastPeriod, slowPeriod, signalPeriod)
  const current = macd[macd.length - 1]
  const previous = macd[macd.length - 2]

  return {
    type: "MACD",
    symbol,
    current: current.macd,
    previous: previous.macd,
    signal: current.signal,
    histogram: current.histogram,
    trend: current.histogram > previous.histogram ? "up" : "down",
    crossover: previous.macd <= previous.signal && current.macd > current.signal ? "bullish" :
               previous.macd >= previous.signal && current.macd < current.signal ? "bearish" : null
  }
}

export function evaluateBollingerBandsSignal(signal: any, marketData: any) {
  const { symbol, period, stdDev } = signal.params
  const data = marketData[symbol]?.historicalData
  if (!data || data.length < period) return null

  const closes = data.map(d => d.close)
  const bb = calculateBollingerBands(closes, period, stdDev)
  const current = bb[bb.length - 1]
  const price = data[data.length - 1].close

  return {
    type: "BOLLINGER_BANDS",
    symbol,
    current: {
      upper: current.upper,
      middle: current.middle,
      lower: current.lower,
      price
    },
    isAboveUpper: price > current.upper,
    isBelowLower: price < current.lower,
    percentB: ((price - current.lower) / (current.upper - current.lower)) * 100
  }
}

// Helper functions for technical analysis calculations
function calculateSMA(values: number[], period: number): number[] {
  const result = []
  for (let i = period - 1; i < values.length; i++) {
    const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    result.push(sum / period)
  }
  return result
}

function calculateEMA(values: number[], period: number): number[] {
  const k = 2 / (period + 1)
  const result = [values[0]]
  
  for (let i = 1; i < values.length; i++) {
    result.push(values[i] * k + result[i - 1] * (1 - k))
  }
  
  return result
}

function calculateRSI(values: number[], period: number): number[] {
  const gains = []
  const losses = []
  const result = []

  // Calculate initial gains and losses
  for (let i = 1; i < values.length; i++) {
    const difference = values[i] - values[i - 1]
    gains.push(Math.max(difference, 0))
    losses.push(Math.max(-difference, 0))
  }

  // Calculate RSI
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period

  for (let i = period; i < values.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i - 1]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period
    const rs = avgGain / avgLoss
    result.push(100 - (100 / (1 + rs)))
  }

  return result
}

function calculateMACD(
  values: number[],
  fastPeriod: number,
  slowPeriod: number,
  signalPeriod: number
): Array<{ macd: number; signal: number; histogram: number }> {
  const fastEMA = calculateEMA(values, fastPeriod)
  const slowEMA = calculateEMA(values, slowPeriod)
  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i])
  const signalLine = calculateEMA(macdLine, signalPeriod)

  return macdLine.map((macd, i) => ({
    macd,
    signal: signalLine[i] || 0,
    histogram: macd - (signalLine[i] || 0)
  }))
}

function calculateBollingerBands(
  values: number[],
  period: number,
  stdDev: number
): Array<{ upper: number; middle: number; lower: number }> {
  const sma = calculateSMA(values, period)
  const result = []

  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1)
    const mean = sma[i - period + 1]
    const std = Math.sqrt(
      slice.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / period
    )

    result.push({
      upper: mean + (std * stdDev),
      middle: mean,
      lower: mean - (std * stdDev)
    })
  }

  return result
}