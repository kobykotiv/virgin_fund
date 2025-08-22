import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"

// Mock hooks
vi.mock("@/hooks/useStrategies", () => {
  return {
    useStrategies: () => ({ data: [{ id: "s1", name: "Mean Reversion", description: "Desc", parameters: {}, is_public: false }], isLoading: false }),
    useCreateStrategy: () => ({ mutateAsync: vi.fn().mockResolvedValue({ id: "s-new", name: "New" }) }),
    useUpdateStrategy: () => ({ mutateAsync: vi.fn().mockResolvedValue({}) }),
    useDeleteStrategy: () => ({ mutateAsync: vi.fn().mockResolvedValue({}) }),
  }
})

vi.mock("@/hooks/use-toast", () => {
  return { useToast: () => ({ toast: vi.fn() }) }
})

import StrategyList from "@/components/strategies/StrategyList"

describe("StrategyList", () => {
  it("renders strategies and create flow", async () => {
    render(<StrategyList />)

    // existing strategy shown
    expect(await screen.findByText("Mean Reversion")).toBeInTheDocument()

    // open create form
    const createBtn = screen.getByText(/create strategy/i)
    fireEvent.click(createBtn)

    // fill fields and create
    const nameInput = screen.getByPlaceholderText("Strategy name")
    fireEvent.change(nameInput, { target: { value: "Test Strategy" } })

    const createConfirm = screen.getByText("Create")
    fireEvent.click(createConfirm)

    // after mutation, the toast mock would have been called; ensure create button exists
    expect(createConfirm).toBeInTheDocument()
  })
})
