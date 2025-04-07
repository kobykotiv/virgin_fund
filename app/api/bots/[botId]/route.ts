import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { bots } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function PATCH(
  req: Request,
  { params }: { params: { botId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()
    const bot = await db.query.bots.findFirst({
      where: and(
        eq(bots.id, params.botId),
        eq(bots.userId, userId)
      )
    })

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 })
    }

    const updatedBot = await db
      .update(bots)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(bots.id, params.botId))
      .returning()

    return NextResponse.json(updatedBot[0])
  } catch (error) {
    console.error("Error updating bot:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { botId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const bot = await db.query.bots.findFirst({
      where: and(
        eq(bots.id, params.botId),
        eq(bots.userId, userId)
      )
    })

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 })
    }

    await db.delete(bots).where(eq(bots.id, params.botId))
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting bot:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
