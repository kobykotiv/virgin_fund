import { NextRequest, NextResponse } from 'next/server';
import { AlpacaClient } from '@/lib/alpaca-client';

// Get all watchlists
export async function GET(request: NextRequest) {
  try {
    const config = AlpacaClient.getConfig();
    if (!config) {
      return NextResponse.json({ 
        success: false, 
        error: 'No Alpaca configuration found' 
      }, { status: 401 });
    }
    
    const response = await fetch(`${AlpacaClient.baseUrl}/v2/watchlists`, {
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
    console.error('Error fetching watchlists:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Create a new watchlist
export async function POST(request: NextRequest) {
  try {
    const config = AlpacaClient.getConfig();
    if (!config) {
      return NextResponse.json({ 
        success: false, 
        error: 'No Alpaca configuration found' 
      }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, symbols } = body;
    
    if (!name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Watchlist name is required' 
      }, { status: 400 });
    }
    
    const payload = { name, symbols: symbols || [] };
    
    const response = await fetch(`${AlpacaClient.baseUrl}/v2/watchlists`, {
      method: 'POST',
      headers: {
        'APCA-API-KEY-ID': config.apiKey,
        'APCA-API-SECRET-KEY': config.secretKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating watchlist:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
