import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ message: "Symbol parameter is required" }, { status: 400 })
    }

    // In a real app, this would call the CoinGecko API
    // For demo purposes, we'll return mock data
    let basePrice = 0

    if (symbol.includes("BTC") || symbol === "BTC-USD") {
      basePrice = 28000 + (Math.random() * 1000 - 500)
    } else if (symbol.includes("ETH") || symbol === "ETH-USD") {
      basePrice = 1800 + (Math.random() * 100 - 50)
    } else {
      basePrice = 100 + (Math.random() * 10 - 5)
    }

    const changePercent = Math.random() * 8 - 4 // -4% to +4%
    const change = basePrice * (changePercent / 100)
    const price = basePrice + change
    const volume = Math.floor(Math.random() * 5000000000) + 1000000000

    return NextResponse.json({
      symbol,
      price,
      change,
      changePercent,
      volume,
      high: price * (1 + Math.random() * 0.03), // 0-3% higher than current
      low: price * (1 - Math.random() * 0.03), // 0-3% lower than current
      open: price * (1 + (Math.random() * 0.02 - 0.01)), // +/- 1% from current
      previousClose: price * (1 + (Math.random() * 0.02 - 0.01)), // +/- 1% from current
      marketCap: undefined, // CoinGecko would provide this, but we'll simulate not having it
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching CoinGecko data:", error)
    return NextResponse.json({ message: "Failed to fetch market data" }, { status: 500 })
  }
}

