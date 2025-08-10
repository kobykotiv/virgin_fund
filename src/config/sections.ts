// src/config/sections.ts

import { LucideIcon } from "lucide-react"

export type SectionConfig = {
  label: string
  path: string
  icon: LucideIcon | string
  subsections?: SectionConfig[]
}

export const SECTIONS: SectionConfig[] = [
  {
    label: "Trading / Analytics",
    path: "/dashboard/trading-analytics",
    icon: "BarChart2",
    subsections: [
      { label: "Overview", path: "/dashboard/trading-analytics/overview", icon: "LayoutDashboard" },
      { label: "Custom Signals", path: "/dashboard/trading-analytics/custom-signals", icon: "Signal" },
      { label: "Signal Builder", path: "/dashboard/trading-analytics/signal-builder", icon: "Settings" },
      { label: "Backtest", path: "/dashboard/trading-analytics/backtest", icon: "RotateCcw" },
    ],
  },
  {
    label: "Finance Calculators",
    path: "/dashboard/finance-calculators",
    icon: "Calculator",
    subsections: [
      { label: "Savings Calculator", path: "/dashboard/finance-calculators/savings", icon: "PiggyBank" },
      { label: "Compound Interest", path: "/dashboard/finance-calculators/compound-interest", icon: "Percent" },
      { label: "Inflation Calculator", path: "/dashboard/finance-calculators/inflation", icon: "TrendingUp" },
      { label: "Retirement Calculator", path: "/dashboard/finance-calculators/retirement", icon: "CalendarCheck2" },
    ],
  },
  {
    label: "Portfolio & Reports",
    path: "/dashboard/portfolio-reports",
    icon: "PieChart",
    subsections: [
      { label: "Portfolio", path: "/dashboard/portfolio-reports/portfolio", icon: "Briefcase" },
      {
        label: "Financial Calculators",
        path: "/dashboard/portfolio-reports/financial-calculators",
        icon: "Calculator",
        subsections: [
          { label: "Compound Interest", path: "/dashboard/portfolio-reports/financial-calculators/compound-interest", icon: "Percent" },
          { label: "Savings", path: "/dashboard/portfolio-reports/financial-calculators/savings", icon: "PiggyBank" },
          { label: "Retirement", path: "/dashboard/portfolio-reports/financial-calculators/retirement", icon: "CalendarCheck2" },
          { label: "Mortgage", path: "/dashboard/portfolio-reports/financial-calculators/mortgage", icon: "Home" },
          { label: "Inflation", path: "/dashboard/portfolio-reports/financial-calculators/inflation", icon: "TrendingUp" },
          { label: "Debt Payoff", path: "/dashboard/portfolio-reports/financial-calculators/debt-payoff", icon: "CreditCard" },
          { label: "Fee Impact", path: "/dashboard/portfolio-reports/financial-calculators/fee-impact", icon: "Percent" },
        ],
      },
    ],
  },
  {
    label: "Trading Calculators",
    path: "/dashboard/trading-calculators",
    icon: "Calculator",
    subsections: [
      { label: "Risk/Reward", path: "/dashboard/trading-calculators/risk-reward", icon: "Activity" },
      { label: "Position Size", path: "/dashboard/trading-calculators/position-size", icon: "Box" },
      { label: "Leverage", path: "/dashboard/trading-calculators/leverage", icon: "TrendingUp" },
      { label: "Pivot Points", path: "/dashboard/trading-calculators/pivot-points", icon: "Divide" },
      { label: "Spread", path: "/dashboard/trading-calculators/spread", icon: "Columns" },
      { label: "Options Greeks", path: "/dashboard/trading-calculators/options-greeks", icon: "Sigma" },
    ],
  },
]
