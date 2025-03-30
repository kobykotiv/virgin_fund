"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { getPortfolioAllocation } from "@/services/alpaca-service"

interface PortfolioChartProps {
  portfolioType?: string;
  portfolioId?: string;
  className?: string;
  showTransactionHistory?: boolean;
}

const COLORS = [
  "#0088FE", // blue
  "#00C49F", // green
  "#FFBB28", // yellow
  "#FF8042", // orange
  "#8884D8", // purple
  "#FF6B6B", // red
  "#4BC0C0", // teal
  "#9966FF", // violet
  "#FF66B2", // pink
  "#66B2FF", // light blue
]

export function PortfolioChart({ portfolioType, portfolioId, className, showTransactionHistory = false }: PortfolioChartProps) {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        if (portfolioId) {
          // Fetch portfolio data from our API
          const response = await fetch(`/api/db/portfolios/${portfolioId}?includeAssets=true`)
          if (!response.ok) throw new Error('Failed to fetch portfolio data')
          
          const portfolioData = await response.json()
          
          // Transform asset data for chart display
          const assetAllocation = portfolioData.assets.map((asset: any) => ({
            name: asset.symbol,
            value: asset.quantity * asset.averagePrice,
            holdingType: asset.holdingType,
            id: asset.id
          }))
          
          setData(assetAllocation)
          
          // Fetch transaction history if requested
          if (showTransactionHistory && portfolioData.assets.length > 0) {
            const txResponse = await fetch(`/api/db/transactions?portfolioId=${portfolioId}`)
            if (txResponse.ok) {
              const txData = await txResponse.json()
              setTransactions(txData)
            }
          }
        } else {
          // Fallback to legacy method
          const allocationData = await getPortfolioAllocation(portfolioType || 'default')
          setData(allocationData)
        }
      } catch (err: any) {
        console.error('Error fetching portfolio data:', err)
        setError(err.message || 'Failed to load portfolio data')
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [portfolioType, portfolioId, showTransactionHistory])

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (isLoading) {
    return <div className={`w-full h-64 flex items-center justify-center ${className}`}>Loading portfolio data...</div>
  }

  if (error) {
    return <div className={`w-full h-64 flex items-center justify-center text-red-500 ${className}`}>{error}</div>
  }

  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => {
              const total = data.reduce((sum, item) => sum + item.value, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return [`${percentage}% ($${value.toLocaleString()})`, name]
            }}
            contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "6px", border: "none" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

