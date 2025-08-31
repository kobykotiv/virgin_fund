// Market data service to fetch data from multiple sources
import { isDemoMode } from "./demo-service"
import { Position } from "@/types/portfolio"

// Define the market data interface
export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
  marketCap?: number
  timestamp: string
}

// Data sources enum
export enum DataSource {
  ALPACA = "alpaca",
  YAHOO_FINANCE = "yahoo",
  COINGECKO = "coingecko",
  DEMO = "demo",
}

// Cache for market data to avoid excessive API calls
const marketDataCache: Record<string, { data: MarketData; timestamp: number }> = {}
const CACHE_EXPIRY = 15000 // 15 seconds

// Get market data for a symbol
export async function getMarketData(symbol: string, forceRefresh = false): Promise<MarketData> {
  // Check if we're in demo mode
  if (isDemoMode()) {
    return getDemoMarketData(symbol)
  }

  // Check cache first if not forcing refresh
  const cacheKey = symbol.toUpperCase()
  const now = Date.now()
  if (!forceRefresh && marketDataCache[cacheKey] && now - marketDataCache[cacheKey].timestamp < CACHE_EXPIRY) {
    return marketDataCache[cacheKey].data
  }

  // Try Alpaca first
  try {
    const data = await getAlpacaMarketData(symbol)
    // Cache the result
    marketDataCache[cacheKey] = { data, timestamp: now }
    return data
  } catch (error) {
    console.warn(`Alpaca data fetch failed for ${symbol}, trying Yahoo Finance`, error)

    // Try Yahoo Finance as fallback
    try {
      const data = await getYahooFinanceMarketData(symbol)
      // Cache the result
      marketDataCache[cacheKey] = { data, timestamp: now }
      return data
    } catch (yahooError) {
      console.warn(`Yahoo Finance data fetch failed for ${symbol}, trying CoinGecko`, yahooError)

      // Try CoinGecko as a last resort for crypto
      if (symbol.includes("-USD") || symbol.includes("BTC") || symbol.includes("ETH")) {
        try {
          const data = await getCoinGeckoMarketData(symbol)
          // Cache the result
          marketDataCache[cacheKey] = { data, timestamp: now }
          return data
        } catch (geckoError) {
          console.error(`All data sources failed for ${symbol}`, geckoError)
          throw new Error(`Failed to fetch market data for ${symbol} from all sources`)
        }
      } else {
        console.error(`All data sources failed for ${symbol}`, yahooError)
        throw new Error(`Failed to fetch market data for ${symbol} from all sources`)
      }
    }
  }
}

// Get market data for multiple symbols
export async function getMultipleMarketData(symbols: string[]) {
  // Simulate API call for demo
  return symbols.map(symbol => ({
    symbol,
    price: Math.random() * 1000,
    change: Math.random() * 10 - 5,
    changePercent: Math.random() * 10 - 5,
    volume: Math.random() * 1000000,
    open: Math.random() * 1000,
    high: Math.random() * 1000,
    low: Math.random() * 1000,
  }))
}

export async function getMarketDataForPortfolio(positions: Position[]) {
  const symbols = positions.flatMap(pos => 
    pos.assetType === 'basket' 
      ? pos.positions.map(p => p.ticker || '')
      : [pos.ticker || '']
  ).filter(Boolean)

  return getMultipleMarketData(symbols)
}

export async function getMarketDataForPosition(position: Position): Promise<any[]> {
  if (position.assetType === 'basket') {
    const promises = position.positions.map(pos => getMarketDataForPosition(pos))
    return (await Promise.all(promises)).flat()
  }

  try {
    return await getMultipleMarketData([position.ticker || ''])
  } catch (error) {
    console.error(`Error fetching market data for ${position.ticker}:`, error)
    return []
  }
}

