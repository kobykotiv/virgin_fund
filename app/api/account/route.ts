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
    // For now, assume paper trading; in future, store isPaper in keys
    const isPaper = true;
    const baseUrl = isPaper ? 'https://paper-api.alpaca.markets' : 'https://api.alpaca.markets';

    const response = await fetch(`${baseUrl}/v2/account`, {
      headers: {
        'APCA-API-KEY-ID': keyId,
        'APCA-API-SECRET-KEY': secret,
      },
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.status}`);
    }

    const account = await response.json();
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error fetching Alpaca account:', error);
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 });
  }
}
