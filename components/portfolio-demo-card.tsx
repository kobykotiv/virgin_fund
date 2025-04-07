"use client"

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PortfolioChart } from "@/components/portfolio-chart"
import { PortfolioLineChart } from "@/components/portfolio-line-chart"
import { ArrowUpRight, ArrowDownRight, LucideIcon, Eye, ChevronRight, TrendingDown, TrendingUp, Loader2 } from "lucide-react"

interface PortfolioCardProps {
  portfolio: {
    id: string
    name: string
    focus: string
    risk: string
    tags: string[]
    value: string
    return: string
    returnClass: string
    chartVariant: "up" | "volatile" | "down"
    allocation: Array<{ name?: string, label?: string, value: number, color?: string }>
    icon: LucideIcon
    sentiment?: "bullish" | "bearish" | "neutral"
    sentimentStrength?: number
    fearGreedIndex?: number
    fearGreedLabel?: string
    historicalData?: Array<{ timestamp: string, value: number }>
    costBasis?: string
    positions?: any[]
  }
  onSelect: (id: string) => void
  onPreview: (id: string) => void
  isLoading: boolean
  activeDemo: string | null
}

export function PortfolioDemoCard({ portfolio, onSelect, onPreview, isLoading, activeDemo }: PortfolioCardProps) {
  const Icon = portfolio.icon
  const isActive = activeDemo === portfolio.id
  
  // Format allocation data to be compatible with the chart component
  const formattedAllocation = portfolio.allocation.map(item => ({
    name: item.name || item.label || "",
    value: item.value,
    color: item.color
  }))

  // Get sentiment indicator
  const getSentimentIcon = () => {
    if (portfolio.sentiment === "bullish") return <TrendingUp className="h-3 w-3 text-green-500" />
    if (portfolio.sentiment === "bearish") return <TrendingDown className="h-3 w-3 text-red-500" />
    return null
  }

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="relative pb-0 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm leading-none">{portfolio.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{portfolio.risk} Risk</p>
            </div>
          </div>
          <Badge variant={
            portfolio.risk === "Low" ? "outline" : 
            portfolio.risk === "Moderate" ? "secondary" : "destructive"
          } className="text-xs">
            {portfolio.risk}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <p className="text-xs text-muted-foreground">Value</p>
            <p className="text-lg font-bold">{portfolio.value}</p>
            {portfolio.costBasis && (
              <p className="text-xs text-muted-foreground">Cost: {portfolio.costBasis}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Return</p>
            <p className={`text-sm font-medium flex items-center ${
              portfolio.returnClass === "positive" ? "text-green-500" : 
              portfolio.returnClass === "negative" ? "text-red-500" : ""
            }`}>
              {portfolio.returnClass === "positive" ? 
                <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                <ArrowDownRight className="h-3 w-3 mr-1" />
              }
              {portfolio.return}
            </p>
          </div>
        </div>
        
        <div className="mb-3">
          {portfolio.historicalData && portfolio.historicalData.length > 0 ? (
            <div className="h-24 w-full">
              <PortfolioLineChart 
                data={portfolio.historicalData} 
                className="w-full h-full" 
                variant={portfolio.chartVariant}
              />
            </div>
          ) : (
            <div className="h-24 w-full rounded-md bg-muted/30 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">No historical data</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {portfolio.tags.slice(0, 3).map((tag) => (
            <Badge variant="outline" key={tag} className="text-xs">
              {tag}
            </Badge>
          ))}
          {portfolio.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{portfolio.tags.length - 3}
            </Badge>
          )}
        </div>
        
        {portfolio.sentiment && (
          <div className="flex justify-between items-center mb-3 text-xs">
            <div className="flex items-center gap-1">
              {getSentimentIcon()}
              <span className="capitalize">{portfolio.sentiment} Sentiment</span>
            </div>
            {portfolio.fearGreedIndex && (
              <div>
                <span className="text-muted-foreground">F&G: </span>
                <span>{portfolio.fearGreedIndex}</span>
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{portfolio.focus}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPreview(portfolio.id)}
        >
          <Eye className="h-3 w-3 mr-1" /> Preview
        </Button>
        <Button 
          size="sm" 
          onClick={() => onSelect(portfolio.id)}
          disabled={isLoading}
        >
          {isLoading && isActive ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Loading
            </>
          ) : (
            <>
              Select <ChevronRight className="h-3 w-3 ml-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
