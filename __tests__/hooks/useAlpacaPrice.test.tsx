// __tests__/hooks/useAlpacaPrice.test.tsx

import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { useAlpacaPrice } from "@/hooks/useAlpacaPrice";

// Mock fetch for /api/market-data
global.fetch = vi.fn((url) =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          BTCUSD: { price: 30010, source: "alpaca" },
          ETHUSD: { price: 1800, source: "alpaca" },
        },
      }),
  })
) as any;

describe("useAlpacaPrice", () => {
  const wrapper = ({ children }: any) => {
    const qc = new QueryClient();
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };

  it("fetches and returns Alpaca prices from backend", async () => {
    const { result } = renderHook(() => useAlpacaPrice(["BTCUSD", "ETHUSD"]), { wrapper });
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.data.BTCUSD.price).toBe(30010);
      expect(result.current.data.ETHUSD.price).toBe(1800);
    });
  });

  it("returns empty object if no symbols provided", async () => {
    const { result } = renderHook(() => useAlpacaPrice([]), { wrapper });
    await waitFor(() => {
      expect(result.current.data).toEqual({});
    });
  });
});

// Summary of Changes:
// - Added test for useAlpacaPrice to mock /api/market-data fetch and verify returned prices.
// - Covers empty symbol case and normal fetch case.
