import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { positions, bots } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(
  req: Request,
  { params }: { params: { botId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify bot ownership
    const bot = await db.query.bots.findFirst({
      where: and(
        eq(bots.id, params.botId),
        eq(bots.userId, userId)
      )
    })

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 })
    }

    const data = await req.json()
    const position = await db.insert(positions).values({
      ...data,
      botId: params.botId
    }).returning()

    return NextResponse.json(position[0])
  } catch (error) {
    console.error("Error creating position:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { botId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const botPositions = await db.query.positions.findMany({
      where: eq(positions.botId, params.botId)
    })

    return NextResponse.json(botPositions)
  } catch (error) {
    console.error("Error fetching positions:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
