import { NextResponse } from "next/server"
import { AlpacaClient } from "@/lib/alpaca-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ message: "Symbol parameter is required" }, { status: 400 })
    }

    const config = AlpacaClient.getConfig()

    if (config) {
      // Fetch data from Alpaca API
      const url = `${AlpacaClient.baseUrl}/v2/stocks/${symbol}/bars/latest`

      const response = await fetch(url, {
        headers: {
          "APCA-API-KEY-ID": config.apiKey,
          "APCA-API-SECRET-KEY": config.secretKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Alpaca API error: ${response.statusText}`)
      }

      const data = await response.json()

      return NextResponse.json({
        symbol: data.symbol,
        price: data.close,
        change: data.close - data.open,
        volume: data.volume,
        timestamp: new Date(data.timestamp).toISOString(),
        source: "Alpaca",
      })
    } else {
      // For demo purposes, return mock data
      const mockPrice = Math.random() * 1000
      const mockChange = Math.random() * 10 - 5

      return NextResponse.json({
        symbol,
        price: mockPrice,
        change: mockChange,
        volume: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
        source: "Mock",
      })
    }
  } catch (error: any) {
    console.error("Error fetching market data:", error)
    return NextResponse.json({ message: "Failed to fetch market data", error: error.message }, { status: 500 })
  }
}

