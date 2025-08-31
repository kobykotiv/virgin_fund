"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Zap,
  Wifi,
  WifiOff,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3,
  Radio,
  Signal
} from 'lucide-react'
import { Portfolio } from '@/types/portfolio'
import { Bot as BotType } from '@/types/bot'

interface RealTimeConfig {
  enabled: boolean
  updateInterval: number // milliseconds
  maxRetries: number
  retryDelay: number // milliseconds
  dataSources: ('alpaca' | 'yahoo' | 'websocket' | 'api')[]
  alertsEnabled: boolean
  priceAlerts: boolean
  volumeAlerts: boolean
  newsAlerts: boolean
}

interface RealTimeData {
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error'
  lastUpdate: Date | null
  latency: number | null
  activeStreams: string[]
  dataPointsReceived: number
  errors: number
  priceUpdates: Array<{
    symbol: string
    price: number
    change: number
    changePercent: number
    volume: number
    timestamp: Date
  }>
  portfolioUpdates: Array<{
    portfolioId: string
    totalValue: number
    change: number
    changePercent: number
    timestamp: Date
  }>
}

interface RealTimeUpdatesProps {
  portfolios: Portfolio[]
  connectedBots: BotType[]
  realTimeConfig: RealTimeConfig
  realTimeData: RealTimeData
  onUpdateConfig: (config: Partial<RealTimeConfig>) => void
  onConnect: () => Promise<void>
  onDisconnect: () => Promise<void>
  onReconnect: () => Promise<void>
}

