'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

interface PortfolioSummary {
  _id: string
  name: string
  assetCount: number
  totalValue: number
}

interface RecentTransaction {
  _id: string
  ticker: string
  type: string
  date: string
  totalValue: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([])
  const [transactions, setTransactions] = useState<RecentTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [portfoliosRes, transactionsRes] = await Promise.all([
          fetch('/api/portfolios?summary=true'),
          fetch('/api/transactions?recent=true&limit=5')
        ])
        
        if (portfoliosRes.ok && transactionsRes.ok) {
          const [portfoliosData, transactionsData] = await Promise.all([
            portfoliosRes.json(),
            transactionsRes.json()
          ])
          
          setPortfolios(portfoliosData)
          setTransactions(transactionsData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  if (loading) {
    return <div>Loading dashboard data...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name || 'Investor'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Portfolios</h2>
            <span className="text-2xl font-bold">{portfolios.length}</span>
          </div>
          <Link href="/portfolios" className="text-blue-500 hover:underline text-sm">
            View all portfolios
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Total Assets</h2>
            <span className="text-2xl font-bold">
              {portfolios.reduce((sum, p) => sum + p.assetCount, 0)}
            </span>
          </div>
          <Link href="/positions" className="text-blue-500 hover:underline text-sm">
            View all positions
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Total Value</h2>
            <span className="text-2xl font-bold">
              ${portfolios.reduce((sum, p) => sum + p.totalValue, 0).toFixed(2)}
            </span>
          </div>
          <Link href="/portfolios" className="text-blue-500 hover:underline text-sm">
            View details
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Your Portfolios</h2>
          {portfolios.length === 0 ? (
            <div className="text-center py-4">
              <p className="mb-4">You don't have any portfolios yet.</p>
              <Link href="/portfolios/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Create Portfolio
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolios.map(portfolio => (
                <Link key={portfolio._id} href={`/portfolios/${portfolio._id}`}>
                  <div className="border rounded p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{portfolio.name}</h3>
                      <span className="font-semibold">${portfolio.totalValue.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{portfolio.assetCount} assets</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <div className="text-center py-4">
              <p className="mb-4">No recent transactions.</p>
              <Link href="/trades/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Record Trade
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div key={transaction._id} className="border rounded p-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{transaction.ticker}</h3>
                    <span className={`font-semibold ${
                      transaction.type === 'BUY' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type} ${transaction.totalValue.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              <div className="text-right mt-4">
                <Link href="/transactions" className="text-blue-500 hover:underline text-sm">
                  View all transactions
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
