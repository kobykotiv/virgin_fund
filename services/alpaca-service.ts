"use client"

import { useState, useEffect } from "react"
import { generateDemoPositions } from "@/lib/demo-data"

// Types for Alpaca API responses
export interface AssetData {
  id: string
  symbol: string
  name: string
  exchange: string
  class: string
  status: string
  tradable: boolean
  marginable: boolean
  shortable: boolean
  easy_to_borrow: boolean
}

export interface BarData {
  t: string // timestamp
  o: number // open
  h: number // high
  l: number // low
  c: number // close
  v: number // volume
}

// Mock data for demo purposes
// In a real implementation, this would be replaced with actual API calls
const mockAssets: Record<string, AssetData> = {
  AAPL: {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    class: "us_equity",
    status: "active",
    tradable: true,
    marginable: true,
    shortable: true,
    easy_to_borrow: true,
  },
  MSFT: {
    id: "2",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    class: "us_equity",
    status: "active",
    tradable: true,
    marginable: true,
    shortable: true,
    easy_to_borrow: true,
  },
  GOOGL: {
    id: "3",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    class: "us_equity",
    status: "active",
    tradable: true,
    marginable: true,
    shortable: true,
    easy_to_borrow: true,
  },
  // Add more mock assets as needed
}

// Mock historical data generator
function generateMockBars(symbol: string, days: number): BarData[] {
  const bars: BarData[] = []
  let basePrice = 0

  // Set different base prices for different symbols
  switch (symbol) {
    case "AAPL":
      basePrice = 180
      break
    case "MSFT":
      basePrice = 350
      break
    case "GOOGL":
      basePrice = 140
      break
    case "AMZN":
      basePrice = 170
      break
    case "TSLA":
      basePrice = 240
      break
    case "META":
      basePrice = 450
      break
    case "NVDA":
      basePrice = 800
      break
    case "BTC":
      basePrice = 60000
      break
    case "ETH":
      basePrice = 3000
      break
    default:
      basePrice = 100
  }

  // Generate data points
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Add some randomness to price movements
    const volatility = symbol.includes("BTC") || symbol.includes("ETH") || symbol === "TSLA" ? 0.03 : 0.01
    const change = basePrice * volatility * (Math.random() - 0.5)
    basePrice += change

    const open = basePrice
    const close = basePrice + basePrice * 0.005 * (Math.random() - 0.5)
    const high = Math.max(open, close) + basePrice * 0.01 * Math.random()
    const low = Math.min(open, close) - basePrice * 0.01 * Math.random()
    const volume = Math.floor(100000 + Math.random() * 900000)

    bars.push({
      t: date.toISOString(),
      o: Number.parseFloat(open.toFixed(2)),
      h: Number.parseFloat(high.toFixed(2)),
      l: Number.parseFloat(low.toFixed(2)),
      c: Number.parseFloat(close.toFixed(2)),
      v: volume,
    })
  }

  return bars
}

// Hook to fetch asset data
export function useAssetData(symbol: string) {
  const [data, setData] = useState<AssetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // In a real implementation, this would be an API call
    setTimeout(() => {
      if (mockAssets[symbol]) {
        setData(mockAssets[symbol])
        setLoading(false)
      } else {
        setError(new Error(`Asset data for ${symbol} not found`))
        setLoading(false)
      }
    }, 500)
  }, [symbol])

  return { data, loading, error }
}

// Hook to fetch historical bars
export function useHistoricalBars(symbol: string, timeframe = "day", limit = 30) {
  const [bars, setBars] = useState<BarData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // In a real implementation, this would be an API call
    setTimeout(() => {
      try {
        const mockBars = generateMockBars(symbol, limit)
        setBars(mockBars)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setLoading(false)
      }
    }, 500)
  }, [symbol, timeframe, limit])

  return { bars, loading, error }
}

// Function to get portfolio allocation data
export function getPortfolioAllocation(portfolioId: string) {
  // Get actual positions
  const positions = generateDemoPositions()
  
  // Calculate allocations based on real position values
  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0)
  
  return positions
    .map(pos => ({
      name: pos.symbol,
      value: Number(((pos.value / totalValue) * 100).toFixed(1))
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Show top 8 positions
}

