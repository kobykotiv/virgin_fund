import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import StrategyCard, { Strategy } from "@/components/strategies/StrategyCard";
import StrategyList from "@/components/strategies/StrategyList";

/**
 * Mocks:
 * - hooks/useStrategies -> useStrategies, useCreateStrategy, useUpdateStrategy, useDeleteStrategy
 * - hooks/use-toast -> useToast
 *
 * The component under test uses these hooks; we provide deterministic mocks so the tests
 * focus on interaction (Import callback, Delete flow, loading states).
 */

const SAMPLE_STRATEGY: Strategy = {
  id: "strat-1",
  name: "Test Strategy",
  description: "Example",
  parameters: { foo: "bar" },
  is_public: false,
  created_at: new Date().toISOString(),
};

const mockMutateAsync = vi.fn().mockResolvedValue({});
const mockCreate = { mutateAsync: mockMutateAsync };
const mockUpdate = { mutateAsync: mockMutateAsync };
const mockDelete = { mutateAsync: mockMutateAsync };

vi.mock("@/hooks/useStrategies", () => {
  return {
    useStrategies: () => ({ data: [SAMPLE_STRATEGY], isLoading: false }),
    useCreateStrategy: () => mockCreate,
    useUpdateStrategy: () => mockUpdate,
    useDeleteStrategy: () => mockDelete,
  };
});

const toastMock = vi.fn();
vi.mock("@/hooks/use-toast", () => {
  return {
    useToast: () => ({ toast: toastMock }),
  };
});

describe("StrategyCard", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls onImport with the strategy when Import is clicked", async () => {
    const onImport = vi.fn();
    render(<StrategyCard strategy={SAMPLE_STRATEGY} onImport={onImport} />);

    const btn = screen.getByRole("button", { name: /Import strategy Test Strategy/i });
    await userEvent.click(btn);

    expect(onImport).toHaveBeenCalledTimes(1);
    expect(onImport).toHaveBeenCalledWith(SAMPLE_STRATEGY);
  });

  it("disables interactive buttons when isProcessing is true", () => {
    render(<StrategyCard strategy={SAMPLE_STRATEGY} isProcessing={true} />);

    const importBtn = screen.getByRole("button", { name: /Import strategy Test Strategy/i });
    const editBtn = screen.getByRole("button", { name: /Edit strategy Test Strategy/i });
    const deleteBtn = screen.getByRole("button", { name: /Delete strategy Test Strategy/i });

    expect(importBtn).toBeDisabled();
    expect(editBtn).toBeDisabled();
    expect(deleteBtn).toBeDisabled();
  });
});

describe("StrategyList", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders strategy cards from useStrategies and triggers onImport", async () => {
    const onImport = vi.fn();
    render(<StrategyList onImport={onImport} />);

    // card title should appear
    expect(await screen.findByText(/Test Strategy/)).toBeInTheDocument();

    const importBtn = screen.getByRole("button", { name: /Import strategy Test Strategy/i });
    await userEvent.click(importBtn);
    expect(onImport).toHaveBeenCalledWith(expect.objectContaining({ id: "strat-1" }));
  });

  it("deletes a strategy when Delete is confirmed and shows a toast", async () => {
    // Ensure window.confirm returns true so deletion proceeds
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<StrategyList />);

    const deleteBtn = await screen.findByRole("button", { name: /Delete strategy Test Strategy/i });
    await userEvent.click(deleteBtn);

    // mutateAsync should be called with the id
    await waitFor(() => {
      expect(mockDelete.mutateAsync).toHaveBeenCalledWith("strat-1");
    });

    // toast called with a "Deleted" title
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ title: "Deleted" }));

    confirmSpy.mockRestore();
  });

  it("shows create form and validates name presence", async () => {
    render(<StrategyList />);

    const createToggle = screen.getByRole("button", { name: /Create Strategy/i });
    await userEvent.click(createToggle);

    const createBtn = screen.getByRole("button", { name: /Create/i });
    // click without filling name
    await userEvent.click(createBtn);

    // toast should have been called with "Invalid"
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ title: "Invalid" }));
  });
});
