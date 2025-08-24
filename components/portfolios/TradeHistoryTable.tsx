"use client"

import React, { useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { Trade } from "@/hooks/usePortfolio";

/**
 * Utility: convert array of objects to CSV
 */
function toCSV(rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => {
        const v = r[k];
        if (v === null || v === undefined) return "";
        const s = String(v).replace(/"/g, '""');
        return `"${s}"`;
      })
      .join(",")
  );
  return [header, ...lines].join("\n");
}

/**
 * Download helper
 */
function download(filename: string, content: string, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function TradeHistoryTable({ trades, portfolio }: { trades: Trade[]; portfolio: any }) {
  const normalizedTrades = useMemo(
    () =>
      (trades || []).map((t) => ({
        id: t.id,
        timestamp: t.timestamp,
        symbol: t.symbol,
        side: t.side,
        qty: t.qty,
        price: t.price,
        fee: t.fee ?? 0,
      })),
    [trades]
  );

  const exportCSV = () => {
    const csv = toCSV(normalizedTrades);
    download(`${portfolio?.id ?? "portfolio"}-trades.csv`, csv, "text/csv");
  };

  const exportJSON = () => {
    const json = JSON.stringify({ portfolioId: portfolio?.id, takenAt: new Date().toISOString(), trades: normalizedTrades }, null, 2);
    download(`${portfolio?.id ?? "portfolio"}-trades.json`, json, "application/json");
  };

  const snapshot = () => {
    try {
      const key = "vf_portfolio_snapshots";
      const existingRaw = localStorage.getItem(key);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const snapshot = {
        id: `${portfolio?.id ?? "unknown"}@${Date.now()}`,
        portfolioId: portfolio?.id ?? null,
        name: portfolio?.name ?? null,
        takenAt: new Date().toISOString(),
        valueUsd: portfolio?.valueUsd ?? null,
        allocation: portfolio?.allocation ?? null,
        trades: normalizedTrades,
        history: portfolio?.history ?? null,
      };
      localStorage.setItem(key, JSON.stringify([snapshot, ...existing]));
      // simple UI feedback
      alert("Snapshot saved to localStorage (key: vf_portfolio_snapshots)");
    } catch (err) {
      console.error("Snapshot failed", err);
      alert("Failed to create snapshot");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trade History</CardTitle>

          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="btn btn-sm bg-muted px-3 py-1 rounded">Export CSV</button>
            <button onClick={exportJSON} className="btn btn-sm bg-muted px-3 py-1 rounded">Export JSON</button>
            <button onClick={snapshot} className="btn btn-sm bg-primary text-white px-3 py-1 rounded">Snapshot</button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {normalizedTrades.length === 0 ? (
          <div className="text-muted-foreground">No trades available for this portfolio.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="p-2">Time</th>
                  <th className="p-2">Symbol</th>
                  <th className="p-2">Side</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Fee</th>
                </tr>
              </thead>
              <tbody>
                {normalizedTrades.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-2 text-sm">{new Date(t.timestamp).toLocaleString()}</td>
                    <td className="p-2 text-sm font-medium">{t.symbol}</td>
                    <td className={`p-2 text-sm ${t.side === "buy" ? "text-green-600" : "text-red-600"}`}>{t.side}</td>
                    <td className="p-2 text-sm">{t.qty}</td>
                    <td className="p-2 text-sm">${Number(t.price).toFixed(2)}</td>
                    <td className="p-2 text-sm">${Number(t.fee || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
