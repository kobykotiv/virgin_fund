import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get("portfolioId")
    const timeframe = searchParams.get("timeframe")

    const db = await connectToDatabase()
    const query: any = {}
    if (portfolioId) query.portfolioId = portfolioId
    if (timeframe) query.timeframe = timeframe

    const metrics = await db.collection("risk_metrics")
      .find(query)
      .sort({ timestamp: -1 })
      .toArray()

    return NextResponse.json(metrics)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch risk metrics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const metrics = await request.json()
    if (!metrics.portfolioId || !metrics.metrics) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    metrics.timestamp = new Date()
    const result = await db.collection("risk_metrics").insertOne(metrics)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to save risk metrics" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    if (!updateData.portfolioId || !updateData.metrics) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection("risk_metrics").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update risk metrics" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing metrics ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection("risk_metrics").deleteOne({
      _id: new ObjectId(id)
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete risk metrics" }, { status: 500 })
  }
}
