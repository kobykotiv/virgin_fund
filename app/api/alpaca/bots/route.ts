import { NextResponse } from "next/server"
import type { Bot } from "@/types/bot"

// Mock database of bots
const bots: Bot[] = [
  {
    id: "1",
    name: "Tech Basket",
    type: "basket",
    status: "active",
    assets: ["AAPL", "MSFT", "GOOGL", "AMZN"],
    createdAt: "2023-09-15T10:30:00Z",
    updatedAt: "2023-10-20T14:45:00Z",
    performance: {
      totalPnL: 1250.75,
      pnlPercentage: 8.2,
      totalTrades: 24,
      winRate: 0.75,
      lastUpdated: "2023-10-20T14:45:00Z",
    },
    stopLoss: 5,
    takeProfit: 15,
    maxDrawdown: 10,
    basketConfig: {
      rebalancePeriod: "0 0 1 * *", // Monthly rebalance
      targetAllocation: {
        AAPL: 0.3,
        MSFT: 0.3,
        GOOGL: 0.2,
        AMZN: 0.2,
      },
    },
  },
  {
    id: "2",
    name: "BTC Grid Trader",
    type: "grid",
    status: "paused",
    assets: ["BTC-USD"],
    createdAt: "2023-08-10T08:15:00Z",
    updatedAt: "2023-10-18T11:20:00Z",
    performance: {
      totalPnL: -320.5,
      pnlPercentage: -2.1,
      totalTrades: 42,
      winRate: 0.62,
      lastUpdated: "2023-10-18T11:20:00Z",
    },
    stopLoss: 8,
    takeProfit: 12,
    gridConfig: {
      gridSize: 1,
      upperLimit: 35000,
      lowerLimit: 25000,
      quantity: 0.01,
    },
  },
]

export async function GET() {
  return NextResponse.json(bots)
}

export async function POST(request: Request) {
  try {
    const botData = await request.json()

    // Validate required fields
    if (!botData.name || !botData.type || !botData.assets) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create new bot
    const now = new Date().toISOString()
    const newBot: Bot = {
      id: Math.random().toString(36).substring(2, 9),
      name: botData.name,
      type: botData.type,
      status: "paused",
      assets: botData.assets,
      createdAt: now,
      updatedAt: now,
      performance: {
        totalPnL: 0,
        pnlPercentage: 0,
        totalTrades: 0,
        winRate: 0,
        lastUpdated: now,
      },
      stopLoss: botData.stopLoss,
      takeProfit: botData.takeProfit,
      maxDrawdown: botData.maxDrawdown,
      indicatorConfig: botData.indicatorConfig,
      gridConfig: botData.gridConfig,
      dcaConfig: botData.dcaConfig,
      basketConfig: botData.basketConfig,
    }

    bots.push(newBot)

    return NextResponse.json(newBot)
  } catch (error) {
    console.error("Error creating bot:", error)
    return NextResponse.json({ message: "Failed to create bot" }, { status: 500 })
  }
}

