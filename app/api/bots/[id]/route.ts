import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"
import {
  getBotsCollection,
  getBotSignalsCollection,
  getBotExecutionsCollection
} from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botsCollection = await getBotsCollection()
    const bot = await botsCollection.findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Get recent signals and executions
    const [botSignalsCollection, botExecutionsCollection] = await Promise.all([
      getBotSignalsCollection(),
      getBotExecutionsCollection()
    ])

    const [recentSignals, recentExecutions] = await Promise.all([
      botSignalsCollection
        .find({ botId: new ObjectId(params.id) })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray(),
      botExecutionsCollection
        .find({ botId: new ObjectId(params.id) })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray()
    ])

    return NextResponse.json({
      ...bot,
      recentSignals,
      recentExecutions
    })
  } catch (error) {
    console.error("Error fetching bot:", error)
    return NextResponse.json(
      { error: "Failed to fetch bot" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const botsCollection = await getBotsCollection()

    // Validate the update data
    if (data.config) {
      const { signals, conditions, actions, riskManagement } = data.config
      if (!signals || !conditions || !actions || !riskManagement) {
        return NextResponse.json(
          { error: "Invalid bot configuration" },
          { status: 400 }
        )
      }
    }

    const result = await botsCollection.updateOne(
      {
        _id: new ObjectId(params.id),
        userId: new ObjectId(session.user.id)
      },
      {
        $set: {
          ...data,
          updated: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // If status is being updated to "active", validate the configuration
    if (data.status === "active") {
      // Perform additional validation and initialization here
      // For example, validate all signals, conditions, and risk parameters
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating bot:", error)
    return NextResponse.json(
      { error: "Failed to update bot" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botsCollection = await getBotsCollection()

    // First, check if the bot exists and is owned by the user
    const bot = await botsCollection.findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // If bot is active, stop it first
    if (bot.status === "active") {
      // Implement bot stopping logic here
      // This might involve cleaning up resources, closing positions, etc.
    }

    // Delete the bot and its related data
    const [botSignalsCollection, botExecutionsCollection] = await Promise.all([
      getBotSignalsCollection(),
      getBotExecutionsCollection()
    ])

    await Promise.all([
      botsCollection.deleteOne({ _id: new ObjectId(params.id) }),
      botSignalsCollection.deleteMany({ botId: new ObjectId(params.id) }),
      botExecutionsCollection.deleteMany({ botId: new ObjectId(params.id) })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bot:", error)
    return NextResponse.json(
      { error: "Failed to delete bot" },
      { status: 500 }
    )
  }
}