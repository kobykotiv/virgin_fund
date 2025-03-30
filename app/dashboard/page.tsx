"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, LineChart, Bot } from "lucide-react"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { PortfolioAllocation } from "@/components/portfolio-allocation"
import { PortfolioPerformance } from "@/components/portfolio-performance"
import { BotStatusManager } from "@/components/bot-status-manager"
import { PortfolioSummaryWidget } from "@/components/portfolio-summary-widget"
import { PortfolioCard } from "@/components/portfolio-card"
import { UserProfileWidget } from "@/components/user-profile-widget"
import { AreaChart, BarChart, PieChart } from "lucide-react"

// Mock data - will be replaced with actual data fetching
const mockPortfolios = [
  {
    id: "1",
    name: "Growth Portfolio",
    type: "standard" as const,
    risk: "aggressive" as const,
    totalValue: 54298.76,
    pnl: 1245.32,
    pnlPercentage: 2.34,
    assetCount: 8
  },
  {
    id: "2",
    name: "Dividend Income",
    type: "standard" as const,
    risk: "conservative" as const,
    totalValue: 28742.19,
    pnl: -324.87,
    pnlPercentage: -1.12,
    assetCount: 5
  },
  {
    id: "3",
    name: "Tech Focus",
    type: "margin" as const,
    risk: "moderate" as const,
    totalValue: 32567.93,
    pnl: 2876.45,
    pnlPercentage: 9.68,
    assetCount: 6
  }
]

// Mock data for recent transactions
const recentTransactions = [
  { id: "t1", symbol: "AAPL", type: "buy", quantity: 10, price: 175.60, timestamp: "2024-01-16T14:23:00Z" },
  { id: "t2", symbol: "MSFT", type: "buy", quantity: 5, price: 328.45, timestamp: "2024-01-15T14:25:00Z" },
  { id: "t3", symbol: "NVDA", type: "sell", quantity: 3, price: 591.22, timestamp: "2024-01-12T10:12:00Z" },
  { id: "t4", symbol: "AMZN", type: "buy", quantity: 12, price: 145.78, timestamp: "2024-01-05T09:45:00Z" },
]

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/db/portfolios")
        if (!response.ok) throw new Error("Failed to fetch portfolios")
        const data = await response.json()
        setPortfolios(data)
      } catch (err) {
        console.error("Error loading portfolios:", err)
        setError(err.message || "Failed to load portfolios")
      } finally {
        setLoading(false)
      }
    }
    
    fetchPortfolios()
  }, [])

  // Calculate summary statistics
  const totalValue = mockPortfolios.reduce((sum, p) => sum + p.totalValue, 0)
  const totalPnl = mockPortfolios.reduce((sum, p) => sum + p.pnl, 0)
  const totalPnlPercentage = (totalPnl / (totalValue - totalPnl)) * 100
  
  // Find best performing portfolio
  const bestPerforming = [...mockPortfolios].sort((a, b) => b.pnlPercentage - a.pnlPercentage)[0]
  
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <PortfolioSummaryWidget 
            totalPortfolios={mockPortfolios.length}
            totalValue={totalValue}
            totalPnl={totalPnl}
            totalPnlPercentage={totalPnlPercentage}
            bestPerforming={bestPerforming}
          />
        </div>
        <div className="md:col-span-1">
          <UserProfileWidget />
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <AreaChart className="h-16 w-16 opacity-20" />
                  <p className="ml-4">Performance chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <PieChart className="h-16 w-16 opacity-20" />
                  <p className="ml-4">Asset allocation chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Portfolio Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart className="h-16 w-16 opacity-20" />
                  <p className="ml-4">Portfolio comparison chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolios" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPortfolios.map(portfolio => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Symbol</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map(txn => (
                      <tr key={txn.id} className="border-b">
                        <td className="py-3 px-4">{new Date(txn.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4 font-medium">{txn.symbol}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            txn.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {txn.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">{txn.quantity}</td>
                        <td className="py-3 px-4 text-right">${txn.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">${(txn.price * txn.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

