import React from 'react'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

import BotForm from '@/components/bot-configuration/BotForm'
import renderWithProviders from '../../helpers/renderWithProviders'

describe('BotForm modal', () => {
  afterEach(() => vi.resetAllMocks())

  test('calls onSubmit, onSuccess and closes the dialog on successful submit', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue({ id: 'bot-123' })
    const mockOnSuccess = vi.fn()
    const mockOnOpenChange = vi.fn()

  renderWithProviders(
      <BotForm open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} onSuccess={mockOnSuccess} />
    )

  const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement
  fireEvent.change(nameInput, { target: { value: 'Test Bot' } })
  const assetsInput = screen.getByLabelText(/Assets/i) as HTMLInputElement
  fireEvent.change(assetsInput, { target: { value: 'BTCUSD' } })
  const capitalInput = screen.getByLabelText(/Capital/i) as HTMLInputElement
  fireEvent.change(capitalInput, { target: { value: '1000' } })
  const submitBtn = screen.getByRole('button', { name: /Create Bot/i })
  fireEvent.click(submitBtn)

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