export function RealTimeUpdates({
  portfolios,
  connectedBots,
  realTimeConfig,
  realTimeData,
  onUpdateConfig,
  onConnect,
  onDisconnect,
  onReconnect
}: RealTimeUpdatesProps) {
  const [selectedTab, setSelectedTab] = useState('status')
  const [isConfiguring, setIsConfiguring] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (realTimeConfig.enabled && realTimeData.connectionStatus === 'connected') {
      intervalRef.current = setInterval(() => {
        // Simulate real-time updates for demo
        console.log('Real-time update tick')
      }, realTimeConfig.updateInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [realTimeConfig.enabled, realTimeData.connectionStatus, realTimeConfig.updateInterval])

  const handleConnect = async () => {
    try {
      await onConnect()
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await onDisconnect()
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  const handleReconnect = async () => {
    try {
      await onReconnect()
    } catch (error) {
      console.error('Reconnect failed:', error)
    }
  }

  const getConnectionStatusColor = () => {
    switch (realTimeData.connectionStatus) {
      case 'connected': return 'text-green-600'
      case 'connecting': return 'text-yellow-600'
      case 'disconnected': return 'text-gray-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getConnectionStatusIcon = () => {
    switch (realTimeData.connectionStatus) {
      case 'connected': return <Wifi className="w-4 h-4" />
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'disconnected': return <WifiOff className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      default: return <WifiOff className="w-4 h-4" />
    }
  }

  const getConnectionStatusText = () => {
    switch (realTimeData.connectionStatus) {
      case 'connected': return 'Connected'
      case 'connecting': return 'Connecting...'
      case 'disconnected': return 'Disconnected'
      case 'error': return 'Connection Error'
      default: return 'Unknown'
    }
  }

  const formatLatency = (latency: number | null) => {
    if (latency === null) return 'N/A'
    if (latency < 1000) return `${latency}ms`
    return `${(latency / 1000).toFixed(1)}s`
  }

  const formatLastUpdate = (lastUpdate: Date | null) => {
    if (!lastUpdate) return 'Never'
    const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Real-Time Updates & Live Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="streams">Streams</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-4">
              {/* Connection Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getConnectionStatusIcon()}
                      <div>
                        <div className={`font-medium ${getConnectionStatusColor()}`}>
                          {getConnectionStatusText()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Real-time data streaming
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {realTimeData.connectionStatus === 'disconnected' && (
                        <Button size="sm" onClick={handleConnect}>
                          <Wifi className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      )}
                      {realTimeData.connectionStatus === 'connected' && (
                        <Button size="sm" variant="outline" onClick={handleDisconnect}>
                          <WifiOff className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      )}
                      {(realTimeData.connectionStatus === 'error' || realTimeData.connectionStatus === 'disconnected') && (
                        <Button size="sm" onClick={handleReconnect}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reconnect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">
                      {formatLatency(realTimeData.latency)}
                    </div>
                    <div className="text-sm text-muted-foreground">Latency</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">
                      {realTimeData.dataPointsReceived.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Data Points</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Radio className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">
                      {realTimeData.activeStreams.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Streams</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <div className="text-2xl font-bold">
                      {realTimeData.errors}
                    </div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </CardContent>
                </Card>
              </div>

              {/* Last Update */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Last Update</div>
                        <div className="text-sm text-muted-foreground">
                          {formatLastUpdate(realTimeData.lastUpdate)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {realTimeConfig.updateInterval}ms interval
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Status Alert */}
              {realTimeData.connectionStatus === 'error' && (
                <Alert className="border-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Real-time connection encountered an error. Attempting to reconnect...
                  </AlertDescription>
                </Alert>
              )}

              {realTimeData.connectionStatus === 'connected' && (
                <Alert className="border-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Real-time data streaming is active and healthy.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="streams" className="space-y-4">
              {/* Active Streams */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Data Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realTimeData.activeStreams.length === 0 ? (
                      <div className="text-center py-8">
                        <Radio className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No active streams</p>
                      </div>
                    ) : (
                      realTimeData.activeStreams.map((stream, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Signal className="w-4 h-4 text-green-600" />
                            <div>
                              <div className="font-medium">{stream}</div>
                              <div className="text-sm text-muted-foreground">Active</div>
                            </div>
                          </div>
                          <Badge variant="default">Live</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Price Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Price Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realTimeData.priceUpdates.slice(0, 10).map((update, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{update.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {update.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${update.price.toFixed(2)}</div>
                          <div className={`text-sm ${update.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {update.change >= 0 ? '+' : ''}{update.change.toFixed(2)} ({update.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="alerts-enabled"
                      checked={realTimeConfig.alertsEnabled}
                      onCheckedChange={(alertsEnabled) => onUpdateConfig({ alertsEnabled })}
                    />
                    <Label htmlFor="alerts-enabled">Enable Real-Time Alerts</Label>
                  </div>

                  {realTimeConfig.alertsEnabled && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="price-alerts"
                          checked={realTimeConfig.priceAlerts}
                          onCheckedChange={(priceAlerts) => onUpdateConfig({ priceAlerts })}
                        />
                        <Label htmlFor="price-alerts">Price Movement Alerts</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="volume-alerts"
                          checked={realTimeConfig.volumeAlerts}
                          onCheckedChange={(volumeAlerts) => onUpdateConfig({ volumeAlerts })}
                        />
                        <Label htmlFor="volume-alerts">Volume Spike Alerts</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="news-alerts"
                          checked={realTimeConfig.newsAlerts}
                          onCheckedChange={(newsAlerts) => onUpdateConfig({ newsAlerts })}
                        />
                        <Label htmlFor="news-alerts">News & Event Alerts</Label>
                      </div>
                    </div>
                  )}

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Real-time alerts will notify you of significant market events and portfolio changes.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="real-time-enabled"
                      checked={realTimeConfig.enabled}
                      onCheckedChange={(enabled) => onUpdateConfig({ enabled })}
                    />
                    <Label htmlFor="real-time-enabled">Enable Real-Time Updates</Label>
                  </div>

                  <div>
                    <Label htmlFor="update-interval">Update Interval (ms)</Label>
                    <Select
                      value={realTimeConfig.updateInterval.toString()}
                      onValueChange={(value) => onUpdateConfig({ updateInterval: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">1 second</SelectItem>
                        <SelectItem value="5000">5 seconds</SelectItem>
                        <SelectItem value="10000">10 seconds</SelectItem>
                        <SelectItem value="30000">30 seconds</SelectItem>
                        <SelectItem value="60000">1 minute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Data Sources</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(['alpaca', 'yahoo', 'websocket', 'api'] as const).map((source) => (
                        <label key={source} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={realTimeConfig.dataSources.includes(source)}
                            onChange={(e) => {
                              const sources = realTimeConfig.dataSources
                              if (e.target.checked) {
                                onUpdateConfig({ dataSources: [...sources, source] })
                              } else {
                                onUpdateConfig({
                                  dataSources: sources.filter(s => s !== source)
                                })
                              }
                            }}
                          />
                          <span className="text-sm capitalize">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-retries">Max Retries</Label>
                      <Input
                        id="max-retries"
                        type="number"
                        value={realTimeConfig.maxRetries}
                        onChange={(e) => onUpdateConfig({ maxRetries: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="retry-delay">Retry Delay (ms)</Label>
                      <Input
                        id="retry-delay"
                        type="number"
                        value={realTimeConfig.retryDelay}
                        onChange={(e) => onUpdateConfig({ retryDelay: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Connection Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Latency</span>
                          <span className="font-medium">{formatLatency(realTimeData.latency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Data Points/Hour</span>
                          <span className="font-medium">
                            {Math.round(realTimeData.dataPointsReceived / (Date.now() - (realTimeData.lastUpdate?.getTime() || Date.now())) * 3600000)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Error Rate</span>
                          <span className="font-medium">
                            {realTimeData.dataPointsReceived > 0
                              ? ((realTimeData.errors / realTimeData.dataPointsReceived) * 100).toFixed(2)
                              : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Uptime</span>
                          <span className="font-medium">
                            {realTimeData.connectionStatus === 'connected' ? '100%' : '0%'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Portfolio Updates</h3>
                      <div className="space-y-3">
                        {realTimeData.portfolioUpdates.slice(0, 5).map((update, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{update.portfolioId}</span>
                            <div className="text-right">
                              <div className="font-medium">${update.totalValue.toLocaleString()}</div>
                              <div className={`text-sm ${update.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {update.change >= 0 ? '+' : ''}{update.change.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
