import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import StockAggregator from '@/components/stock-aggregator'

// use global helper from vitest.setup.ts
const renderWithProviders: any = (globalThis as any).renderWithProviders

vi.mock('@/lib/mockBots', () => {
  return {
    findStrategiesForTicker: (ticker: string) =>
      ticker === 'FOO'
        ? [
            { key: 's1', name: 'Mean Revert', description: 'Reverts to mean' },
            { key: 's2', name: 'Momentum', description: 'Follows trend' },
          ]
        : [],
  }
})

describe('StockAggregator', () => {
  it('renders ticker, price and positive change in green', () => {
    renderWithProviders(<StockAggregator ticker="FOO" price={200} changePct={1.23} />)
    expect(screen.getByTestId('ticker').textContent).toBe('FOO')
    expect(screen.getByTestId('price').textContent).toBe('$200.00')
    const change = screen.getByTestId('changePct')
    expect(change.textContent).toContain('+1.23%')
    expect(change.className).toMatch(/text-green-600/)
    expect(screen.getByTestId('strategies-list').textContent).toContain('Mean Revert')
  })

  it('renders negative change and fallback when no strategies', () => {
    renderWithProviders(<StockAggregator ticker="BAR" price="50.5" changePct={-2.5} />)
    expect(screen.getByTestId('price').textContent).toBe('$50.50')
    const change = screen.getByTestId('changePct')
    expect(change.textContent).toContain('-2.50%')
    expect(change.className).toMatch(/text-red-600/)
    expect(screen.getByTestId('strategies-list').textContent).toContain('No strategy samples')
  })

  it('handles invalid numeric props gracefully', () => {
    renderWithProviders(<StockAggregator ticker="BAZ" price={"NaN"} changePct={"oops"} />)
    expect(screen.getByTestId('price').textContent).toBe('$0.00')
    expect(screen.getByTestId('changePct').textContent).toContain('+0.00%')
  })
})
