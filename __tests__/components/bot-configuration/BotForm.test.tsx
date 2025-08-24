import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import BotForm from '@/components/bot-configuration/BotForm'

describe('BotForm modal', () => {
  afterEach(() => vi.resetAllMocks())

  test('calls onSubmit, onSuccess and closes the dialog on successful submit', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue({ id: 'bot-123' })
    const mockOnSuccess = vi.fn()
    const mockOnOpenChange = vi.fn()

    render(
      <BotForm open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} onSuccess={mockOnSuccess} />
    )

  // userEvent.setup() has different overloads across versions; cast to any to satisfy TS in tests
  const user = (userEvent as any).setup()

    const nameInput = screen.getByLabelText(/Name/i)
    await user.type(nameInput, 'Test Bot')

    const assetsInput = screen.getByLabelText(/Assets/i)
    await user.type(assetsInput, 'BTCUSD')

    const capitalInput = screen.getByLabelText(/Capital/i)
    await user.type(capitalInput, '1000')

    const submitBtn = screen.getByRole('button', { name: /Create Bot/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Test Bot', assets: ['BTCUSD'], capital: 1000 })
      )
      expect(mockOnSuccess).toHaveBeenCalledWith({ id: 'bot-123' })
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
