"use client";
import React from 'react';

type Position = { symbol: string; value: number; pct?: number };

export default function PortfolioOverview({ positions }: { positions?: Position[] }) {
  const rows = (positions && positions.length ? positions : samplePositions()).map(p => ({
    ...p,
    pct: safePct(p.pct)
  }));
  const total = rows.reduce((s, r) => s + r.value, 0) || 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-indigo-300">Portfolio Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Snapshot of your current allocations.</p>
      </header>
      <div className="bg-gray-900 rounded-xl p-5 shadow-lg">
        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="text-left font-medium py-2">Asset</th>
              <th className="text-right font-medium py-2">Value (USD)</th>
              <th className="text-right font-medium py-2">Allocation</th>
            </tr>
          </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.symbol} className="border-t border-gray-800">
                  <td className="py-2 font-medium text-gray-200">{r.symbol}</td>
                  <td className="py-2 text-right tabular-nums">${r.value.toLocaleString()}</td>
                  <td className="py-2 text-right tabular-nums">{safePct(r.pct).toFixed(2)}%</td>
                </tr>
              ))}
              <tr className="border-t border-gray-700 text-gray-300 font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right">${total.toLocaleString()}</td>
                <td className="py-2 text-right">100.00%</td>
              </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
}

function safePct(v: any): number { return typeof v === 'number' && isFinite(v) ? v : 0; }

function samplePositions(): Position[] {
  const base: Position[] = [
    { symbol: 'AAPL', value: 12500 },
    { symbol: 'MSFT', value: 9800 },
    { symbol: 'BTC', value: 15700 },
    { symbol: 'ETH', value: 6200 },
    { symbol: 'CASH', value: 4000 },
  ];
  const total = base.reduce((s,b)=>s+b.value,0) || 1;
  return base.map(b => ({ ...b, pct: (b.value/total)*100 }));
}
