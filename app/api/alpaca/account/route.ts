import { NextResponse } from 'next/server'
import { MarketDataService } from '../../../../services/market-data-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Retrieve credentials from secure storage
    // In a real implementation, these would be securely stored, possibly encrypted
    const { apiKey, secretKey, isPaper } = session.user as any
    
    if (!apiKey || !secretKey) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 400 })
    }
    
    const marketDataService = new MarketDataService(apiKey, secretKey, isPaper)
    const account = await marketDataService.getAccount()
    
    return NextResponse.json(account)
  } catch (error: any) {
    console.error('Error fetching account:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
