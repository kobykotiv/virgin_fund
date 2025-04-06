import { NextResponse } from 'next/server'
import { MarketDataService } from '@/services/market-data'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MarketDataCacheService } from '@/services/market-data-cache'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get query parameters
    const url = new URL(request.url)
    const symbol = url.searchParams.get('symbol')
    const timeframe = url.searchParams.get('timeframe') || '1D'
    const start = url.searchParams.get('start')
    const end = url.searchParams.get('end')
    
    if (!symbol || !start || !end) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }
    
    // Retrieve API credentials from session
    const { apiKey, secretKey, isPaper } = session.user as any
    
    if (!apiKey || !secretKey) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 400 })
    }
    
    // Check cache first
    const cacheService = new MarketDataCacheService()
    const cachedData = await cacheService.getCachedData(symbol, timeframe)
    
    if (cachedData) {
      return NextResponse.json(cachedData)
    }
    
    // Fetch from API if not in cache
    const marketDataService = new MarketDataService(apiKey, secretKey, isPaper)
    const data = await marketDataService.getHistoricalBars(symbol, timeframe, start, end)
    
    // Cache the results
    await cacheService.cacheData(symbol, timeframe, data)
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching market data:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

