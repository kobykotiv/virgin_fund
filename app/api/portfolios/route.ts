import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

// Validation schema for portfolio creation
const portfolioSchema = z.object({
  name: z.string().min(1, "Portfolio name is required"),
  description: z.string().optional(),
  strategy: z.string().optional(),
  visibility: z.enum(["private", "public"]).default("private"),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isPublic = searchParams.get("public") === "true"
    
    const db = await connectToDatabase()
    const query = isPublic 
      ? { 'sharing.isPublic': true }
      : { userId: session.user.id }
    
    const portfolios = await db.collection("portfolios")
      .find(query)
      .toArray()
    
    return NextResponse.json(portfolios)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = portfolioSchema.parse(body)
    
    const db = await connectToDatabase()
    
    const portfolio = {
      ...validatedData,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      assets: [],
      sharing: {
        isPublic: validatedData.visibility === "public",
        allowCopy: body.allowCopy || false,
        socialLinks: {}
      }
    }
    
    const result = await db.collection("portfolios").insertOne(portfolio)
    
    return NextResponse.json({
      id: result.insertedId,
      ...portfolio
    })
  } catch (error) {
    console.error("Failed to create portfolio:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    )
  }
}
