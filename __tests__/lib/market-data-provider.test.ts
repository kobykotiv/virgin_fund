// __tests__/lib/market-data-provider.test.ts

import { FallbackProvider, MockProvider, Quote } from "../../providers/market-data-provider";

describe("FallbackProvider", () => {
  const mockQuote: Quote = {
    symbol: "AAPL",
    price: 150,
    timestamp: Date.now(),
    source: "mock"
  };

  it("returns data from the first successful provider", async () => {
    const provider = new FallbackProvider([
      new MockProvider({ AAPL: mockQuote }),
      new MockProvider({})
    ]);
    const quote = await provider.getQuote("AAPL");
    expect(quote).toEqual(mockQuote);
  });

  it("falls back to the next provider on failure", async () => {
    const provider = new FallbackProvider([
      new MockProvider({}),
      new MockProvider({ AAPL: mockQuote })
    ]);
    const quote = await provider.getQuote("AAPL");
    expect(quote).toEqual(mockQuote);
  });

  it("throws if all providers fail", async () => {
    const provider = new FallbackProvider([
      new MockProvider({}),
      new MockProvider({})
    ]);
    await expect(provider.getQuote("AAPL")).rejects.toThrow("All providers failed");
  });
});
