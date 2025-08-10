// src/hooks/useOverviewMetrics.ts

export function useOverviewMetrics() {
  // Mock metric cards
  const metrics = [
    { label: "Total Signals", value: 42 },
    { label: "Active Strategies", value: 7 },
    { label: "Portfolio Value", value: "$12,500" },
    { label: "Win Rate", value: "63%" },
  ]

  // Mock performance trend data
  const trend = [
    { date: "2024-01", value: 10000 },
    { date: "2024-02", value: 10500 },
    { date: "2024-03", value: 11000 },
    { date: "2024-04", value: 11500 },
    { date: "2024-05", value: 12000 },
    { date: "2024-06", value: 12500 },
  ]

  // Mock recent activity table
  const recent = [
    { date: "2024-06-01", action: "Signal Created", details: "RSI > 70" },
    { date: "2024-06-02", action: "Strategy Activated", details: "Mean Reversion" },
    { date: "2024-06-03", action: "Trade Executed", details: "AAPL Buy 10 @ $180" },
    { date: "2024-06-04", action: "Portfolio Updated", details: "Added TSLA" },
  ]

  return { metrics, trend, recent }
}
