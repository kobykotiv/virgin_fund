import { NextRequest, NextResponse } from 'next/server';
import { AlpacaClient } from '@/lib/alpaca-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get('symbols'); // comma-separated symbols
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    if (!symbols) {
      return NextResponse.json({ 
        success: false, 
        error: 'Symbols parameter is required' 
      }, { status: 400 });
    }
    
    const config = AlpacaClient.getConfig();
    if (!config) {
      return NextResponse.json({ 
        success: false, 
        error: 'No Alpaca configuration found' 
      }, { status: 401 });
    }
    
    const symbolsArray = symbols.split(',');
    const url = `${AlpacaClient.baseUrl}/v2/stocks/auctions?symbols=${symbols}&date=${date}`;
    
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
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching auction data:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
