"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  DollarSign,
  Target,
  Shield,
  Zap
} from 'lucide-react'
import { Portfolio, RiskParameters } from '@/types/portfolio'

interface Position {
  id: string
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  marketValue: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
  stopLoss?: number
  takeProfit?: number
  botId?: string
  botName?: string
  riskLevel: 'low' | 'medium' | 'high'
}

interface PositionManagementProps {
  portfolio: Portfolio
  positions: Position[]
  onUpdatePosition: (positionId: string, updates: Partial<Position>) => void
  onClosePosition: (positionId: string) => void
}

export function PositionManagement({
  portfolio,
  positions,
  onUpdatePosition,
  onClosePosition
}: PositionManagementProps) {
  const [autoRiskManagement, setAutoRiskManagement] = useState(true)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [riskAlerts, setRiskAlerts] = useState<Array<{
    id: string
    positionId: string
    type: 'warning' | 'danger'
    message: string
    action: string
  }>>([])

  useEffect(() => {
    // Generate risk alerts based on position analysis
    const alerts = positions.flatMap(position => {
      const alerts: Array<{
        id: string
        positionId: string
        type: 'warning' | 'danger'
        message: string
        action: string
      }> = []

      // Check stop loss proximity
      if (position.stopLoss && position.currentPrice <= position.stopLoss * 1.05) {
        alerts.push({
          id: `stop-loss-${position.id}`,
          positionId: position.id,
          type: 'warning',
          message: `${position.symbol} approaching stop loss at $${position.stopLoss}`,
          action: 'Monitor closely'
        })
      }

      // Check take profit proximity
      if (position.takeProfit && position.currentPrice >= position.takeProfit * 0.95) {
        alerts.push({
          id: `take-profit-${position.id}`,
          positionId: position.id,
          type: 'warning',
          message: `${position.symbol} approaching take profit at $${position.takeProfit}`,
          action: 'Consider taking profits'
        })
      }

      // Check position size vs portfolio limits
      const positionSizePercent = (position.marketValue / portfolio.value) * 100
      if (positionSizePercent > portfolio.riskParameters.maxPositionSize) {
        alerts.push({
          id: `position-size-${position.id}`,
          positionId: position.id,
          type: 'danger',
          message: `${position.symbol} exceeds max position size (${positionSizePercent.toFixed(1)}% > ${portfolio.riskParameters.maxPositionSize}%)`,
          action: 'Reduce position size'
        })
      }

      // Check drawdown impact
      if (position.unrealizedPnLPercent < -10) {
        alerts.push({
          id: `drawdown-${position.id}`,
          positionId: position.id,
          type: 'danger',
          message: `${position.symbol} has ${Math.abs(position.unrealizedPnLPercent).toFixed(1)}% loss`,
          action: 'Consider stop loss or position reduction'
        })
      }

      return alerts
    })

    setRiskAlerts(alerts)
  }, [positions, portfolio])

  const getPositionRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-600'
    if (pnl < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const calculatePortfolioImpact = (position: Position) => {
    const impact = (Math.abs(position.unrealizedPnL) / portfolio.value) * 100
    return impact.toFixed(2)
  }

  const handleStopLossUpdate = (positionId: string, stopLoss: number) => {
    onUpdatePosition(positionId, { stopLoss })
  }

  const handleTakeProfitUpdate = (positionId: string, takeProfit: number) => {
    onUpdatePosition(positionId, { takeProfit })
  }

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive' as const
      case 'medium': return 'secondary' as const
      default: return 'default' as const
    }
  }

  return (
    <div className="space-y-6">
      {/* Risk Management Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Risk Management Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-risk">Automatic Risk Management</Label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust positions based on risk parameters
              </p>
            </div>
            <Switch
              id="auto-risk"
              checked={autoRiskManagement}
              onCheckedChange={setAutoRiskManagement}
            />
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      {riskAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Risk Alerts ({riskAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskAlerts.map(alert => (
                <Alert key={alert.id} className={
                  alert.type === 'danger' ? 'border-red-500' : 'border-yellow-500'
                }>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">{alert.action}</p>
                      </div>
                      <Badge variant={alert.type === 'danger' ? 'destructive' : 'secondary'}>
                        {alert.type}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Avg Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Market Value</TableHead>
                <TableHead>Unrealized P&L</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Stop Loss</TableHead>
                <TableHead>Take Profit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map(position => (
                <TableRow key={position.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{position.symbol}</div>
                      {position.botName && (
                        <div className="text-xs text-muted-foreground">
                          Bot: {position.botName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{position.quantity.toLocaleString()}</TableCell>
                  <TableCell>${position.avgPrice.toFixed(2)}</TableCell>
                  <TableCell>${position.currentPrice.toFixed(2)}</TableCell>
                  <TableCell>${position.marketValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className={getPnLColor(position.unrealizedPnL)}>
                      <div>${position.unrealizedPnL.toFixed(2)}</div>
                      <div className="text-xs">
                        ({position.unrealizedPnLPercent > 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(position.riskLevel)}>
                      {position.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {selectedPosition === position.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={position.stopLoss || ''}
                        onChange={(e) => handleStopLossUpdate(position.id, parseFloat(e.target.value))}
                        onBlur={() => setSelectedPosition(null)}
                        className="w-20 h-8"
                        autoFocus
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPosition(position.id)}
                        className="text-xs"
                      >
                        {position.stopLoss ? `$${position.stopLoss.toFixed(2)}` : 'Set'}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {selectedPosition === `${position.id}-tp` ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={position.takeProfit || ''}
                        onChange={(e) => handleTakeProfitUpdate(position.id, parseFloat(e.target.value))}
                        onBlur={() => setSelectedPosition(null)}
                        className="w-20 h-8"
                        autoFocus
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPosition(`${position.id}-tp`)}
                        className="text-xs"
                      >
                        {position.takeProfit ? `$${position.takeProfit.toFixed(2)}` : 'Set'}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Open position details */}}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onClosePosition(position.id)}
                      >
                        Close
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Portfolio Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Risk Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {positions.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Positions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {positions.filter(p => p.unrealizedPnL > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Profitable Positions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {positions.filter(p => p.riskLevel === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">High Risk Positions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
