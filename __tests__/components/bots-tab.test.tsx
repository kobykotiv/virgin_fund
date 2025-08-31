import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import DashboardApp from '@/components/DashboardApp'

// Stub clipboard to avoid user-event clipboard errors in jsdom
if (typeof (global as any).navigator === 'undefined') {
  ;(global as any).navigator = {}
}
;(global as any).navigator.clipboard = {
  writeText: async () => {},
  readText: async () => ''
}

// Mock bot-api implementations (vitest)
vi.mock('@/lib/bot-api', () => ({
  fetchBots: vi.fn().mockResolvedValue([]),
  createBot: vi.fn().mockImplementation(async (data) => ({ id: 'bot-1', name: data.name || 'New Bot', status: 'paused' })),
  updateBot: vi.fn().mockImplementation(async (bot) => bot),
  deleteBot: vi.fn().mockResolvedValue({ ok: true }),
  toggleBotStatus: vi.fn().mockImplementation(async (id, status) => ({ id, status }))
}))

describe('Bots tab', () => {
  it('creates a bot, shows it in the list, and deletes it', async () => {
  render(<DashboardApp />)

    // Open Bots tab
    const botsBtn = await screen.findByRole('button', { name: /bots/i })
    await userEvent.click(botsBtn)

    // Click New Bot
    const newBtn = await screen.findByRole('button', { name: /new bot/i })
    await userEvent.click(newBtn)

    // Fill form - find input by placeholder or label
    const nameInput = await screen.findByPlaceholderText(/bot name/i)
    await userEvent.type(nameInput, 'My Test Bot')

    // Submit form
    const submit = screen.getByRole('button', { name: /create/i })
    await userEvent.click(submit)

    // Wait for bot to appear
    await waitFor(() => expect(screen.getByText('My Test Bot')).toBeInTheDocument())

    // Delete bot
    const deleteBtn = screen.getByRole('button', { name: /delete/i })
    await userEvent.click(deleteBtn)

    // Ensure it's removed
    await waitFor(() => expect(screen.queryByText('My Test Bot')).not.toBeInTheDocument())
  })
})
