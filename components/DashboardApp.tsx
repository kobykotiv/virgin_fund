"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { navItems } from './navData'

interface DashboardAppProps { demoMode?: boolean; demoPortfolio?: any }
const DashboardApp: React.FC<DashboardAppProps> = ({ demoMode, demoPortfolio }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [currentPage, setCurrentPage] = useState('Dashboard')

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDarkMode])

  

  const Card: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl transition-transform transform hover:scale-[1.01] duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
      {children}
    </div>
  )

  const ChartPlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-60 flex items-center justify-center p-4 text-gray-500 dark:text-gray-400">
      <span className="text-center">{title} Chart Placeholder</span>
    </div>
  )

  const FileMenu: React.FC = () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="relative">
  <button data-testid="filemenu-button" onClick={() => setOpen(!open)} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm">
          File Menu
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
            <ul className="py-1">
              <li>
                <button data-testid="filemenu-calculators" onClick={() => { router.push('/calculators'); setIsSidebarOpen(false); setOpen(false) }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Calculators</button>
              </li>
              <li>
                <button data-testid="filemenu-compounding" onClick={() => { router.push('/calculators/compounding'); setIsSidebarOpen(false); setOpen(false) }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Compounding Calculator</button>
              </li>
              <li>
                <button data-testid="filemenu-unique" onClick={() => { router.push('/calculators/unique'); setIsSidebarOpen(false); setOpen(false) }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Unique Calculators</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  }

  const PageContent: React.FC = () => {
    const tradingViewChartStyles: React.CSSProperties = {
      width: '100%',
      height: 400,
      borderRadius: 12,
      backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
      border: '1px solid',
      borderColor: isDarkMode ? '#475569' : '#e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      fontWeight: 700,
      fontSize: '1.25rem',
    }

    switch (currentPage) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-300">
            <Card title="Account Balance">
              <p className="text-4xl font-bold text-gray-900 dark:text-green-400">{demoMode && demoPortfolio ? `$${demoPortfolio.totalValue}` : '$2,453.78'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{demoMode && demoPortfolio ? `Cash: $${demoPortfolio.cash}` : '+$12.34 (0.51%) today'}</p>
            </Card>
            <Card title="Active Bots">
              <p className="text-4xl font-bold text-gray-900 dark:text-yellow-400">{demoMode && demoPortfolio ? demoPortfolio.activeBots : 3}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{demoMode && demoPortfolio ? `${(demoPortfolio.bots || []).filter((b:any)=>b.status==='running').length} running` : '1 on profit, 2 in standby'}</p>
            </Card>
            <Card title="Open Positions">
              <p className="text-4xl font-bold text-gray-900 dark:text-blue-400">{demoMode && demoPortfolio ? demoPortfolio.openPositions : 5}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{demoMode && demoPortfolio ? `Total exposure: ${demoPortfolio.openPositions} positions` : 'Total exposure: 0.8 BTC'}</p>
            </Card>
            <Card title="Portfolio Value">
              <p className="text-4xl font-bold text-gray-900 dark:text-purple-400">{demoMode && demoPortfolio ? `${demoPortfolio.totalValue} USD` : '5.64 BTC'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{demoMode && demoPortfolio ? `Est. $${demoPortfolio.totalValue}` : 'Est. $389,000'}</p>
            </Card>

            <div className="md:col-span-2 xl:col-span-4">
              <Card title="Portfolio Overview">
                <ChartPlaceholder title="Portfolio Value" />
              </Card>
            </div>

            <div className="md:col-span-2 xl:col-span-2">
              <Card title="Active Bots Performance">
                <div style={tradingViewChartStyles} className="mt-4">TradingView-like Bot Performance Chart</div>
              </Card>
            </div>

            <div className="md:col-span-2 xl:col-span-2">
              <Card title="Recent Trades">
                <ul className="text-gray-900 dark:text-gray-100">
                  <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span>BTC/USD - Buy</span>
                    <span className="text-green-500">+1.2%</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span>ETH/USDT - Sell</span>
                    <span className="text-red-500">-0.5%</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )

      case 'Calculators':
      case 'Compounding Calculator':
      case 'Unique Calculators':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Compounding Calculator">
              <p className="text-gray-600 dark:text-gray-300">Interactive compounding calculator UI goes here.</p>
            </Card>
            <Card title="Position Size Calculator">
              <p className="text-gray-600 dark:text-gray-300">Position sizing form.</p>
            </Card>
            <Card title="Risk & Reward Calculator">
              <p className="text-gray-600 dark:text-gray-300">Risk/reward form.</p>
            </Card>
          </div>
        )

      default:
        return <div />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 md:relative md:translate-x-0 md:w-20 lg:w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Fin-Bot</span>
        </div>

        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name} className="group">
                <Link href={item.href} data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`} className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors duration-200 ${pathname === item.href ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <span className="w-6 h-6 mr-3 text-current">{item.icon}</span>
                  <span className="hidden md:inline lg:block whitespace-nowrap overflow-hidden transition-all duration-200">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center md:justify-start">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2 hidden md:block" />
          <span className="text-xs text-green-500 font-medium hidden md:block">Connected</span>
        </div>
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button data-testid="mobile-sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full md:hidden mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <h1 className="text-2xl font-bold">{currentPage}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <input className="pl-3 pr-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm" placeholder="Search..." />
            </div>

            <div>
              {/* ensure FileMenu button is testable */}
              <div data-testid="filemenu-wrapper"><FileMenu /></div>
            </div>

            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full">
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </header>

        <main className="flex-grow p-6 overflow-y-auto">
          <PageContent />
        </main>

        <footer className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          © 2025 Fin-Bot Platform. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

export default DashboardApp
