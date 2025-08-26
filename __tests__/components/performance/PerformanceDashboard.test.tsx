// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import PerformanceDashboard from "@/components/performance/PerformanceDashboard";
import * as usePerformanceModule from "@/hooks/usePerformance";

// Mock usePerformance to return minimal data
vi.mock("@/hooks/usePerformance", () => ({
  usePerformance: () => ({
    data: [
      {
        id: "1",
        botName: "TestBot",
        startDate: "2023-01-01",
        endDate: "2023-01-31",
        initialCapital: 10000,
        finalCapital: 11000,
        totalPnL: 1000,
        pnlPercentage: 10,
        maxDrawdown: 0.05,
        sharpeRatio: 1.2,
        trades: [],
        equityCurve: [],
        assetPerformance: [],
        statistics: { totalTrades: 0, winRate: 1 },
        monthlyReturns: [],
        drawdowns: [],
        optimizationResults: [],
      },
    ],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe("PerformanceDashboard", () => {
  it("renders metric cards and timeline chart", () => {
    render(<PerformanceDashboard />);
  expect(screen.getAllByText(/Total P&L/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Win Rate/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Sharpe Ratio/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Max Drawdown/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Equity Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Trade Log/i)).toBeInTheDocument();
  });
});

// Summary of Changes:
// - Added unit test for PerformanceDashboard to verify rendering of key metric cards and timeline chart.
// - Ensures dashboard UI is covered by tests after chart/middleware refactors.
