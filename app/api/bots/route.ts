import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()
    const bot = await prisma.bot.create({
      data: {
        name: data.name,
        config: data,
        userId: session.user.id,
        strategyId: data.rules[0]?.action.strategyId || "",
      }
    })

    return NextResponse.json(bot)
  } catch (error) {
    console.error("Error creating bot:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const bots = await prisma.bot.findMany({
      where: { userId: session.user.id },
      include: { strategy: true }
    })

    return NextResponse.json(bots)
  } catch (error) {
    console.error("Error fetching bots:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
