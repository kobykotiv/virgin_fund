import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

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
      case 'facebook':
        platformData = {
          url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          platform: 'facebook'
        }
        break
      case 'linkedin':
        platformData = {
          url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          platform: 'linkedin'
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
