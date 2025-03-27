import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const timeframe = searchParams.get("timeframe") || "1D"
    const limit = parseInt(searchParams.get("limit") || "30")

    if (!symbol) {
      return NextResponse.json({ message: "Symbol parameter is required" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_ALPACA_KEY_ID
    const secretKey = process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY
    const baseUrl = process.env.NEXT_PUBLIC_ALPACA_BASE_URL

    if (!apiKey || !secretKey || !baseUrl) {
      return NextResponse.json({ message: "API configuration missing" }, { status: 500 })
    }

    // Convert timeframe to Alpaca format
    const timeframeMap: Record<string, string> = {
      "1D": "1Day",
      "1H": "1Hour",
      "15M": "15Min",
      "5M": "5Min",
      "1M": "1Min"
    }

    const alpacaTimeframe = timeframeMap[timeframe] || "1Day"
    
    // Calculate start and end dates
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - limit)

    // Get bars data
    const barsResponse = await fetch(
      `${baseUrl}/v2/stocks/${symbol}/bars?start=${start.toISOString()}&end=${end.toISOString()}&timeframe=${alpacaTimeframe}`, 
      {
        headers: {
          'APCA-API-KEY-ID': apiKey,
          'APCA-API-SECRET-KEY': secretKey
        }
      }
    )

    if (!barsResponse.ok) {
      throw new Error(`Failed to fetch bars data: ${barsResponse.statusText}`)
    }

    const barsData = await barsResponse.json()

    // Transform the data to the expected format
    const historicalData = barsData.bars.map((bar: any) => ({
      date: new Date(bar.t).toISOString().split('T')[0],
      value: bar.c,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      volume: bar.v
    }))

    return NextResponse.json(historicalData)
  } catch (error) {
    console.error("Error fetching historical data:", error)
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : "Failed to fetch historical data" 
    }, { status: 500 })
  }
}