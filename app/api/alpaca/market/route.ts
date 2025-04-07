import { NextResponse } from 'next/server'
import { MarketDataService } from '@/services/market-data'
import { MarketDataCacheService } from '@/services/market-data-cache'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const symbol = url.searchParams.get('symbol')
    const timeframe = url.searchParams.get('timeframe') || '1D'
    const start = url.searchParams.get('start')
    const end = url.searchParams.get('end')
    
    if (!symbol || !start || !end) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }
    
    // Extract API credentials from cookies or headers
    const cookieStore = cookies()
    const apiKey = cookieStore.get('alpaca_api_key')?.value
    const secretKey = cookieStore.get('alpaca_secret_key')?.value
    const isPaper = cookieStore.get('alpaca_is_paper')?.value !== 'false'
    
    // If no cookies, try to get from headers
    const headers = new Headers(request.headers)
    const authApiKey = headers.get('X-Alpaca-API-Key')
    const authSecretKey = headers.get('X-Alpaca-API-Secret')
    
    const effectiveApiKey = apiKey || authApiKey
    const effectiveSecretKey = secretKey || authSecretKey
    
    // Check if in demo mode or if we have valid credentials
    const isDemoMode = cookieStore.get('is_demo_mode')?.value === 'true'
    
    if (!effectiveApiKey || !effectiveSecretKey) {
      if (!isDemoMode) {
        return NextResponse.json({ error: 'API credentials not configured' }, { status: 401 })
      }
      
      // For demo mode, return mock data
      return NextResponse.json(generateMockMarketData(start, end, timeframe))
    }
    
    // Check cache first
    const cacheService = new MarketDataCacheService()
    const cachedData = await cacheService.getCachedData(symbol, timeframe)
    
    if (cachedData) {
      return NextResponse.json(cachedData)
    }
    
    // Fetch from API if not in cache
    const marketDataService = new MarketDataService(effectiveApiKey, effectiveSecretKey, isPaper)
    const data = await marketDataService.getHistoricalBars(symbol, timeframe, start, end)
    
    // Cache the results
    await cacheService.cacheData(symbol, timeframe, data)
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching market data:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Helper function to generate mock market data
function generateMockMarketData(startDate: string, endDate: string, timeframe: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const data = []
  let currentDate = new Date(start)
  let price = 100 + Math.random() * 50 // Random starting price
  
  while (currentDate <= end) {
    // Skip weekends for daily data
    const day = currentDate.getDay()
    if (timeframe === '1D' && (day === 0 || day === 6)) {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
      continue
    }
    
    // Random daily change (-2% to +2%)
    const change = (Math.random() - 0.5) * 4
    const open = price
    const close = price * (1 + change / 100)
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    const volume = Math.floor(Math.random() * 1000000) + 500000
    
    data.push({
      t: currentDate.toISOString(),
      o: open,
      h: high,
      l: low,
      c: close,
      v: volume
    })
    
    price = close
    
    // Increment date based on timeframe
    switch (timeframe) {
      case '1Min':
        currentDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + 1))
        break
      case '5Min':
        currentDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + 5))
        break
      case '15Min':
        currentDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + 15))
        break
      case '1H':
        currentDate = new Date(currentDate.setHours(currentDate.getHours() + 1))
        break
      case '1D':
      default:
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
    }
  }
  
  return data
}

