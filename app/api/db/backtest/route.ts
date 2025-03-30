import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const strategyId = searchParams.get("strategyId")
    const symbol = searchParams.get("symbol")

    const db = await connectToDatabase()
    const query: any = {}
    if (strategyId) query.strategyId = strategyId
    if (symbol) query.symbol = symbol

    const results = await db.collection("backtest_results").find(query).toArray()
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch backtest results" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const result = await request.json()
    if (!result.strategyId || !result.metrics) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    result.timestamp = new Date()
    const dbResult = await db.collection("backtest_results").insertOne(result)
    return NextResponse.json(dbResult)
  } catch (error) {
    return NextResponse.json({ error: "Failed to save backtest result" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    if (!updateData.strategyId || !updateData.metrics) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection("backtest_results").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update backtest result" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing backtest result ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection("backtest_results").deleteOne({
      _id: new ObjectId(id)
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete backtest result" }, { status: 500 })
  }
}
