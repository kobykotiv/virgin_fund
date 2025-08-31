"use client"

export interface YahooQuote {
  symbol: string
  shortName?: string
  longName?: string
  regularMarketPrice: number
  regularMarketChange: number
  regularMarketChangePercent: number
  regularMarketVolume: number
  marketCap?: number
  peRatio?: number
  dividendYield?: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  currency: string
}

export interface YahooHistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjClose: number
}

export class YahooFinanceService {
  private baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart'
  private quoteUrl = 'https://query1.finance.yahoo.com/v7/finance/quote'

  async getQuote(symbol: string): Promise<YahooQuote | null> {
    try {
      const response = await fetch(`${this.quoteUrl}?symbols=${symbol}`)

      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.quoteResponse?.result?.[0]) {
        return null
      }

      const quote = data.quoteResponse.result[0]

      return {
        symbol: quote.symbol,
        shortName: quote.shortName,
        longName: quote.longName,
        regularMarketPrice: quote.regularMarketPrice,
        regularMarketChange: quote.regularMarketChange,
        regularMarketChangePercent: quote.regularMarketChangePercent,
        regularMarketVolume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        dividendYield: quote.dividendYield,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        currency: quote.currency,
      }
    } catch (error) {
      console.error('Yahoo Finance quote fetch error:', error)
      return null
    }
  }

  async getQuotes(symbols: string[]): Promise<YahooQuote[]> {
    try {
      const response = await fetch(`${this.quoteUrl}?symbols=${symbols.join(',')}`)

      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.quoteResponse?.result) {
        return []
      }

      return data.quoteResponse.result.map((quote: any) => ({
        symbol: quote.symbol,
        shortName: quote.shortName,
        longName: quote.longName,
        regularMarketPrice: quote.regularMarketPrice,
        regularMarketChange: quote.regularMarketChange,
        regularMarketChangePercent: quote.regularMarketChangePercent,
        regularMarketVolume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        dividendYield: quote.dividendYield,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        currency: quote.currency,
      }))
    } catch (error) {
      console.error('Yahoo Finance quotes fetch error:', error)
      return []
    }
  }

  async getHistoricalData(
    symbol: string,
    period1: number,
    period2: number,
    interval: string = '1d'
  ): Promise<YahooHistoricalData[]> {
    try {
      const url = `${this.baseUrl}/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}&includePrePost=false`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.chart?.result?.[0]) {
        return []
      }

      const result = data.chart.result[0]
      const timestamps = result.timestamp
      const quotes = result.indicators.quote[0]

      if (!timestamps || !quotes) {
        return []
      }

      return timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: quotes.open?.[index] || 0,
        high: quotes.high?.[index] || 0,
        low: quotes.low?.[index] || 0,
        close: quotes.close?.[index] || 0,
        volume: quotes.volume?.[index] || 0,
        adjClose: result.indicators.adjclose?.[0]?.adjclose?.[index] || quotes.close?.[index] || 0,
      })).filter((item: YahooHistoricalData) => item.close > 0)
    } catch (error) {
      console.error('Yahoo Finance historical data fetch error:', error)
      return []
    }
  }

  async getMarketData(symbols: string[]): Promise<Record<string, YahooQuote>> {
    const quotes = await this.getQuotes(symbols)
    const result: Record<string, YahooQuote> = {}

    quotes.forEach(quote => {
      result[quote.symbol] = quote
    })

    return result
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.quoteUrl}?symbols=AAPL`)
      return response.ok
    } catch (error) {
      console.error('Yahoo Finance connection test error:', error)
      return false
    }
  }
}
