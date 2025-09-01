import { NextResponse } from 'next/server'
import { MarketDataService } from '../../../../services/market-data-service'
import { marketDataCache } from '@/services/market-data-cache'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const symbols = url.searchParams.get('symbols')
    
    if (!symbols) {
      return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const apiKey = cookieStore?.get('alpaca_api_key')?.value
    const secretKey = cookieStore?.get('alpaca_secret_key')?.value
    const isPaper = cookieStore?.get('alpaca_is_paper')?.value !== 'false'
    const isDemoMode = cookieStore?.get('is_demo_mode')?.value === 'true'

    // If in demo mode or no API credentials, return mock data
    if (isDemoMode || (!apiKey || !secretKey)) {
      const mockData = generateMockMarketData(symbols.split(','))
      return NextResponse.json({ success: true, data: mockData })
    }

    // Get real market data
    const marketDataService = new MarketDataService(apiKey, secretKey, isPaper)
    const quotes = await marketDataService.getSnapshot(symbols.split(','))
    
    return NextResponse.json({ success: true, data: quotes })
  } catch (error: any) {
    console.error('Error fetching market data:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch market data' 
    }, { status: 500 })
  }
}

// Helper function to generate mock market data
function generateMockMarketData(symbols: string[]) {
  const data: Record<string, any> = {}
  
  symbols.forEach(symbol => {
    // Get a base price for the symbol
    let basePrice = 100
    switch (symbol) {
      case 'AAPL': basePrice = 180; break
      case 'MSFT': basePrice = 350; break
      case 'GOOGL': basePrice = 130; break
      case 'AMZN': basePrice = 140; break
      case 'TSLA': basePrice = 240; break
      case 'BTC-USD': basePrice = 35000; break
      case 'ETH-USD': basePrice = 2000; break
    }
    
    const changePercent = (Math.random() * 6 - 3) // -3% to +3%
    const change = basePrice * (changePercent / 100)
    const price = basePrice + change
    
    data[symbol] = {
      price,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      timestamp: new Date().toISOString()
    }
  })
  
  return data
}

