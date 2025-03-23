import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ message: "Symbol parameter is required" }, { status: 400 })
    }

    // In a real app, this would fetch data from Alpaca API
    // For demo purposes, we'll return mock data
    const mockPrice = Math.random() * 1000
    const mockChange = Math.random() * 10 - 5

    return NextResponse.json({
      symbol,
      price: mockPrice,
      change: mockChange,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching market data:", error)
    return NextResponse.json({ message: "Failed to fetch market data" }, { status: 500 })
  }
}