// Get market data from Alpaca
async function getAlpacaMarketData(symbol: string): Promise<MarketData> {
  // In a real implementation, this would call the Alpaca API
  // For now, we'll simulate a response
  const response = await fetch(`/api/alpaca/market?symbol=${symbol}`)

  if (!response.ok) {
    throw new Error(`Alpaca API error: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    symbol: data.symbol,
    price: data.price,
    change: data.change,
    changePercent: data.change, // Alpaca returns percent already
    volume: data.volume,
    high: data.high || data.price * 1.02,
    low: data.low || data.price * 0.98,
    open: data.open || data.price * 0.99,
    previousClose: data.previousClose || data.price * 0.995,
    marketCap: data.marketCap,
    timestamp: data.timestamp || new Date().toISOString(),
  }
}

// Get market data from Yahoo Finance
async function getYahooFinanceMarketData(symbol: string): Promise<MarketData> {
  // In a real implementation, this would use the yahoofinance-2 package
  // For now, we'll simulate a response
  const response = await fetch(`/api/yahoo/market?symbol=${symbol}`)

  if (!response.ok) {
    throw new Error(`Yahoo Finance API error: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    symbol: data.symbol,
    price: data.price,
    change: data.changePercent,
    changePercent: data.changePercent,
    volume: data.volume,
    high: data.high,
    low: data.low,
    open: data.open,
    previousClose: data.previousClose,
    marketCap: data.marketCap,
    timestamp: data.timestamp || new Date().toISOString(),
  }
}

// Get market data from CoinGecko
async function getCoinGeckoMarketData(symbol: string): Promise<MarketData> {
  // In a real implementation, this would call the CoinGecko API
  // For now, we'll simulate a response
  const response = await fetch(`/api/coingecko/market?symbol=${symbol}`)

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    symbol: data.symbol,
    price: data.price,
    change: data.change,
    changePercent: data.changePercent,
    volume: data.volume,
    high: data.high,
    low: data.low,
    open: data.open,
    previousClose: data.previousClose,
    marketCap: data.marketCap,
    timestamp: data.timestamp || new Date().toISOString(),
  }
}

// Get demo market data
function getDemoMarketData(symbol: string): MarketData {
  // Generate realistic demo data based on the symbol
  const basePrice = getBasePrice(symbol)
  const changePercent = Math.random() * 6 - 3 // -3% to +3%
  const change = basePrice * (changePercent / 100)
  const price = basePrice + change
  const volume = Math.floor(Math.random() * 10000000) + 100000

  return {
    symbol,
    price,
    change,
    changePercent,
    volume,
    high: price * (1 + Math.random() * 0.02), // 0-2% higher than current
    low: price * (1 - Math.random() * 0.02), // 0-2% lower than current
    open: price * (1 + (Math.random() * 0.02 - 0.01)), // +/- 1% from current
    previousClose: price * (1 + (Math.random() * 0.02 - 0.01)), // +/- 1% from current
    marketCap: symbol === "BTC-USD" || symbol === "ETH-USD" ? undefined : price * getSharesOutstanding(symbol),
    timestamp: new Date().toISOString(),
  }
}

// Helper function to get a base price for a symbol
function getBasePrice(symbol: string): number {
  // Return realistic base prices for common stocks
  switch (symbol) {
    case "AAPL":
      return 180 + (Math.random() * 10 - 5)
    case "MSFT":
      return 350 + (Math.random() * 15 - 7.5)
    case "GOOGL":
      return 130 + (Math.random() * 8 - 4)
    case "AMZN":
      return 140 + (Math.random() * 10 - 5)
    case "TSLA":
      return 240 + (Math.random() * 20 - 10)
    case "META":
      return 320 + (Math.random() * 15 - 7.5)
    case "NVDA":
      return 450 + (Math.random() * 25 - 12.5)
    case "BTC-USD":
      return 28000 + (Math.random() * 1000 - 500)
    case "ETH-USD":
      return 1800 + (Math.random() * 100 - 50)
    case "SPY":
      return 450 + (Math.random() * 5 - 2.5)
    case "QQQ":
      return 380 + (Math.random() * 8 - 4)
    case "VTI":
      return 220 + (Math.random() * 4 - 2)
    default:
      return 100 + (Math.random() * 10 - 5)
  }
}

