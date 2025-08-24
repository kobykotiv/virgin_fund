"use client"

import React from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import AllocationPie from "./AllocationPie";
import PerformanceVsBenchmark from "./PerformanceVsBenchmark";
import TradeHistoryTable from "./TradeHistoryTable";

export default function PortfolioDetail({ id }: { id: string }) {
  const { data: portfolio, isLoading, error } = usePortfolio(id);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading portfolio...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading portfolio details...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">Failed to load portfolio: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  if (!portfolio) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Portfolio not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{portfolio.name}</h2>
          {portfolio.description && <p className="text-sm text-muted-foreground">{portfolio.description}</p>}
        </div>

        <div className="text-right">
          <div className="text-lg font-medium">
            {`$${Number(portfolio.valueUsd ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          </div>
          <div className="text-sm mt-1">
            <span className={ (portfolio.dailyChangePct ?? 0) >= 0 ? "text-green-500" : "text-red-500" }>
              {(portfolio.dailyChangePct ?? 0).toFixed(2)}%
            </span>
            <span className="text-muted-foreground ml-3">
              {portfolio.pnlUsd >= 0 ? "+" : "-"}${Math.abs(portfolio.pnlUsd ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Allocation</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <AllocationPie allocation={portfolio.allocation ?? []} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <PerformanceVsBenchmark history={portfolio.history ?? []} />
          <Card>
            <CardHeader>
              <CardTitle>Rebalancing Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.recommendedRebalances && portfolio.recommendedRebalances.length > 0 ? (
                <div className="space-y-2">
                  {portfolio.recommendedRebalances.map((r: any) => (
                    <div key={`${r.symbol}-${r.targetPct}`} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          Current: {r.currentPct}% • Target: {r.targetPct}% • Action: {r.action}
                        </div>
                      </div>
                      <div>
                        <button className="btn btn-sm bg-muted px-3 py-1 rounded">Simulate</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">No rebalancing suggestions available.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <TradeHistoryTable trades={portfolio.trades ?? []} portfolio={portfolio} />
      </div>
    </div>
  );
}
