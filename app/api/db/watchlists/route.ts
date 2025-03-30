import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const db = await connectToDatabase()
    const query = userId ? { userId } : {}
    const watchlists = await db.collection("watchlists").find(query).toArray()
    return NextResponse.json(watchlists)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch watchlists" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const watchlist = await request.json()
    if (!watchlist.name || !watchlist.symbols || !watchlist.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    watchlist.createdAt = new Date()
    const result = await db.collection("watchlists").insertOne(watchlist)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create watchlist" }, { status: 500 })
  }
}
