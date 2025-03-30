import { NextResponse } from 'next/server'
import { connectToDatabase, isValidObjectId } from '@/lib/mongodb'
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
    const { portfolioId, platform, message } = data
    
    if (!portfolioId || !platform) {
      return NextResponse.json({ error: "Missing required fields: portfolioId and platform" }, { status: 400 })
    }
    
    if (!isValidObjectId(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID format" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Make sure portfolio is public
    if (!portfolio.sharing?.isPublic) {
      return NextResponse.json({ error: "Portfolio must be public to share" }, { status: 400 })
    }
    
    // Generate share URL
    const shareUrl = generateShareUrl(portfolioId, platform, message)
    
    // Log share action
    await db.collection('share_logs').insertOne({
      portfolioId,
      userId: session.user.id,
      platform,
      message: message || null,
      timestamp: new Date()
    })
    
    // Update portfolio's social data
    if (!portfolio.sharing.socialLinks) {
      portfolio.sharing.socialLinks = {}
    }
    
    portfolio.sharing.socialLinks[platform] = shareUrl
    
    await db.collection('portfolios').updateOne(
      { _id: new ObjectId(portfolioId) },
      { 
        $set: { 
          'sharing.socialLinks': portfolio.sharing.socialLinks,
          updatedAt: new Date()
        },
        $inc: { 'sharing.shareCount': 1 }
      }
    )
    
    return NextResponse.json({
      success: true,
      shareUrl,
      platform
    })
  } catch (error) {
    console.error('Error sharing portfolio:', error)
    return NextResponse.json({ error: "Failed to share portfolio" }, { status: 500 })
  }
}

// Helper function to generate share URLs for different platforms
function generateShareUrl(portfolioId: string, platform: string, message?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://virginfund.example.com'
  const sharePageUrl = `${baseUrl}/shared-portfolio/${portfolioId}`
  const encodedUrl = encodeURIComponent(sharePageUrl)
  const title = encodeURIComponent(message || 'Check out my investment portfolio')
  
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${title}`
    default:
      return sharePageUrl
  }
}
