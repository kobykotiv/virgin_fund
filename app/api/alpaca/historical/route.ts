import { NextRequest, NextResponse } from 'next/server';
import { AlpacaClient } from '@/lib/alpaca-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const timeframe = searchParams.get('timeframe') || '1Day';
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const start = searchParams.get('start');
    const end = searchParams.get('end') || new Date().toISOString();
    
    if (!symbol) {
      return NextResponse.json({ 
        success: false, 
        error: 'Symbol parameter is required' 
      }, { status: 400 });
    }
    
    const config = AlpacaClient.getConfig();
    if (!config) {
      return NextResponse.json({ 
        success: false, 
        error: 'No Alpaca configuration found' 
      }, { status: 401 });
    }
    
    let url = `${AlpacaClient.baseUrl}/v2/stocks/${symbol}/bars?timeframe=${timeframe}&limit=${limit}`;
    if (start) url += `&start=${start}`;
    if (end) url += `&end=${end}`;
    
    const response = await fetch(url, {
      headers: {
        'APCA-API-KEY-ID': config.apiKey,
        'APCA-API-SECRET-KEY': config.secretKey,
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json({ success: true, data: data.bars });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
