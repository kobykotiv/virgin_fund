// components/market/TickersGrid.tsx
"use client";

import React, { useState, useEffect } from "react";
import useMarketData from "@/hooks/useMarketData";
import { Chart } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";

const DEFAULT_IDS = ["bitcoin", "ethereum", "dogecoin", "BTCUSD", "ETHUSD"];

const MOCK_SERIES: Record<string, { series: number[] }> = {
  bitcoin: { series: [29000, 29500, 30000, 29800, 30100, 29950, 30050] },
  ethereum: { series: [1750, 1780, 1800, 1790, 1810, 1805, 1808] },
  dogecoin: { series: [0.11, 0.115, 0.12, 0.118, 0.121, 0.119, 0.12] },
  BTCUSD: { series: [29000, 29500, 30000, 29800, 30100, 29950, 30050] },
  ETHUSD: { series: [1750, 1780, 1800, 1790, 1810, 1805, 1808] },
};

export default function TickersGrid({ ids = DEFAULT_IDS }: { ids?: string[] }) {
  const { data, isLoading, error } = useMarketData(
    ids.filter((id) => id === id.toLowerCase()),
    ids.filter((id) => id === id.toUpperCase())
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [wsPrices, setWsPrices] = useState<Record<string, number>>({});

  // Live WS relay for Alpaca
  useEffect(() => {
    if (typeof window === "undefined") return;
    let ws: WebSocket | null = null;
    let es: EventSource | null = null;

    const alpacaSymbols = ids.filter((id) => id === id.toUpperCase());

    // Try EventSource (SSE) first
    try {
      es = new EventSource(`/api/market-data/alpaca/stream?symbols=${encodeURIComponent(alpacaSymbols.join(","))}`);
      es.addEventListener("message", (ev) => {
        try {
          const parsed = JSON.parse(ev.data);
          if (parsed?.type === "prices" && Array.isArray(parsed.payload)) {
            setWsPrices((prev) => {
              const next = { ...prev };
              for (const p of parsed.payload) {
                if (p?.symbol && p?.price != null) next[p.symbol] = Number(p.price);
              }
              return next;
            });
          }
        } catch {
          // ignore
        }
      });
      es.addEventListener("error", () => {
        // fall back to WS
        es?.close();
        es = null;
      });
    } catch {
      es = null;
    }

    // If SSE unavailable, try local WS relay (dev)
    if (!es) {
      try {
        ws = new WebSocket("ws://localhost:8080");
        ws.addEventListener("open", () => {
          ws?.send(JSON.stringify({ type: "subscribe", symbols: alpacaSymbols }));
        });
        ws.addEventListener("message", (ev) => {
          try {
            const data = JSON.parse(ev.data);
            const arr = Array.isArray(data) ? data : [data];
            for (const msg of arr) {
              const symbol = msg.S ?? msg.symbol ?? msg.s;
              const price = msg.p ?? msg.price ?? msg.last;
              if (symbol && price != null) {
                setWsPrices((prev) => ({ ...prev, [symbol]: Number(price) }));
              }
            }
          } catch {
            // ignore parse errors
          }
        });
      } catch {
        // ignore if no relay
      }
    }

    return () => {
      es?.close();
      ws?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  const closeModal = () => setSelected(null);

  if (isLoading) return <div className="text-center">Loading tickers...</div>;
  if (error) return <div className="text-center text-red-500">Failed to load tickers</div>;

  // Merge WS prices into tickers (prefer WS for Alpaca symbols)
  const tickers = Object.values(data ?? {}).map((ticker) =>
    ticker.symbol in wsPrices
      ? { ...ticker, price: wsPrices[ticker.symbol], source: "alpaca" }
      : ticker
  );

  // Remove duplicates based on symbol to prevent React key errors
  const uniqueTickers = tickers.filter((ticker, index, self) => 
    index === self.findIndex(t => t.symbol === ticker.symbol)
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {uniqueTickers.map((ticker) => (
          <button
            key={ticker.symbol}
            className="p-4 border rounded-lg text-left hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setSelected(ticker.symbol)}
            aria-label={`Show details for ${ticker.symbol}`}
            type="button"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium capitalize">{ticker.symbol.replace("-", " ")}</div>
              <div className="text-sm text-muted-foreground">{ticker.source}</div>
            </div>
            <div className="mt-2 text-xl font-semibold">
              ${ticker.price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "—"}
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={closeModal}
        >
          <div
            className="bg-background rounded-lg shadow-xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={closeModal}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <div className="mb-2 text-lg font-bold capitalize">{selected.replace("-", " ")}</div>
            <div className="mb-2 text-xl font-semibold">
              ${tickers.find(t => t.symbol === selected)?.price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "—"}
            </div>
            <div className="mb-4 text-sm">
              Source: {tickers.find(t => t.symbol === selected)?.source ?? "—"}
            </div>
            <div className="h-48">
              <Chart>
                {MOCK_SERIES[selected]?.series ? (
                  <LineChart
                    width={320}
                    height={160}
                    data={MOCK_SERIES[selected].series.map((v, i) => ({ x: i, y: v }))}
                  >
                    <XAxis dataKey="x" hide />
                    <YAxis domain={["auto", "auto"]} hide />
                    <Line type="monotone" dataKey="y" stroke="#06b6d4" dot={false} strokeWidth={2} />
                  </LineChart>
                ) : (
                  <div className="text-xs text-muted-foreground">No history</div>
                )}
              </Chart>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Summary of Changes:
// - TickersGrid now merges live Alpaca WS prices into tickers.
// - WS prices take precedence for Alpaca symbols.
// - UI and modal remain unchanged for user experience.
// - Added duplicate filtering to prevent React key errors in TickersGrid.
