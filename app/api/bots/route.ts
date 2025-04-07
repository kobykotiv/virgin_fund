import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { bots } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { Bot } from "@/types/bot"

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()
    const bot = await db.insert(bots).values({
      ...data,
      userId
    }).returning()

    return NextResponse.json(bot[0])
  } catch (error) {
    console.error("Error creating bot:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userBots = await db.query.bots.findMany({
      where: eq(bots.userId, userId),
      orderBy: [bots.createdAt]
    })

    return NextResponse.json(userBots)
  } catch (error) {
    console.error("Error fetching bots:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
