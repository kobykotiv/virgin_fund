import DashboardApp from '@/components/DashboardApp'

/**
 * Server-rendered page that mounts the existing client DashboardApp
 * in demo mode with a small demo portfolio to avoid the "default export
 * is not a React Component" runtime error.
 *
 * This file intentionally stays a server component (no "use client").
 */

const demoPortfolio = {
  totalValue: 5200,
  cash: 1200,
  activeBots: 4,
  openPositions: 8,
  bots: [
    { id: 'bot-a', name: 'Bot A', status: 'running', pnl: 250, allocation: 40 },
    { id: 'bot-b', name: 'Bot B', status: 'stopped', pnl: -100, allocation: 20 },
    { id: 'bot-c', name: 'Bot C', status: 'running', pnl: 450, allocation: 25 },
    { id: 'bot-d', name: 'Bot D', status: 'running', pnl: 180, allocation: 15 },
  ],
  allocations: [
    { asset: 'BTC', percent: 45 },
    { asset: 'ETH', percent: 30 },
    { asset: 'ADA', percent: 15 },
    { asset: 'SOL', percent: 10 },
  ],
  recentTrades: [
    { asset: 'BTC', type: 'Buy', amount: '0.05', pnl: 25 },
    { asset: 'ETH', type: 'Sell', amount: '0.5', pnl: -15 },
    { asset: 'ADA', type: 'Buy', amount: '500', pnl: 12 },
  ],
}

export default function Page() {
  return <DashboardApp demoMode demoPortfolio={demoPortfolio} />
}
