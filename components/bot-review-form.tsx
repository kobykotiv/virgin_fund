"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CircleDollarSign, AlertTriangle, Info, Shield } from "lucide-react"
import { formatCurrency } from "@/lib/portfolio-utils"
import type { BotWithPortfolio } from "@/components/dashboard"

interface BotReviewFormProps {
  botData: Partial<BotWithPortfolio>
  onSubmit: (data: Partial<BotWithPortfolio>) => void
}

export function BotReviewForm({ botData, onSubmit }: BotReviewFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(botData)
  }
  
  // Helper to render bot settings based on type
  const renderBotSettings = () => {
    const { settings } = botData
    if (!settings) return null
    
    switch(botData.type) {
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Symbol</p>
              <p className="text-sm text-muted-foreground">{settings.symbol}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Grid Levels</p>
              <p className="text-sm text-muted-foreground">{settings.gridLevels}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Price Range</p>
              <p className="text-sm text-muted-foreground">
                ${settings.lowerLimit} - ${settings.upperLimit}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Investment</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(settings.investment)}</p>
            </div>
          </div>
        )
      case 'dca':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Symbol</p>
              <p className="text-sm text-muted-foreground">{settings.symbol}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Interval</p>
              <p className="text-sm text-muted-foreground capitalize">{settings.interval}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Amount per Interval</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(settings.amount)}</p>
            </div>
          </div>
        )
      case 'momentum':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Symbol</p>
              <p className="text-sm text-muted-foreground">{settings.symbol}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Lookback Period</p>
              <p className="text-sm text-muted-foreground">{settings.lookbackPeriod} days</p>
            </div>
            <div>
              <p className="text-sm font-medium">Momentum Threshold</p>
              <p className="text-sm text-muted-foreground">{settings.threshold}</p>
            </div>
          </div>
        )
      case 'custom':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Symbol</p>
              <p className="text-sm text-muted-foreground">{settings.symbol}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Strategy</p>
              <p className="text-sm text-muted-foreground capitalize">{settings.strategy || 'Custom'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Timeframe</p>
              <p className="text-sm text-muted-foreground">{settings.timeframe}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{botData.name}</h2>
          <p className="text-sm text-muted-foreground">
            Review your bot configuration before creating
          </p>
        </div>
        <Badge variant={botData.type === 'custom' ? 'outline' : 'secondary'}>
          {botData.type?.charAt(0).toUpperCase() + botData.type?.slice(1) || 'Bot'}
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Bot Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderBotSettings()}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Position Size</p>
                <p className="text-sm text-muted-foreground">{botData.riskSettings?.positionSize}% of portfolio</p>
              </div>
              <div>
                <p className="text-sm font-medium">Max Drawdown</p>
                <p className="text-sm text-muted-foreground">{botData.riskSettings?.maxDrawdown}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Stop Loss</p>
                <p className="text-sm text-muted-foreground">{botData.riskSettings?.stopLoss}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Take Profit</p>
                <p className="text-sm text-muted-foreground">{botData.riskSettings?.takeProfit}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Max Positions</p>
                <p className="text-sm text-muted-foreground">{botData.riskSettings?.maxPositions}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Emergency Stop</p>
                <p className="text-sm text-muted-foreground">
                  {botData.riskSettings?.enableEmergencyStop ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Risk Disclaimer</p>
                <p className="text-sm text-muted-foreground">
                  Trading bots involve financial risk. Past performance is not indicative of future results. 
                  Make sure you understand the risks before proceeding.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-4">
              <CircleDollarSign className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Expected Initial Investment</p>
                <p className="text-sm text-muted-foreground">
                  This bot will allocate approximately {formatCurrency(Number(botData.settings?.investment || 0))} 
                  based on your current settings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button type="submit" className="w-full">Create Bot</Button>
    </form>
  )
}
