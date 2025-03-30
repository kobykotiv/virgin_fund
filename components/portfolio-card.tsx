"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUp, ArrowDown, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface PortfolioCardProps {
  portfolio: {
    id: string;
    name: string;
    type: 'standard' | 'margin';
    risk: 'conservative' | 'moderate' | 'aggressive';
    totalValue: number;
    pnl: number; 
    pnlPercentage: number;
    assetCount: number;
  }
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const router = useRouter()

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'conservative': return 'bg-blue-100 text-blue-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'aggressive': return 'bg-red-100 text-red-800';
      default: return '';
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{portfolio.name}</CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {portfolio.type}
              </Badge>
              <Badge className={`capitalize ${getRiskColor(portfolio.risk)}`}>
                {portfolio.risk}
              </Badge>
            </div>
          </div>
          <div className={`text-right ${portfolio.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <div className="flex items-center whitespace-nowrap font-medium">
              {portfolio.pnl >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(portfolio.pnlPercentage).toFixed(2)}%
            </div>
            <div className="text-sm">
              ${Math.abs(portfolio.pnl).toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mt-2">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-lg font-bold">${portfolio.totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Assets</p>
            <p className="text-lg font-bold">{portfolio.assetCount}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/portfolio/${portfolio.id}`)}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button variant="ghost" size="sm" onClick={() => router.push(`/portfolio/${portfolio.id}/edit`)}>
          Manage
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
