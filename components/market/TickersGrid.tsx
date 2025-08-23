"use client";

import React, { useState } from "react";
import { useCoinGeckoPrice } from "@/hooks/useCoinGeckoPrice";
import { Chart } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";

const MOCK_SERIES: Record<string, { series: number[] }> = {
  bitcoin: { series: [29000, 29500, 30000, 29800, 30100, 29950, 30050] },
  ethereum: { series: [1750, 1780, 1800, 1790, 1810, 1805, 1808] },
  dogecoin: { series: [0.11, 0.115, 0.12, 0.118, 0.121, 0.119, 0.12] },
};

export default function TickersGrid({ ids = ["bitcoin", "ethereum", "dogecoin"] }: { ids?: string[] }) {
  const { data, isLoading, error } = useCoinGeckoPrice(ids);
  const [selected, setSelected] = useState<string | null>(null);

  const closeModal = () => setSelected(null);

  if (isLoading) return <div className="text-center">Loading tickers...</div>;
  if (error) return <div className="text-center text-red-500">Failed to load tickers</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ids.map((id) => {
          const info = data?.[id];
          return (
            <button
              key={id}
              className="p-4 border rounded-lg text-left hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setSelected(id)}
              aria-label={`Show details for ${id}`}
              type="button"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium capitalize">{id.replace("-", " ")}</div>
                <div className="text-sm text-muted-foreground">CoinGecko</div>
              </div>
              <div className="mt-2 text-xl font-semibold">
                ${info?.usd?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "—"}
              </div>
              <div className="text-sm mt-1">
                24h: {info?.usd_24h_change ? `${info.usd_24h_change.toFixed(2)}%` : "—"} • Vol:{" "}
                {info?.usd_24h_vol ? `$${info.usd_24h_vol.toLocaleString()}` : "—"}
              </div>
            </button>
          );
        })}
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
              ${data?.[selected]?.usd?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "—"}
            </div>
            <div className="mb-4 text-sm">
              24h: {data?.[selected]?.usd_24h_change ? `${data[selected].usd_24h_change.toFixed(2)}%` : "—"} • Vol:{" "}
              {data?.[selected]?.usd_24h_vol ? `$${data[selected].usd_24h_vol.toLocaleString()}` : "—"}
            </div>
            <div className="h-48">
              <Chart>
                {MOCK_SERIES[selected]?.series ? (
                  // Use Recharts primitives inside Chart container
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
// - Added per-ticker detail modal with Recharts chart (mock series).
// - Modal opens on ticker click, is accessible, and can be dismissed.
// - Uses Chart from components/ui/chart.tsx for historical series.
