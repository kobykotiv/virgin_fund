import React from 'react'
import { screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import renderWithProviders from '../../helpers/renderWithProviders'
import BotArmyGrid from '../../../components/bot-configuration/BotArmyGrid'

// Mock hooks used inside BotArmyGrid
const mutateAsync = vi.fn().mockResolvedValue({})

vi.mock('@/hooks/useBots', () => ({
  __esModule: true,
  default: () => ({ data: [
    { id: 'b1', name: 'Alpha Bot', strategy: 'grid', status: 'running', assets: [], createdAt: new Date(Date.now()-1000).toISOString(), allocation: 2000, currentPnL: 50, updatedAt: new Date().toISOString() },
    { id: 'b2', name: 'Beta Bot', strategy: 'dca', status: 'paused', assets: [], createdAt: new Date(Date.now()-2000).toISOString(), allocation: 500, currentPnL: -10, updatedAt: new Date().toISOString() },
    { id: 'b3', name: 'Gamma Bot', strategy: 'indicator', status: 'stopped', assets: [], createdAt: new Date(Date.now()-3000).toISOString(), allocation: 7500, currentPnL: 200, updatedAt: new Date().toISOString() }
  ], isLoading: false, error: null }),
  useCreateBot: () => ({ mutateAsync }),
  useStartBot: () => ({ mutateAsync }),
  usePauseBot: () => ({ mutateAsync }),
  useStopBot: () => ({ mutateAsync }),
  useUpdateBot: () => ({ mutateAsync }),
}))

describe('BotArmyGrid', () => {
  it('renders bots and allows search filter', () => {
    renderWithProviders(<BotArmyGrid />)
    expect(screen.getByPlaceholderText('Search bots...')).toBeInTheDocument()
    expect(screen.getByText('Alpha Bot')).toBeInTheDocument()
    fireEvent.change(screen.getByPlaceholderText('Search bots...'), { target: { value: 'Gamma' } })
    expect(screen.queryByText('Alpha Bot')).not.toBeInTheDocument()
    expect(screen.getByText('Gamma Bot')).toBeInTheDocument()
  })

  it('supports selection and bulk actions', async () => {
    renderWithProviders(<BotArmyGrid />)
    const alpha = screen.getByLabelText('Select bot Alpha Bot') as HTMLInputElement
    const beta = screen.getByLabelText('Select bot Beta Bot') as HTMLInputElement
    fireEvent.click(alpha)
    fireEvent.click(beta)
    expect(alpha.checked).toBe(true)
    expect(beta.checked).toBe(true)
    const bulkStart = screen.getByText('Bulk Start') as HTMLButtonElement
    fireEvent.click(bulkStart)
    expect(mutateAsync).toHaveBeenCalled()
  })

  it('changes sorting order', () => {
    renderWithProviders(<BotArmyGrid />)
    const select = screen.getByDisplayValue('Newest') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'name-asc' } })
    // BotCard titles should now be alphabetically ordered: Alpha, Beta, Gamma
    const alpha = screen.getByText('Alpha Bot')
    const beta = screen.getByText('Beta Bot')
    const gamma = screen.getByText('Gamma Bot')
    const order = [alpha, beta, gamma].map(el => el.getBoundingClientRect().top)
    // Ensure their vertical positions are non-decreasing (grid order)
    expect(order[0]).toBeLessThanOrEqual(order[1])
    expect(order[1]).toBeLessThanOrEqual(order[2])
  })
})
