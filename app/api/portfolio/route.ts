// Portfolio API Route
import { NextRequest, NextResponse } from 'next/server';
import { AlpacaProvider, YahooProvider, MockProvider, FallbackProvider } from '@/lib/market-data/providers';

export async function POST(req: NextRequest) {
  try {
    const { credentials, symbols } = await req.json();

    // Setup providers: Alpaca (if credentials), Yahoo, Mock
    const providers = [];
    if (credentials?.keyId && credentials?.secretKey) {
      providers.push(new AlpacaProvider({
        keyId: credentials.keyId,
        secretKey: credentials.secretKey,
        paper: credentials.paper || false,
      }));
    }
    providers.push(new YahooProvider());
    providers.push(new MockProvider({}));

    const provider = new FallbackProvider(providers);

    // Fetch quotes for all symbols
    const results: Record<string, any> = {};
    for (const symbol of symbols || []) {
      try {
        results[symbol] = await provider.getQuote(symbol);
      } catch (e) {
        results[symbol] = { error: (e as Error).message };
      }
    }

    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
