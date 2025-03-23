import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ message: "Symbol parameter is required" }, { status: 400 })
    }

    // In a real app, this would use the yahoofinance-2 package
    // For demo purposes, we'll return mock data
    const basePrice = getBasePrice(symbol)
    const changePercent = Math.random() * 6 - 3 // -3% to +3%
    const change = basePrice * (changePercent / 100)
    const price = basePrice + change
    const volume = Math.floor(Math.random() * 10000000) + 100000

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error fetching Yahoo Finance data:", error)
    return NextResponse.json({ message: "Failed to fetch market data" }, { status: 500 })
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

