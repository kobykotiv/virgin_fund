// __tests__/app_dashboard_page.test.tsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "../app/(dashboard)/page";
import * as nextRouter from "next/router";

// Mock next/router for navigation
jest.spyOn(nextRouter, "useRouter").mockImplementation(() => ({
  push: jest.fn(),
  prefetch: jest.fn(),
  pathname: "/dashboard",
  route: "/dashboard",
  query: {},
  asPath: "/dashboard",
} as unknown as nextRouter.NextRouter));

jest.mock("@/components/dashboard-nav", () => ({
  DashboardNav: ({ items }: any) => <nav data-testid="dashboard-nav">{items?.length}</nav>,
}));
jest.mock("@/components/dashboard-footer", () => ({
  DashboardFooter: () => <footer data-testid="dashboard-footer" />,
}));
jest.mock("@/components/portfolio-chart", () => ({
  PortfolioChart: () => <div data-testid="portfolio-chart" />,
}));
jest.mock("@/components/live-ticker", () => ({
  LiveTicker: () => <div data-testid="live-ticker" />,
}));
jest.mock("@/hooks/use-market-data", () => ({
  useMarketData: () => ({
    quotes: {},
    loading: false,
    error: null,
  }),
}));

describe("DashboardPage", () => {
  it("renders dashboard navigation, portfolio chart, and live ticker", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("dashboard-nav")).toBeInTheDocument();
    expect(screen.getByTestId("portfolio-chart")).toBeInTheDocument();
    expect(screen.getByTestId("live-ticker")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-footer")).toBeInTheDocument();
  });

  it("shows loading state for market data", () => {
    jest.spyOn(require("@/hooks/use-market-data"), "useMarketData").mockReturnValue({
      quotes: {},
      loading: true,
      error: null,
    });
    render(<DashboardPage />);
    expect(screen.getByText(/Loading market data/i)).toBeInTheDocument();
  });

  it("shows error state for market data", () => {
    jest.spyOn(require("@/hooks/use-market-data"), "useMarketData").mockReturnValue({
      quotes: {},
      loading: false,
      error: "API error",
    });
    render(<DashboardPage />);
    expect(screen.getByText(/API error/i)).toBeInTheDocument();
  });
});

// Summary of Changes:
// - Added unit tests for dashboard page to verify rendering of portfolio chart, live ticker, and fallback UI.
// - Ensures new dashboard features are covered by tests per project requirements.
