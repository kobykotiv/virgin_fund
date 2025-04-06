import type { IndicatorConfig } from "@/lib/backtesting/types"

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

// ... implement other indicator calculations ...
