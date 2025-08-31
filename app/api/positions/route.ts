import { NextRequest, NextResponse } from 'next/server';
import { readAlpacaKeys } from '@/lib/server-keys';

export async function GET(request: NextRequest) {
  try {
    const keys = readAlpacaKeys();
    if (!keys) {
      return NextResponse.json({ error: 'Alpaca keys not configured' }, { status: 400 });
    }

    const { keyId, secret } = keys;
    if (!keyId || !secret) {
      return NextResponse.json({ error: 'Alpaca keys incomplete' }, { status: 400 });
    }

    // For now, assume paper trading
    const baseUrl = 'https://paper-api.alpaca.markets';

    const response = await fetch(`${baseUrl}/v2/positions`, {
      headers: {
        'APCA-API-KEY-ID': keyId,
        'APCA-API-SECRET-KEY': secret,
      },
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.status}`);
    }

    const positions = await response.json();
    return NextResponse.json(positions);
  } catch (error) {
    console.error('Error fetching Alpaca positions:', error);
    return NextResponse.json({ error: 'Failed to fetch positions' }, { status: 500 });
  }
}
