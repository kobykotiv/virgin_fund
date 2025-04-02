import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"
import { getBotsCollection } from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

interface Bot {
  _id?: ObjectId
  userId: string
  name: string
  type: string
  description?: string
  config: {
    signals: any[]
    conditions: any[]
    actions: any[]
    riskManagement: {
      maxPositionSize: number
      stopLoss?: number
      takeProfit?: number
      maxDrawdown?: number
      trailingStop?: boolean
      trailingStopDistance?: number
      maxOpenTrades?: number
      leverageEnabled?: boolean
      maxLeverage?: number
      marginCallLevel?: number
      rebalanceThreshold?: number
    }
  }
  status: "active" | "paused" | "stopped"
  createdAt: Date
  updatedAt: Date
  lastRunAt?: Date
  performance?: {
    totalTrades: number
    winningTrades: number
    losingTrades: number
    winRate: number
    totalPnL: number
    maxDrawdown: number
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const botData = await req.json()
    const botsCollection = await getBotsCollection()

    // Add metadata
    const bot = {
      ...botData,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "inactive",
      performance: {
        totalTrades: 0,
        winRate: 0,
        profitLoss: 0,
        drawdown: 0
      }
    }

    // Insert bot
    const result = await botsCollection.insertOne(bot)

    return NextResponse.json({
      success: true,
      botId: result.insertedId.toString()
    })
  } catch (error) {
    console.error("Bot creation error:", error)
    return NextResponse.json(
      { error: "Failed to create bot" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botsCollection = await getBotsCollection()

    // Get all bots for the current user
    const bots = await botsCollection
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(bots)
  } catch (error) {
    console.error("Error fetching bots:", error)
    return NextResponse.json(
      { error: "Failed to fetch bots" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { id, ...updates } = data

    if (!id) {
      return NextResponse.json(
        { error: "Bot ID is required" },
        { status: 400 }
      )
    }

    const botsCollection = await getBotsCollection()

    // Check if bot exists and belongs to user
    const bot = await botsCollection.findOne({
      _id: new ObjectId(id),
      userId: session.user.id
    })

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found" },
        { status: 404 }
      )
    }

    // Update bot
    await botsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating bot:", error)
    return NextResponse.json(
      { error: "Failed to update bot" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Bot ID is required" },
        { status: 400 }
      )
    }

    const botsCollection = await getBotsCollection()

    // Check if bot exists and belongs to user
    const bot = await botsCollection.findOne({
      _id: new ObjectId(id),
      userId: session.user.id
    })

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found" },
        { status: 404 }
      )
    }

    // Delete bot
    await botsCollection.deleteOne({
      _id: new ObjectId(id)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bot:", error)
    return NextResponse.json(
      { error: "Failed to delete bot" },
      { status: 500 }
    )
  }
}