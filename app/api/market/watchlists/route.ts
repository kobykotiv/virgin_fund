import { NextRequest, NextResponse } from 'next/server';
import { marketDataCache } from '@/services/market-data-cache';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function GET(req: NextRequest) {
  // Apply authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;
  
  try {
    const watchlists = await marketDataCache.getWatchlists();
    
    return NextResponse.json({ 
      success: true, 
      data: watchlists 
    });
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch watchlists',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Apply authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;
  
  try {
    const data = await req.json();
    const { name, symbols } = data;
    
    if (!name || !symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { success: false, error: 'Invalid watchlist data' },
        { status: 400 }
      );
    }
    
    const watchlist = await marketDataCache.createWatchlist(name, symbols);
    
    return NextResponse.json({ 
      success: true, 
      data: watchlist 
    });
  } catch (error) {
    console.error('Error creating watchlist:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create watchlist',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
