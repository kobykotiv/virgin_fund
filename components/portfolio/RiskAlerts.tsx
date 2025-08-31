"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Mail,
  MessageSquare,
  Smartphone,
  Settings
} from 'lucide-react'
import { Portfolio, RiskParameters } from '@/types/portfolio'

interface RiskAlert {
  id: string
  type: 'drawdown' | 'volatility' | 'position_size' | 'daily_loss' | 'concentration' | 'liquidity' | 'correlation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  value: number
  threshold: number
  timestamp: Date
  acknowledged: boolean
  resolved: boolean
}

interface AlertRule {
  id: string
  type: 'drawdown' | 'volatility' | 'position_size' | 'daily_loss' | 'concentration' | 'liquidity' | 'correlation'
  enabled: boolean
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  notificationMethods: ('email' | 'sms' | 'push' | 'in_app')[]
  cooldownMinutes: number
}

interface RiskAlertsProps {
  portfolio: Portfolio
  alerts: RiskAlert[]
  alertRules: AlertRule[]
  onAcknowledgeAlert: (alertId: string) => void
  onResolveAlert: (alertId: string) => void
  onUpdateRule: (ruleId: string, updates: Partial<AlertRule>) => void
  onCreateRule: (rule: Omit<AlertRule, 'id'>) => void
  onDeleteRule: (ruleId: string) => void
}

export function RiskAlerts({
  portfolio,
  alerts,
  alertRules,
  onAcknowledgeAlert,
  onResolveAlert,
  onUpdateRule,
  onCreateRule,
  onDeleteRule
}: RiskAlertsProps) {
  const [selectedTab, setSelectedTab] = useState('active')
  const [newRule, setNewRule] = useState<Partial<AlertRule>>({
    type: 'drawdown',
    enabled: true,
    threshold: 5,
    severity: 'medium',
    notificationMethods: ['in_app'],
    cooldownMinutes: 60
  })

  const activeAlerts = alerts.filter(alert => !alert.resolved)
  const resolvedAlerts = alerts.filter(alert => alert.resolved)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <Bell className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'drawdown': return 'Drawdown'
      case 'volatility': return 'Volatility'
      case 'position_size': return 'Position Size'
      case 'daily_loss': return 'Daily Loss'
      case 'concentration': return 'Concentration'
      case 'liquidity': return 'Liquidity'
      case 'correlation': return 'Correlation'
      default: return type
    }
  }

  const handleCreateRule = () => {
    if (newRule.type && newRule.threshold !== undefined) {
      onCreateRule(newRule as Omit<AlertRule, 'id'>)
      setNewRule({
        type: 'drawdown',
        enabled: true,
        threshold: 5,
        severity: 'medium',
        notificationMethods: ['in_app'],
        cooldownMinutes: 60
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Risk Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                Active Alerts ({activeAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="rules">Alert Rules</TabsTrigger>
              <TabsTrigger value="history">
                History ({resolvedAlerts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">
                    Your portfolio is within all risk parameters. Great job!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <Alert key={alert.id} className={`border-2 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getSeverityIcon(alert.severity)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="secondary">
                                {getAlertTypeLabel(alert.type)}
                              </Badge>
                            </div>
                            <AlertDescription className="font-medium">
                              {alert.message}
                            </AlertDescription>
                            <div className="text-sm text-muted-foreground mt-2">
                              <div>Current: {alert.value.toFixed(2)}% | Threshold: {alert.threshold}%</div>
                              <div>{alert.timestamp.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onAcknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => onResolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                      {alert.value > alert.threshold && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Risk Level</span>
                            <span>{((alert.value / alert.threshold) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress
                            value={Math.min(100, (alert.value / alert.threshold) * 100)}
                            className="h-2"
                          />
                        </div>
                      )}
                    </Alert>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              {/* Current Rules */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Alert Rules</h3>
                {alertRules.map((rule) => (
                  <Card key={rule.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">
                              {getAlertTypeLabel(rule.type)}
                            </Badge>
                            <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                              {rule.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                            <Badge className={getSeverityColor(rule.severity)}>
                              {rule.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Threshold: {rule.threshold}% | Cooldown: {rule.cooldownMinutes} minutes
                          </div>
                          <div className="flex space-x-1 mt-1">
                            {rule.notificationMethods.map((method) => (
                              <Badge key={method} variant="outline" className="text-xs">
                                {method === 'email' && <Mail className="w-3 h-3 mr-1" />}
                                {method === 'sms' && <Smartphone className="w-3 h-3 mr-1" />}
                                {method === 'push' && <Bell className="w-3 h-3 mr-1" />}
                                {method === 'in_app' && <MessageSquare className="w-3 h-3 mr-1" />}
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(enabled) => onUpdateRule(rule.id, { enabled })}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteRule(rule.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Create New Rule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create New Alert Rule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rule-type">Alert Type</Label>
                      <Select
                        value={newRule.type}
                        onValueChange={(value: any) => setNewRule(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drawdown">Drawdown</SelectItem>
                          <SelectItem value="volatility">Volatility</SelectItem>
                          <SelectItem value="position_size">Position Size</SelectItem>
                          <SelectItem value="daily_loss">Daily Loss</SelectItem>
                          <SelectItem value="concentration">Concentration</SelectItem>
                          <SelectItem value="liquidity">Liquidity</SelectItem>
                          <SelectItem value="correlation">Correlation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rule-threshold">Threshold (%)</Label>
                      <Input
                        id="rule-threshold"
                        type="number"
                        value={newRule.threshold}
                        onChange={(e) => setNewRule(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rule-severity">Severity</Label>
                      <Select
                        value={newRule.severity}
                        onValueChange={(value: any) => setNewRule(prev => ({ ...prev, severity: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rule-cooldown">Cooldown (minutes)</Label>
                      <Input
                        id="rule-cooldown"
                        type="number"
                        value={newRule.cooldownMinutes}
                        onChange={(e) => setNewRule(prev => ({ ...prev, cooldownMinutes: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Notification Methods</Label>
                    <div className="flex space-x-4 mt-2">
                      {(['email', 'sms', 'push', 'in_app'] as const).map((method) => (
                        <label key={method} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newRule.notificationMethods?.includes(method)}
                            onChange={(e) => {
                              const methods = newRule.notificationMethods || []
                              if (e.target.checked) {
                                setNewRule(prev => ({ ...prev, notificationMethods: [...methods, method] }))
                              } else {
                                setNewRule(prev => ({
                                  ...prev,
                                  notificationMethods: methods.filter(m => m !== method)
                                }))
                              }
                            }}
                          />
                          <span className="text-sm capitalize">{method.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleCreateRule}>
                      Create Rule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {resolvedAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <BellOff className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Alert History</h3>
                  <p className="text-muted-foreground">
                    Resolved alerts will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resolvedAlerts.map((alert) => (
                    <Card key={alert.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className="text-green-600">
                                  RESOLVED
                                </Badge>
                                <Badge variant="secondary">
                                  {getAlertTypeLabel(alert.type)}
                                </Badge>
                              </div>
                              <div className="font-medium text-muted-foreground">
                                {alert.message}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Resolved: {alert.timestamp.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
