import { NextRequest, NextResponse } from 'next/server';
import { marketDataCache } from '@/services/market-data-cache';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const timeframe = searchParams.get('timeframe') || '1Day';
    const start = searchParams.get('start') || 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const end = searchParams.get('end') || new Date().toISOString();

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    const marketData = await marketDataCache.getMarketData(symbol, timeframe, start, end);
    
    return NextResponse.json({ 
      success: true, 
      data: marketData 
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch market data',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
