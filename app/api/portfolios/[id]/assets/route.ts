import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

// Validation schema for assets
const assetSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  quantity: z.number().positive("Quantity must be positive"),
  averagePrice: z.number().positive("Price must be positive"),
  holdingType: z.enum(["long", "short", "option", "crypto"]).default("long"),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Fetch all assets in this portfolio
    const assets = await db.collection('portfolio_assets')
      .find({ portfolioId: params.id })
      .toArray()
    
    return NextResponse.json(assets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = assetSchema.parse(body)
    
    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Create the asset
    const asset = {
      ...validatedData,
      portfolioId: params.id,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const result = await db.collection('portfolio_assets').insertOne(asset)
    
    // Update asset count in portfolio
    await db.collection('portfolios').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $inc: { assetCount: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    return NextResponse.json({
      id: result.insertedId,
      ...asset
    })
  } catch (error) {
    console.error('Error adding asset:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to add asset" },
      { status: 500 }
    )
  }
}
