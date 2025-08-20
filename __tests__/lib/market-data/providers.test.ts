// Unit tests for MarketDataProvider implementations

import { AlpacaProvider, YahooProvider, MockProvider, FallbackProvider, Quote } from '@/lib/market-data/providers';

describe('MockProvider', () => {
  const mockData: Record<string, Quote> = {
    AAPL: { symbol: 'AAPL', price: 150, timestamp: 1234567890, source: 'mock' },
    TSLA: { symbol: 'TSLA', price: 700, timestamp: 1234567890, source: 'mock' },
  };
  const provider = new MockProvider(mockData);

  it('returns mock quote for known symbol', async () => {
    const quote = await provider.getQuote('AAPL');
    expect(quote).toEqual(mockData.AAPL);
  });

  it('throws for unknown symbol', async () => {
    await expect(provider.getQuote('GOOG')).rejects.toThrow('Symbol not found');
  });
});

describe('FallbackProvider', () => {
  const mock1 = new MockProvider({
    AAPL: { symbol: 'AAPL', price: 100, timestamp: 1, source: 'mock' },
  });
  const mock2 = new MockProvider({
    TSLA: { symbol: 'TSLA', price: 200, timestamp: 2, source: 'mock' },
  });
  const fallback = new FallbackProvider([mock1, mock2]);

  it('returns from first provider if available', async () => {
    const quote = await fallback.getQuote('AAPL');
    expect(quote.price).toBe(100);
  });

  it('falls back to next provider if first fails', async () => {
    const quote = await fallback.getQuote('TSLA');
    expect(quote.price).toBe(200);
  });

  it('throws if all providers fail', async () => {
    await expect(fallback.getQuote('GOOG')).rejects.toThrow('All providers failed');
  });
});
