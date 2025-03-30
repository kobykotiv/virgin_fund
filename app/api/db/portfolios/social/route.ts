import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.json()
    if (!data.portfolioId || !data.platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(data.portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Make sure portfolio is public
    if (!portfolio.sharing || !portfolio.sharing.isPublic) {
      return NextResponse.json({ error: "Portfolio must be public to share" }, { status: 400 })
    }
    
    // Generate share link and social share data based on platform
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://virginfund.example.com'
    const shareUrl = `${appUrl}/shared-portfolio/${data.portfolioId}`
    
    let platformData = {}
    switch (data.platform) {
      case 'twitter':
        platformData = {
          url: `https://twitter.com/intent/tweet?text=Check%20out%20my%20investment%20portfolio&url=${encodeURIComponent(shareUrl)}`,
          platform: 'twitter'
        }
        break
      case 'telegram':
        platformData = {
          url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20my%20investment%20portfolio`,
          platform: 'telegram'
        }
        break
      case 'discord':
        platformData = {
          url: shareUrl,
          platform: 'discord',
          message: 'Check out my investment portfolio!'
        }
        break
      default:
        platformData = {
          url: shareUrl,
          platform: data.platform
        }
    }
    
    // Log the share action
    await db.collection('portfolio_shares').insertOne({
      portfolioId: data.portfolioId,
      userId: session.user.id,
      platform: data.platform,
      timestamp: new Date()
    })
    
    // Update the portfolio's social links
    if (!portfolio.sharing.socialLinks) {
      portfolio.sharing.socialLinks = {}
    }
    
    portfolio.sharing.socialLinks[data.platform] = shareUrl
    
    await db.collection('portfolios').updateOne(
      { _id: new ObjectId(data.portfolioId) },
      { $set: { 
        'sharing.socialLinks': portfolio.sharing.socialLinks,
        updatedAt: new Date()
      }}
    )
    
    return NextResponse.json({
      success: true,
      shareUrl,
      ...platformData
    })
  } catch (error) {
    console.error('Error sharing portfolio:', error)
    return NextResponse.json({ error: "Failed to share portfolio" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')
    
    if (!portfolioId) {
      return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Get public portfolio data
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(portfolioId),
      'sharing.isPublic': true
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or is not public" }, { status: 404 })
    }
    
    // Get share statistics
    const shareStats = await db.collection('portfolio_shares')
      .aggregate([
        { $match: { portfolioId } },
        { $group: { 
          _id: '$platform', 
          count: { $sum: 1 } 
        }}
      ])
      .toArray()
    
    // Format stats as an object
    const shareCount = shareStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {} as Record<string, number>)
    
    // Get assets
    const assets = await db.collection('portfolio_assets')
      .find({ portfolioId })
      .toArray()
    
    // Remove sensitive data
    delete portfolio.userId
    
    return NextResponse.json({
      portfolio,
      assets,
      shareCount,
      shareLinks: portfolio.sharing.socialLinks || {}
    })
  } catch (error) {
    console.error('Error getting portfolio share info:', error)
    return NextResponse.json({ error: "Failed to get portfolio share info" }, { status: 500 })
  }
}