// Helper function to get shares outstanding for market cap calculation
function getSharesOutstanding(symbol: string): number {
  switch (symbol) {
    case "AAPL":
      return 16_500_000_000
    case "MSFT":
      return 7_500_000_000
    case "GOOGL":
      return 12_800_000_000
    case "AMZN":
      return 10_200_000_000
    case "TSLA":
      return 3_200_000_000
    case "META":
      return 2_600_000_000
    case "NVDA":
      return 2_400_000_000
    case "SPY":
      return 950_000_000
    case "QQQ":
      return 350_000_000
    case "VTI":
      return 1_400_000_000
    default:
      return 1_000_000_000
  }
}

// Fetch historical market data for a symbol
export async function fetchHistoricalData(
  symbol: string,
  timeframe = "1D",
  limit = 30,
): Promise<{ date: string; value: number }[]> {
  // Check if we're in demo mode
  if (isDemoMode()) {
    return getDemoHistoricalData(symbol, timeframe, limit)
  }

  try {
    // In a real implementation, this would call the appropriate API
    const response = await fetch(`/api/alpaca/historical?symbol=${symbol}&timeframe=${timeframe}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.map((item: any) => ({
      date: new Date(item.timestamp).toISOString().split("T")[0],
      value: item.close,
    }))
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}`, error)
    // Return demo data as fallback
    return getDemoHistoricalData(symbol, timeframe, limit)
  }
}

// Generate demo historical data
function getDemoHistoricalData(symbol: string, timeframe: string, limit: number): { date: string; value: number }[] {
  const basePrice = getBasePrice(symbol)
  const result = []
  const now = new Date()

  // Generate data points
  for (let i = limit - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Create some realistic price movement
    const volatility = getVolatility(symbol)
    const trend = getTrend(symbol)
    const randomWalk = (Math.random() - 0.5) * volatility
    const trendFactor = ((trend / 100) * (limit - i)) / limit

    // Calculate price with some randomness but following a trend
    const value = basePrice * (1 + trendFactor + randomWalk)

    result.push({
      date: date.toISOString().split("T")[0],
      value: Number.parseFloat(value.toFixed(2)),
    })
  }

  return result
}

// Helper function to get volatility for a symbol
function getVolatility(symbol: string): number {
  switch (symbol) {
    case "TSLA":
    case "NVDA":
    case "BTC-USD":
    case "ETH-USD":
      return 0.04 // 4% daily volatility for high volatility assets
    case "AAPL":
    case "MSFT":
    case "GOOGL":
    case "AMZN":
      return 0.02 // 2% for medium volatility
    case "SPY":
    case "QQQ":
    case "VTI":
      return 0.01 // 1% for low volatility
    default:
      return 0.025 // 2.5% default
  }
}

// Helper function to get trend for a symbol (percentage over the period)
function getTrend(symbol: string): number {
  switch (symbol) {
    case "NVDA":
    case "MSFT":
      return 15 // 15% uptrend
    case "TSLA":
    case "BTC-USD":
      return -5 // 5% downtrend
    case "AAPL":
    case "GOOGL":
    case "AMZN":
      return 8 // 8% uptrend
    case "ETH-USD":
      return 10 // 10% uptrend
    case "SPY":
    case "QQQ":
    case "VTI":
      return 5 // 5% uptrend
    default:
      return Math.random() * 20 - 10 // Random trend between -10% and +10%
  }
}

// MarketDataService class wrapper
export class MarketDataService {
  async getMultipleQuotes(symbols: string[]): Promise<Record<string, any>> {
    const result: Record<string, any> = {}
    for (const symbol of symbols) {
      try {
        const data = await getMarketData(symbol)
        result[symbol] = {
          symbol: data.symbol,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          volume: data.volume,
          marketCap: data.marketCap,
          lastUpdated: data.timestamp
        }
      } catch (error) {
        console.warn(`Failed to get market data for ${symbol}:`, error)
      }
    }
    return result
  }

  async getNews(symbol?: string): Promise<any[]> {
    // Mock news data
    return [
      {
        title: "Market Update",
        description: "Latest market developments",
        url: "#",
        source: "Financial News",
        publishedAt: new Date().toISOString(),
        symbols: symbol ? [symbol] : []
      }
    ]
  }
}

