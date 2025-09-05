import type { IndicatorConfig } from "../backtesting/types"

export function calculateIndicators(data: any[], indicators: IndicatorConfig[]) {
  let enrichedData = [...data]

  for (const indicator of indicators) {
    switch (indicator.type) {
      case 'SMA':
        enrichedData = calculateSMA(enrichedData, indicator.params)
        break
      case 'EMA':
        enrichedData = calculateEMA(enrichedData, indicator.params)
        break
      case 'RSI':
        enrichedData = calculateRSI(enrichedData, indicator.params)
        break
      case 'MACD':
        enrichedData = calculateMACD(enrichedData, indicator.params)
        break
      case 'BB':
        enrichedData = calculateBollingerBands(enrichedData, indicator.params)
        break
    }
  }

  return enrichedData
}

function calculateSMA(data: any[], params: Record<string, number>) {
  const { period } = params
  return data.map((candle, index) => {
    if (index < period - 1) return { ...candle, sma: null }
    const sum = data.slice(index - period + 1, index + 1).reduce((acc, c) => acc + c.close, 0)
    return { ...candle, sma: sum / period }
  })
}

function calculateEMA(data: any[], params: Record<string, number>) {
  const { period } = params
  const multiplier = 2 / (period + 1)
  
  return data.map((candle, index) => {
    if (index === 0) return { ...candle, ema: candle.close }
    
    const prevEMA = data[index - 1].ema || candle.close
    const ema = (candle.close - prevEMA) * multiplier + prevEMA
    return { ...candle, ema }
  })
}

function calculateRSI(data: any[], params: Record<string, number>) {
  const { period } = params
  
  return data.map((candle, index) => {
    if (index < period) return { ...candle, rsi: null }
    
    const gains = []
    const losses = []
    
    for (let i = index - period + 1; i <= index; i++) {
      const change = data[i].close - data[i - 1].close
      if (change > 0) gains.push(change)
      else losses.push(Math.abs(change))
    }
    
    const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period
    const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period
    
    if (avgLoss === 0) return { ...candle, rsi: 100 }
    
    const rs = avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))
    
    return { ...candle, rsi }
  })
}

function calculateMACD(data: any[], params: Record<string, number>) {
  const { fastPeriod = 12, slowPeriod = 26, signalPeriod = 9 } = params
  
  // First calculate EMAs
  const fastEMA = calculateEMA(data, { period: fastPeriod })
  const slowEMA = calculateEMA(data, { period: slowPeriod })
  
  // Calculate MACD line
  const macdData = data.map((candle, index) => ({
    ...candle,
    macd: (fastEMA[index].ema || 0) - (slowEMA[index].ema || 0)
  }))
  
  // Calculate signal line (EMA of MACD)
  const signalEMA = calculateEMA(macdData.map(d => ({ ...d, close: d.macd })), { period: signalPeriod })
  
  return data.map((candle, index) => ({
    ...candle,
    macd: macdData[index].macd,
    signal: signalEMA[index].ema,
    histogram: macdData[index].macd - (signalEMA[index].ema || 0)
  }))
}

function calculateBollingerBands(data: any[], params: Record<string, number>) {
  const { period = 20, stdDev = 2 } = params
  
  return data.map((candle, index) => {
    if (index < period - 1) return { ...candle, bb_upper: null, bb_middle: null, bb_lower: null }
    
    const slice = data.slice(index - period + 1, index + 1)
    const prices = slice.map(c => c.close)
    const sma = prices.reduce((sum, price) => sum + price, 0) / period
    
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period
    const std = Math.sqrt(variance)
    
    return {
      ...candle,
      bb_upper: sma + (stdDev * std),
      bb_middle: sma,
      bb_lower: sma - (stdDev * std)
    }
  })
}
