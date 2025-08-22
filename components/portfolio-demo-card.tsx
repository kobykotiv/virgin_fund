"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { PortfolioChart } from "@/components/portfolio-chart"
import { PortfolioLineChart } from "@/components/portfolio-line-chart"
import { ArrowUpRight, ArrowDownRight, LucideIcon, Eye, ChevronRight, TrendingDown, TrendingUp, Loader2 } from "lucide-react"
import { CombinedPortfolioChart } from './charts/combined-portfolio-chart';
import { PortfolioChart } from "./charts/portfolio-chart"

// Helper function to format currency values
function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numValue);
}

interface Portfolio {
  id: string
  name: string
  focus: string
  risk: string
  tags: string[]
  value: string
  return: string
  returnClass: string
  chartVariant: "up" | "volatile" | "down"
  allocation: Array<{ name: string, label?: string, value: number, color?: string }>
  icon: LucideIcon
  sentiment?: "bullish" | "bearish" | "neutral"
  sentimentStrength?: number
  fearGreedIndex?: number
  fearGreedLabel?: string
  historicalData?: Array<{ timestamp: string, value: number }>
  costBasis?: string
  positions?: any[]
}

interface PortfolioDemoCardProps {
  portfolio: Portfolio;
  onSelect: (id: string) => void;
  onPreview: (id: string) => void;
  isLoading: boolean;
  activeDemo: string | null;
}

// Helper function to determine badge variant based on risk level
function getRiskVariant(risk: string) {
  switch (risk.toLowerCase()) {
    case "low":
      return "outline"
    case "moderate":
      return "secondary"
    default:
      return "destructive"
  }
}

export function PortfolioDemoCard({ portfolio, onSelect, onPreview, isLoading, activeDemo }: PortfolioDemoCardProps) {
  return (
    <Card className="overflow-hidden h-[320px] flex flex-col">
      <CardHeader className="p-4 pb-2 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-muted rounded-md">
              {portfolio.icon && <portfolio.icon className="h-4 w-4" />}
            </div>
            <CardTitle className="text-base font-medium line-clamp-1">
              {portfolio.name}
            </CardTitle>
          </div>
          <Badge className={`${getRiskVariant(portfolio.risk)} h-5`}>
            {portfolio.risk}
          </Badge>
        </div>
        <CardDescription className="text-xs line-clamp-1">
          {portfolio.focus}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <div className="h-[120px] -mx-2 mb-3">
          <PortfolioChart
            historicalData={portfolio.historicalData}
            allocation={portfolio.allocation}
            isLoading={isLoading}
            isMock={!portfolio.historicalData?.length}
          />
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Value:</span>
            <span className="font-medium">{formatCurrency(portfolio.value)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Return:</span>
            <span className={`font-medium ${portfolio.returnClass}`}>
              {portfolio.return}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            className="flex-1"
            onClick={() => onSelect(portfolio.id)}
            disabled={isLoading || activeDemo === portfolio.id}
          >
            {isLoading && activeDemo === portfolio.id ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Select"
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPreview(portfolio.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
