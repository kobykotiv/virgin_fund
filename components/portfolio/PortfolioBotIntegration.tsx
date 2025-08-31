"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Bot,
  Link,
  Unlink,
  Settings,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react'
import { Portfolio, BotConnection, RiskParameters } from '@/types/portfolio'
import { Bot as BotType } from '@/types/bot'

interface PortfolioBotIntegrationProps {
  portfolio: Portfolio
  availableBots: BotType[]
  onUpdatePortfolio: (portfolio: Portfolio) => void
}

export function PortfolioBotIntegration({
  portfolio,
  availableBots,
  onUpdatePortfolio
}: PortfolioBotIntegrationProps) {
  const [selectedBot, setSelectedBot] = useState<string>('')
  const [allocation, setAllocation] = useState<number>(10)
  const [customRiskParams, setCustomRiskParams] = useState<RiskParameters>(portfolio.riskParameters)
  const [isConnecting, setIsConnecting] = useState(false)

  const connectBot = async () => {
    if (!selectedBot) return

    setIsConnecting(true)
    try {
      const bot = availableBots.find(b => b.id === selectedBot)
      if (!bot) return

      const newConnection: BotConnection = {
        botId: bot.id,
        botName: bot.name,
        allocation,
        riskParameters: customRiskParams,
        isActive: true,
        lastSync: new Date().toISOString()
      }

      const updatedPortfolio = {
        ...portfolio,
        connectedBots: [...portfolio.connectedBots, newConnection],
        updatedAt: new Date().toISOString()
      }

      onUpdatePortfolio(updatedPortfolio)
      setSelectedBot('')
      setAllocation(10)
    } catch (error) {
      console.error('Error connecting bot:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectBot = (botId: string) => {
    const updatedPortfolio = {
      ...portfolio,
      connectedBots: portfolio.connectedBots.filter(conn => conn.botId !== botId),
      updatedAt: new Date().toISOString()
    }
    onUpdatePortfolio(updatedPortfolio)
  }

  const updateBotConnection = (botId: string, updates: Partial<BotConnection>) => {
    const updatedPortfolio = {
      ...portfolio,
      connectedBots: portfolio.connectedBots.map(conn =>
        conn.botId === botId ? { ...conn, ...updates, lastSync: new Date().toISOString() } : conn
      ),
      updatedAt: new Date().toISOString()
    }
    onUpdatePortfolio(updatedPortfolio)
  }

  const getTotalBotAllocation = () => {
    return portfolio.connectedBots.reduce((total, conn) => total + conn.allocation, 0)
  }

  const getAvailableBots = () => {
    const connectedBotIds = portfolio.connectedBots.map(conn => conn.botId)
    return availableBots.filter(bot => !connectedBotIds.includes(bot.id))
  }

  const getRiskStatus = (connection: BotConnection) => {
    const portfolioRisk = portfolio.riskParameters
    const botRisk = connection.riskParameters

    if (botRisk.maxDrawdown > portfolioRisk.maxDrawdown) return 'warning'
    if (botRisk.maxPositionSize > portfolioRisk.maxPositionSize) return 'warning'
    if (botRisk.maxDailyLoss > portfolioRisk.maxDailyLoss) return 'danger'

    return 'safe'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            Portfolio-Bot Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="connections" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="connections">Connected Bots</TabsTrigger>
              <TabsTrigger value="connect">Connect New Bot</TabsTrigger>
              <TabsTrigger value="risk">Risk Management</TabsTrigger>
            </TabsList>

            <TabsContent value="connections" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Connected Trading Bots</h3>
                <Badge variant="outline">
                  {portfolio.connectedBots.length} bots • {getTotalBotAllocation()}% allocated
                </Badge>
              </div>

              {portfolio.connectedBots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No bots connected to this portfolio</p>
                  <p className="text-sm">Connect trading bots to automate your portfolio management</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.connectedBots.map(connection => {
                    const riskStatus = getRiskStatus(connection)
                    return (
                      <Card key={connection.botId} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {connection.isActive ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              )}
                              <span className="font-medium">{connection.botName}</span>
                            </div>
                            <Badge variant={connection.isActive ? "default" : "secondary"}>
                              {connection.allocation}% allocation
                            </Badge>
                            <Badge variant={
                              riskStatus === 'safe' ? 'default' :
                              riskStatus === 'warning' ? 'secondary' : 'destructive'
                            }>
                              {riskStatus === 'safe' ? 'Risk OK' :
                               riskStatus === 'warning' ? 'Risk Warning' : 'High Risk'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateBotConnection(connection.botId, {
                                isActive: !connection.isActive
                              })}
                            >
                              {connection.isActive ? 'Pause' : 'Resume'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {/* Open risk settings */}}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => disconnectBot(connection.botId)}
                            >
                              <Unlink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="connect" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bot-select">Select Bot</Label>
                  <Select value={selectedBot} onValueChange={setSelectedBot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a bot to connect" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableBots().map(bot => (
                        <SelectItem key={bot.id} value={bot.id}>
                          {bot.name} ({bot.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="allocation">Allocation (%)</Label>
                  <Input
                    id="allocation"
                    type="number"
                    min="1"
                    max="100"
                    value={allocation}
                    onChange={(e) => setAllocation(Number(e.target.value))}
                  />
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Total bot allocation: {getTotalBotAllocation() + allocation}% of portfolio.
                  Ensure total allocation doesn't exceed 100%.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end">
                <Button
                  onClick={connectBot}
                  disabled={!selectedBot || isConnecting || getTotalBotAllocation() + allocation > 100}
                >
                  {isConnecting ? (
                    <>Connecting...</>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Connect Bot
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Portfolio Risk Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Max Drawdown</Label>
                      <div className="text-2xl font-bold text-red-600">
                        {portfolio.riskParameters.maxDrawdown}%
                      </div>
                    </div>
                    <div>
                      <Label>Max Position Size</Label>
                      <div className="text-2xl font-bold text-blue-600">
                        {portfolio.riskParameters.maxPositionSize}%
                      </div>
                    </div>
                    <div>
                      <Label>Max Daily Loss</Label>
                      <div className="text-2xl font-bold text-orange-600">
                        {portfolio.riskParameters.maxDailyLoss}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bot Risk Synchronization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Auto-sync risk parameters</Label>
                        <Switch defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        When enabled, connected bots will automatically inherit portfolio risk parameters
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        Sync All Bots
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
