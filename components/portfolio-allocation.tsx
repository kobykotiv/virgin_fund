"use client"
import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PortfolioAllocationProps {
  portfolioId?: string
  onShare?: () => void
  className?: string
}

export function PortfolioAllocation({ portfolioId, onShare, className }: PortfolioAllocationProps) {
  const [data, setData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [portfolio, setPortfolio] = useState<any>(null)
  
  const COLORS = [
    "#4ade80", // green
    "#60a5fa", // blue
    "#818cf8", // indigo
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#94a3b8", // slate
    "#10b981", // emerald
    "#6366f1", // indigo
    "#0ea5e9", // sky
  ]

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!portfolioId) {
        setLoading(false)
        // If no portfolioId, use default demo data
        setData([
          { name: "SPY (S&P 500)", value: 35, risk: 3, color: "#4ade80" },
          { name: "QQQ (NASDAQ-100)", value: 25, risk: 4, color: "#60a5fa" },
          { name: "NASDAQ Composite", value: 20, risk: 4, color: "#818cf8" },
          { name: "BTC", value: 5, risk: 9, color: "#f59e0b" },
          { name: "ETH", value: 5, risk: 8, color: "#8b5cf6" },
          { name: "SOL", value: 5, risk: 10, color: "#ec4899" },
          { name: "Cash", value: 5, risk: 1, color: "#94a3b8" },
        ])
        return
      }
      
      try {
        setLoading(true)
        const response = await fetch(`/api/db/portfolios/${portfolioId}?includeAssets=true`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio: ${response.status}`)
        }
        
        const result = await response.json()
        setPortfolio(result)
        
        // Process assets data for chart
        if (result.assets && result.assets.length > 0) {
          const chartData = result.assets.map((asset: any, index: number) => ({
            name: asset.symbol,
            value: asset.quantity * asset.averagePrice,
            risk: asset.holdingType === 'short' ? 8 : 
                  asset.holdingType === 'option' ? 9 :
                  asset.symbol.includes('BTC') || asset.symbol.includes('ETH') ? 7 : 4,
            color: COLORS[index % COLORS.length]
          }))
          
          setData(chartData)
        } else {
          setData([])
        }
        
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching portfolio data:", err)
        setError(err.message || "Failed to load portfolio data")
        setLoading(false)
      }
    }
    
    fetchPortfolioData()
  }, [portfolioId])

  const RADIAN = Math.PI / 180

  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Only show label for segments with enough space
    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  const handleSharePortfolio = async () => {
    if (!portfolioId) return
    
    try {
      // Toggle sharing status
      const isCurrentlyPublic = portfolio?.sharing?.isPublic || false
      
      const response = await fetch('/api/portfolios/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioId,
          isPublic: !isCurrentlyPublic
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update sharing settings')
      }
      
      const result = await response.json()
      
      // Update local portfolio state
      setPortfolio({
        ...portfolio,
        sharing: result.sharing
      })
      
      // Call parent callback if provided
      if (onShare) onShare()
      
    } catch (err) {
      console.error('Error sharing portfolio:', err)
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <p className="text-muted-foreground mb-4">No assets in this portfolio</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Portfolio Allocation</CardTitle>
        {portfolioId && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSharePortfolio}
          >
            {portfolio?.sharing?.isPublic ? 'Make Private' : 'Share Portfolio'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => {
                  const total = data.reduce((sum, item) => sum + item.value, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return [`$${value.toLocaleString()} (${percentage}%)`, 'Allocation']
                }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: "none",
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "20px",
                  width: "100%",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

