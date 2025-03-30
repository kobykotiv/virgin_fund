"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, BarChart2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface PortfolioSummaryWidgetProps {
  totalPortfolios: number;
  totalValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
  bestPerforming?: {
    id: string;
    name: string;
    pnlPercentage: number;
  };
}

export function PortfolioSummaryWidget({
  totalPortfolios,
  totalValue,
  totalPnl,
  totalPnlPercentage,
  bestPerforming
}: PortfolioSummaryWidgetProps) {
  const router = useRouter()
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Portfolio Summary</CardTitle>
          <Button 
            size="sm" 
            onClick={() => router.push('/portfolio/create')}
            className="h-8"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            New Portfolio
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Portfolios</p>
            <p className="text-2xl font-bold">{totalPortfolios}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnl >= 0 ? '+' : '-'}${Math.abs(totalPnl).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Return %</p>
            <p className={`text-2xl font-bold ${totalPnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnlPercentage >= 0 ? '+' : '-'}{Math.abs(totalPnlPercentage).toFixed(2)}%
            </p>
          </div>
        </div>
        
        {bestPerforming && (
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground mb-1">Best Performing Portfolio</p>
            <div className="flex justify-between items-center">
              <p className="font-medium">{bestPerforming.name}</p>
              <div className="flex items-center">
                <p className="text-green-500 font-medium mr-2">+{bestPerforming.pnlPercentage.toFixed(2)}%</p>
                <Button size="xs" variant="ghost" onClick={() => router.push(`/portfolio/${bestPerforming.id}`)}>
                  <BarChart2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
