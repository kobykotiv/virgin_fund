import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// Mock next/navigation useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => {} }),
}));

// Mock toast hook used in DemoPicker
const toastMock = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

// Provide a small demo portfolio collection for the test
vi.mock("@/lib/demo-portfolios", () => ({
  portfolios: [
    {
      id: "demo-1",
      name: "Demo One",
      description: "A simple demo portfolio for testing",
      allocation: { AAPL: 0.5, MSFT: 0.5 },
      positions: [{ symbol: "AAPL", quantity: 10 }],
    },
  ],
}));

// Mock demo service constants / helpers used by DemoPicker
vi.mock("@/services/demo-service", () => ({
  DEMO_PORTFOLIO_KEY: "trading_platform_demo_portfolio",
  initializeDemoData: vi.fn(),
}));

// Import component after mocks are set up
import DemoPicker from "@/components/portfolio/DemoPicker";

describe("DemoPicker", () => {
  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    // @ts-ignore
    global.fetch = undefined;
  });

  test("applies demo to localStorage, shows toast, and attempts server persistence", async () => {
    const user = userEvent;

    // mock fetch for server persistence
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ success: true }) });

    render(<DemoPicker />);

    // Select the demo item
    const demoBtn = screen.getByRole("button", { name: /demo one/i });
    await user.click(demoBtn);

    // Apply button should be enabled
    const applyBtn = screen.getByRole("button", { name: /apply to my demo portfolio/i });
    await user.click(applyBtn);

    // Expect localStorage to have the demo payload
    await waitFor(() => {
      const saved = localStorage.getItem("trading_platform_demo_portfolio");
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved as string);
      expect(parsed.id).toBe("demo-1");
    });

    // Toast should have been called
    expect(toastMock).toHaveBeenCalled();

    // fetch should have been called to persist server-side
    // @ts-ignore
    expect(global.fetch).toHaveBeenCalledWith("/api/market/portfolio/demo", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }));
  });

  test("shows error toast when localStorage set fails", async () => {
    const user = userEvent;

    // Cause localStorage.setItem to throw
    const originalSetItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    render(<DemoPicker />);

    // Select demo and try to apply
    const demoBtn = screen.getByRole("button", { name: /demo one/i });
    await user.click(demoBtn);

    const applyBtn = screen.getByRole("button", { name: /apply to my demo portfolio/i });
    await user.click(applyBtn);

    await waitFor(() => {
      // Error toast should be shown
      expect(toastMock).toHaveBeenCalled();
      // restore
      // @ts-ignore
      Storage.prototype.setItem = originalSetItem;
    });
  });
});
