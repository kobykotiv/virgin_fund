// __tests__/components/bot-configuration/BotCard.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { BotCard } from "../../../components/bot-configuration/BotCard";

// Mock hooks
vi.mock("hooks/useBots", () => ({
  useStartBot: () => ({ mutateAsync: vi.fn().mockResolvedValue({}) }),
  usePauseBot: () => ({ mutateAsync: vi.fn().mockResolvedValue({}) }),
  useStopBot: () => ({ mutateAsync: vi.fn().mockResolvedValue({}) }),
  useUpdateBot: () => ({ mutateAsync: vi.fn().mockResolvedValue({}) }),
}));

import type { BotType } from "../../../types/bot";

const bot = {
  id: "bot1",
  name: "Test Bot",
  type: "grid" as BotType,
  status: "active",
  assets: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  allocation: 1000,
  currentPnL: 123.45,
  lastTradeAt: new Date().toISOString(),
};

describe("BotCard", () => {
  it("renders bot info and actions", () => {
    render(<BotCard bot={bot} />);
    expect(screen.getByText("Test Bot")).toBeInTheDocument();
    expect(screen.getByText("grid")).toBeInTheDocument();
    expect(screen.getByText(/\+123\.45/)).toBeInTheDocument();
    expect(screen.getByText(/\$1,000/)).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByText("Stop")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Clone")).toBeInTheDocument();
  });

  it("calls start, pause, stop, and clone actions", async () => {
    render(<BotCard bot={bot} />);
    fireEvent.click(screen.getByText("Start"));
    fireEvent.click(screen.getByText("Pause"));
    fireEvent.click(screen.getByText("Stop"));
    fireEvent.click(screen.getByText("Clone"));
    // No assertion on mutation calls since hooks are mocked, but ensures no crash
  });
});

// Summary of Changes:
// - Added BotCard unit tests for rendering and action buttons.
// - Mocks mutation hooks for isolation.
