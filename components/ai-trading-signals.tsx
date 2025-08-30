"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Zap
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AISignal {
  id: string
  symbol: string
  action: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  price: number
  targetPrice: number
  stopLoss: number
  reasoning: string
  indicators: string[]
  timestamp: string
  status: 'active' | 'executed' | 'expired'
  pnl?: number
}

interface AITradingSignalsProps {
  userId?: string
}

export function AITradingSignals({ userId }: AITradingSignalsProps) {
  const [signals, setSignals] = useState<AISignal[]>([])
  const [activeTab, setActiveTab] = useState("active")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadAISignals()
  }, [])

  const loadAISignals = async () => {
    try {
      setIsLoading(true)

      // Fetch AI signals from API
      const response = await fetch('/api/ai/signals')
      const data = await response.json()
      setSignals(data)

    } catch (error) {
      console.error('Error loading AI signals:', error)
      toast({
        title: "Error",
        description: "Failed to load AI trading signals",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExecuteSignal = async (signalId: string) => {
    try {
      const response = await fetch(`/api/ai/signals/${signalId}/execute`, {
        method: 'POST',
      })

      if (response.ok) {
        setSignals(prev => prev.map(signal =>
          signal.id === signalId
            ? { ...signal, status: 'executed' as const }
            : signal
        ))

        toast({
          title: "Signal Executed",
          description: "AI signal has been executed in your portfolio",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute signal",
        variant: "destructive",
      })
    }
  }

  const getSignalIcon = (action: string) => {
    switch (action) {
      case 'BUY':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'SELL':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      case 'HOLD':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <BarChart3 className="h-5 w-5" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'executed':
        return <Badge variant="secondary">Executed</Badge>
      case 'expired':
        return <Badge variant="outline">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderSignalCard = (signal: AISignal) => (
    <Card key={signal.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getSignalIcon(signal.action)}
            <div>
              <CardTitle className="text-lg">{signal.symbol}</CardTitle>
              <CardDescription>
                {signal.action} • {new Date(signal.timestamp).toLocaleString()}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(signal.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-lg font-semibold">${signal.price.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Target Price</div>
              <div className="text-lg font-semibold text-green-600">
                ${signal.targetPrice.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Stop Loss</div>
              <div className="text-lg font-semibold text-red-600">
                ${signal.stopLoss.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Confidence</div>
              <div className={`text-lg font-semibold ${getConfidenceColor(signal.confidence)}`}>
                {signal.confidence}%
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">AI Reasoning</div>
            <div className="text-sm">{signal.reasoning}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Key Indicators</div>
            <div className="flex flex-wrap gap-1">
              {signal.indicators.map((indicator, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {indicator}
                </Badge>
              ))}
            </div>
          </div>

          {signal.status === 'active' && (
            <div className="flex space-x-2">
              <Button
                onClick={() => handleExecuteSignal(signal.id)}
                className="flex-1"
              >
                <Zap className="h-4 w-4 mr-2" />
                Execute Signal
              </Button>
              <Button variant="outline">
                <Target className="h-4 w-4" />
              </Button>
            </div>
          )}

          {signal.status === 'executed' && signal.pnl !== undefined && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">P&L</div>
              <div className={`text-lg font-semibold ${signal.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${signal.pnl.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const filteredSignals = signals.filter(signal => {
    switch (activeTab) {
      case 'active':
        return signal.status === 'active'
      case 'executed':
        return signal.status === 'executed'
      case 'expired':
        return signal.status === 'expired'
      default:
        return true
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-600" />
            AI Trading Signals
          </h2>
          <p className="text-muted-foreground">
            Advanced AI-powered trading signals with machine learning analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <span>{signals.filter(s => s.status === 'active').length} Active</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>{signals.filter(s => s.status === 'executed').length} Executed</span>
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Signals</TabsTrigger>
          <TabsTrigger value="executed">Executed</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredSignals.length > 0 ? (
            filteredSignals.map(renderSignalCard)
          ) : (
            <Card className="p-8 text-center">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Signals</h3>
              <p className="text-muted-foreground mb-4">
                AI is currently analyzing markets. New signals will appear here.
              </p>
              <Button onClick={loadAISignals}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="executed" className="space-y-4">
          {filteredSignals.length > 0 ? (
            filteredSignals.map(renderSignalCard)
          ) : (
            <Card className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Executed Signals</h3>
              <p className="text-muted-foreground">
                Signals you've executed will appear here.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {filteredSignals.length > 0 ? (
            filteredSignals.map(renderSignalCard)
          ) : (
            <Card className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Expired Signals</h3>
              <p className="text-muted-foreground">
                Expired signals will appear here.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
