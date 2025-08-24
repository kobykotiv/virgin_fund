"use client"

import { useState } from "react";
import { usePortfolioList } from "@/hooks/usePortfolio";
import PortfolioList from "./PortfolioList";
import PortfolioDetail from "./PortfolioDetail";

export default function PortfolioExplorer() {
  const { data: portfolios, isLoading, error } = usePortfolioList();
  const [selectedId, setSelectedId] = useState<string | null>(portfolios?.[0]?.id ?? null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-semibold mb-4">Portfolios</h2>
        <PortfolioList
          portfolios={portfolios ?? []}
          loading={isLoading}
          onSelect={(id) => setSelectedId(id)}
          selectedId={selectedId}
        />
      </div>

      <div className="lg:col-span-2">
        {selectedId ? (
          <PortfolioDetail id={selectedId} />
        ) : (
          <div className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground">Select a portfolio to view details and analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
