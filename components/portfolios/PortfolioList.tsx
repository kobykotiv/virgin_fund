"use client"

import React from "react";
import { PortfolioSummary } from "@/hooks/usePortfolio";

interface Props {
  portfolios: PortfolioSummary[];
  loading?: boolean;
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

export default function PortfolioList({ portfolios, loading, selectedId, onSelect }: Props) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground">Loading portfolios...</p>
      </div>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground">No portfolios available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {portfolios.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`w-full text-left rounded-lg border p-3 hover:shadow-sm transition ${
            selectedId === p.id ? "ring-2 ring-offset-1 ring-primary/60 bg-muted" : "bg-card"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <span className="text-xs text-muted-foreground">· {p.allocation.length} assets</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {p.allocation.slice(0, 3).map((a) => `${a.symbol}:${a.percent}%`).join(", ")}
                {p.allocation.length > 3 ? ` +${p.allocation.length - 3}` : ""}
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium">{`$${Number(p.valueUsd).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}`}</div>
              <div className="text-xs mt-1">
                <span
                  className={`font-medium ${
                    p.dailyChangePct >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {(p.dailyChangePct || 0).toFixed(2)}%
                </span>
                <span className="text-muted-foreground ml-2">
                  {p.pnlUsd >= 0 ? "+" : "-"}${Math.abs(p.pnlUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
"use client"

import React from "react";
import { PortfolioSummary } from "@/hooks/usePortfolio";

interface Props {
  portfolios: PortfolioSummary[];
  loading?: boolean;
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

export default function PortfolioList({ portfolios, loading, selectedId, onSelect }: Props) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground">Loading portfolios...</p>
      </div>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground">No portfolios available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {portfolios.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`w-full text-left rounded-lg border p-3 hover:shadow-sm transition ${
            selectedId === p.id ? "ring-2 ring-offset-1 ring-primary/60 bg-muted" : "bg-card"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <span className="text-xs text-muted-foreground">· {p.allocation.length} assets</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {p.allocation.slice(0, 3).map((a) => `${a.symbol}:${a.percent}%`).join(", ")}
                {p.allocation.length > 3 ? ` +${p.allocation.length - 3}` : ""}
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium">{`$${Number(p.valueUsd).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}`}</div>
              <div className="text-xs mt-1">
                <span
                  className={`font-medium ${
                    p.dailyChangePct >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {(p.dailyChangePct || 0).toFixed(2)}%
                </span>
                <span className="text-muted-foreground ml-2">
                  {p.pnlUsd >= 0 ? "+" : "-"}${Math.abs(p.pnlUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
