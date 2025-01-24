import React, { useState } from "react";
import { BacktestResults } from "./BacktestResults";
import { BacktestError } from "./BacktestError";
import BeginningBacktest from "./BeginningBacktest";
import { runBacktest } from "@/lib/services/backtest";
import { BacktestParams, BacktestResult, DCAPosition } from "@/types/backtest";
import { useNavigate, useLocation } from "react-router-dom";
import { calculateDCA, type Position } from "@/lib/strategies/dcaStrategy";
import type { Strategy } from "@/types/strategy";

// Interface for backtest request
interface ExtendedBacktestParams extends BacktestParams {
  positions?: DCAPosition[];
}

export function Backtest() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { strategy, riskManagement } = location.state || {};

  const convertPositionToDCA = (position: Position, totalInvested: number): DCAPosition => {
    const totalValue = position.assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalShares = position.assets.reduce((sum, asset) => sum + asset.shares, 0);
    const fractionalShares = position.assets.reduce((sum, asset) => sum + (asset.shares % 1), 0);

    return {
      date: position.date,
      price: position.assets[0].value / position.assets[0].shares, // Using first asset's price as reference
      shares: totalShares,
      value: totalValue,
      totalShares: totalShares,
      totalValue: totalValue,
      totalInvested,
      fractionalShares,
      allocation: position.assets.map(asset => ({
        symbol: asset.symbol,
        ratio: asset.ratio,
        shares: asset.shares,
        value: asset.value
      }))
    };
  };

  const handleSubmit = async (data: BacktestParams) => {
    try {
      setIsLoading(true);
      
      // Calculate DCA positions
      const dcaResults = calculateDCA({
        frequency: data.frequency,
        assets: data.tickers.map(symbol => ({
          symbol,
          ratio: 100 / data.tickers.length, // Equal weight distribution
          value: data.investmentAmount * (data.riskManagement.positionSize / 100)
        })),
        startDate: data.startDate,
        endDate: data.endDate,
        rebalanceFrequency: data.rebalanceFrequency,
        rebalanceThreshold: data.rebalanceThreshold
      });

      const totalInvested = data.investmentAmount * dcaResults.length;

      // Run backtest with DCA positions
      const backtestResults = await runBacktest({
        ...data,
        positions: dcaResults.map(position => 
          convertPositionToDCA(position, totalInvested)
        )
      } as ExtendedBacktestParams);

      setResults(backtestResults);
    } catch (error) {
      console.error("Backtest error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetest = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error ? (
        <BacktestError error={error} onRetry={handleRetest} />
      ) : results ? (
        <BacktestResults
          results={results}
          strategy={strategy}
          onRetest={handleRetest}
        />
      ) : (
        <BeginningBacktest 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
