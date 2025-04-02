import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"
import { getBotExecutionsCollection, getBotsCollection } from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const botExecutionsCollection = await getBotExecutionsCollection()
    const botsCollection = await getBotsCollection()

    // Verify bot ownership and status
    const bot = await botsCollection.findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    if (bot.status !== "active") {
      return NextResponse.json(
        { error: "Bot must be active to record executions" },
        { status: 400 }
      )
    }

    // Add execution with metadata
    const executionData = {
      ...data,
      botId: new ObjectId(params.id),
      timestamp: new Date(),
      status: "pending",
      metadata: {
        signalId: data.signalId ? new ObjectId(data.signalId) : null,
        marketPrice: data.marketPrice || 0,
        marketConditions: data.marketConditions || {},
        executionDelay: data.executionDelay || 0,
        fees: data.fees || 0
      }
    }

    const result = await botExecutionsCollection.insertOne(executionData)

    // Update bot performance metrics
    if (data.type === "trade" && data.result) {
      const { pnl = 0 } = data.result
      await botsCollection.updateOne(
        { _id: new ObjectId(params.id) },
        {
          $inc: {
            "performance.totalTrades": 1,
            "performance.totalPnL": pnl,
            [`performance.${pnl > 0 ? "wins" : "losses"}`]: 1
          },
          $set: {
            "performance.winRate": pnl > 0 
              ? (bot.performance.wins + 1) / (bot.performance.totalTrades + 1) * 100 
              : bot.performance.wins / (bot.performance.totalTrades + 1) * 100
          }
        }
      )
    }

    return NextResponse.json({
      _id: result.insertedId,
      ...executionData
    })
  } catch (error) {
    console.error("Error creating execution:", error)
    return NextResponse.json(
      { error: "Failed to create execution" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = new URL(req.url).searchParams
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = parseInt(searchParams.get("skip") || "0")
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const signalId = searchParams.get("signalId")

    // Build query
    const query: any = { botId: new ObjectId(params.id) }
    if (type) query.type = type
    if (status) query.status = status
    if (signalId) query["metadata.signalId"] = new ObjectId(signalId)
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = new Date(startDate)
      if (endDate) query.timestamp.$lte = new Date(endDate)
    }

    const botExecutionsCollection = await getBotExecutionsCollection()
    
    // Get total count for pagination
    const total = await botExecutionsCollection.countDocuments(query)
    
    // Get executions with pagination
    const executions = await botExecutionsCollection
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Calculate summary statistics
    const stats = await botExecutionsCollection.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalPnL: { $sum: "$result.pnl" },
          avgExecutionDelay: { $avg: "$metadata.executionDelay" },
          totalFees: { $sum: "$metadata.fees" },
          successfulExecutions: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          failedExecutions: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] }
          }
        }
      }
    ]).toArray()

    return NextResponse.json({
      executions,
      stats: stats[0] || null,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit
      }
    })
  } catch (error) {
    console.error("Error fetching executions:", error)
    return NextResponse.json(
      { error: "Failed to fetch executions" },
      { status: 500 }
    )
  }
}

// Update execution status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; executionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const botExecutionsCollection = await getBotExecutionsCollection()

    const result = await botExecutionsCollection.updateOne(
      {
        _id: new ObjectId(params.executionId),
        botId: new ObjectId(params.id)
      },
      {
        $set: {
          status: data.status,
          updated: new Date(),
          ...(data.result && { result: data.result })
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating execution:", error)
    return NextResponse.json(
      { error: "Failed to update execution" },
      { status: 500 }
    )
  }
}

// Delete an execution record
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; executionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botExecutionsCollection = await getBotExecutionsCollection()

    const result = await botExecutionsCollection.deleteOne({
      _id: new ObjectId(params.executionId),
      botId: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting execution:", error)
    return NextResponse.json(
      { error: "Failed to delete execution" },
      { status: 500 }
    )
  }
}