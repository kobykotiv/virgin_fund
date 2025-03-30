"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface PortfolioSummaryProps {
  portfolio: any
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const router = useRouter()
  
  // Calculate some basic portfolio stats
  const totalValue = portfolio.assets?.reduce((total: number, asset: any) => {
    return total + (asset.quantity * asset.currentPrice || asset.averagePrice)
  }, 0) || 0
  
  const dayChange = portfolio.performance?.dayChange || Math.random() * 4 - 2 // Mock data if unavailable
  const isProfitable = dayChange >= 0
  
  const assetCount = portfolio.assets?.length || 0
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "aggressive": return "bg-red-100 text-red-800"
      case "moderate": return "bg-amber-100 text-amber-800"
      case "conservative": return "bg-green-100 text-green-800"
      default: return ""
    }
  }
  
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-all" 
      onClick={() => router.push(`/portfolios/${portfolio.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{portfolio.name}</CardTitle>
          <Badge variant="outline" className={getRiskColor(portfolio.risk)}>
            {portfolio.risk}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            <div className={`flex items-center ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {isProfitable ? 
                <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                <ArrowDownRight className="h-4 w-4 mr-1" />
              }
              <span>{Math.abs(dayChange).toFixed(2)}%</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>
              <p>Assets: {assetCount}</p>
              <p>Type: {portfolio.type}</p>
            </div>
            <div className="text-right">
              <p>Strategy: {portfolio.strategy}</p>
              <p>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
