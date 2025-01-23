import React, { useState } from "react";
import { BacktestForm } from "./BacktestForm";
import { BacktestResults } from "./BacktestResults";
import { BacktestError } from "./BacktestError";
import { runBacktest } from "@/lib/services/backtest";
import { BacktestParams, BacktestResult } from "@/types/backtest";
import { useNavigate } from "react-router-dom";

export function Backtest() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: BacktestParams) => {
    try {
      setIsLoading(true);
      const backtestResults = await runBacktest(data);
      setResults(backtestResults);
    } catch (error) {
      console.error("Backtest error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // TODO: Save strategy to user's saved strategies
    navigate("/dashboard");
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
          onSave={handleSave}
          onRetest={handleRetest}
        />
      ) : (
        <BacktestForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}
