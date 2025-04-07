import { NextRequest, NextResponse } from 'next/server';
import { AlpacaClient } from '@/lib/alpaca-client';

// Get a specific watchlist
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const config = AlpacaClient.getConfig();
    
    if (!config) {
      return NextResponse.json({ 
        success: false, 
        error: 'No Alpaca configuration found' 
      }, { status: 401 });
    }
    
    const response = await fetch(`${AlpacaClient.baseUrl}/v2/watchlists/${id}`, {
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
    console.error(`Error fetching watchlist ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Update a watchlist
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const config = AlpacaClient.getConfig();
    
    if (!config) {
      return NextResponse.json({ 
        success: false, 
        error: 'No Alpaca configuration found' 
      }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, symbols } = body;
    const payload = {};
    
    if (name) payload['name'] = name;
    if (symbols) payload['symbols'] = symbols;
    
    const response = await fetch(`${AlpacaClient.baseUrl}/v2/watchlists/${id}`, {
      method: 'PUT',
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
    console.error(`Error updating watchlist ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Delete a watchlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const config = AlpacaClient.getConfig();
    
    if (!config) {
      return NextResponse.json({ 
        success: false, 
        error: 'No Alpaca configuration found' 
      }, { status: 401 });
    }
    
    const response = await fetch(`${AlpacaClient.baseUrl}/v2/watchlists/${id}`, {
      method: 'DELETE',
      headers: {
        'APCA-API-KEY-ID': config.apiKey,
        'APCA-API-SECRET-KEY': config.secretKey,
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting watchlist ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
