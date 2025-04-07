"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PortfolioChart } from "@/components/portfolio-chart"
import { PortfolioLineChart } from "@/components/portfolio-line-chart"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, LucideIcon, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PortfolioPreviewModalProps {
  isOpen: boolean
  onClose: () => void
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
  } | null
  onSelect?: (id: string) => void
}

export function PortfolioPreviewModal({ isOpen, onClose, portfolio, onSelect }: PortfolioPreviewModalProps) {
  if (!portfolio) return null

  const Icon = portfolio.icon

  // Format allocation data to be compatible with the chart component
  const formattedAllocation = portfolio.allocation.map(item => ({
    name: item.name || item.label || "",
    value: item.value,
    color: item.color
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>{portfolio.name}</DialogTitle>
          </div>
          <DialogDescription>{portfolio.focus}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-xl font-bold">{portfolio.value}</p>
                  {portfolio.costBasis && (
                    <p className="text-xs text-muted-foreground mt-1">Cost Basis: {portfolio.costBasis}</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Return</p>
                  <p className={`text-xl font-bold flex items-center ${
                    portfolio.returnClass === "positive" ? "text-green-500" : 
                    portfolio.returnClass === "negative" ? "text-red-500" : ""
                  }`}>
                    {portfolio.returnClass === "positive" ? 
                      <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    }
                    {portfolio.return}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Risk Profile</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={
                      portfolio.risk === "Low" ? "outline" : 
                      portfolio.risk === "Moderate" ? "secondary" : "destructive"
                    }>
                      {portfolio.risk} Risk
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="aspect-[3/2] bg-muted/30 rounded-lg overflow-hidden">
              {portfolio.historicalData && portfolio.historicalData.length > 0 ? (
                <PortfolioLineChart 
                  data={portfolio.historicalData} 
                  className="w-full h-full" 
                  variant={portfolio.chartVariant} 
                  showTooltip
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No historical data available
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.tags.map((tag) => (
                  <Badge variant="outline" key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {portfolio.sentiment && (
              <div>
                <h3 className="text-sm font-medium mb-2">Market Sentiment</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    portfolio.sentiment === "bullish" ? "success" : 
                    portfolio.sentiment === "bearish" ? "destructive" : 
                    "secondary"
                  } className="flex items-center gap-1">
                    {portfolio.sentiment === "bullish" && <TrendingUp className="h-3 w-3" />}
                    {portfolio.sentiment === "bearish" && <TrendingDown className="h-3 w-3" />}
                    {portfolio.sentiment.charAt(0).toUpperCase() + portfolio.sentiment.slice(1)}
                  </Badge>
                  {portfolio.sentimentStrength && (
                    <span className="text-sm">Strength: {portfolio.sentimentStrength}%</span>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="allocation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="aspect-square mb-4">
                  <PortfolioChart 
                    portfolioType={portfolio.id} 
                    className="w-full h-full" 
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Asset Allocation</h3>
                <div className="space-y-2">
                  {formattedAllocation.map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="strategy">
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Investment Thesis</h3>
                <p className="text-muted-foreground">{portfolio.focus}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Key Strategies</h3>
                <ul className="list-disc text-muted-foreground pl-5 space-y-1">
                  <li>Focused on {portfolio.tags.slice(0, 3).join(", ")} sectors</li>
                  <li>{portfolio.risk} risk profile with appropriate diversification</li>
                  {portfolio.sentiment === "bullish" && <li>Overweight in growth-oriented assets</li>}
                  {portfolio.sentiment === "bearish" && <li>Defensive positioning with focus on value</li>}
                  <li>Asset allocation optimized for current market conditions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Time Horizon</h3>
                <p className="text-muted-foreground">
                  {portfolio.risk === "Low" ? "Long-term investment approach (5+ years)" : 
                  portfolio.risk === "Moderate" ? "Medium to long-term approach (3-5 years)" : 
                  "Shorter-term approach (1-3 years) with higher risk tolerance"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
          {onSelect && (
            <Button 
              onClick={() => {
                onSelect(portfolio.id);
                onClose();
              }}
            >
              Try This Portfolio
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
