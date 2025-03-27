import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ message: "Symbol parameter is required" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_ALPACA_KEY_ID
    const secretKey = process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY
    const baseUrl = process.env.NEXT_PUBLIC_ALPACA_BASE_URL

    if (!apiKey || !secretKey || !baseUrl) {
      return NextResponse.json({ message: "API configuration missing" }, { status: 500 })
    }

    // Get latest trade data
    const tradeResponse = await fetch(`${baseUrl}/v2/stocks/${symbol}/trades/latest`, {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey
      }
    })

    if (!tradeResponse.ok) {
      throw new Error(`Failed to fetch trade data: ${tradeResponse.statusText}`)
    }

    const tradeData = await tradeResponse.json()

    // Get snapshot data for additional information
    const snapshotResponse = await fetch(`${baseUrl}/v2/stocks/${symbol}/snapshot`, {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey
      }
    })

    if (!snapshotResponse.ok) {
      throw new Error(`Failed to fetch snapshot data: ${snapshotResponse.statusText}`)
    }

    const snapshotData = await snapshotResponse.json()

    const prevClose = snapshotData.dailyBar?.c || snapshotData.prevDailyBar?.c
    const currentPrice = tradeData.price
    const change = prevClose ? currentPrice - prevClose : 0
    const changePercent = prevClose ? (change / prevClose) * 100 : 0

    return NextResponse.json({
      symbol,
      price: currentPrice,
      change,
      changePercent,
      volume: snapshotData.dailyBar?.v || 0,
      high: snapshotData.dailyBar?.h || currentPrice,
      low: snapshotData.dailyBar?.l || currentPrice,
      open: snapshotData.dailyBar?.o || currentPrice,
      previousClose: prevClose || currentPrice,
      timestamp: tradeData.t
    })
  } catch (error) {
    console.error("Error fetching market data:", error)
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : "Failed to fetch market data" 
    }, { status: 500 })
  }
}

