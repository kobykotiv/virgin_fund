"use client"

import React, { useState, useEffect } from 'react'
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
  Server,
  Shield,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Key,
  Globe,
  Database,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Lock
} from 'lucide-react'
import { Portfolio } from '@/types/portfolio'
import { Bot as BotType } from '@/types/bot'

interface APIConfig {
  alpaca: {
    enabled: boolean
    apiKey: string
    apiSecret: string
    baseUrl: string
    rateLimit: number
    timeout: number
  }
  yahoo: {
    enabled: boolean
    apiKey: string
    rateLimit: number
    timeout: number
  }
  news: {
    enabled: boolean
    apiKey: string
    rateLimit: number
    timeout: number
  }
  cache: {
    enabled: boolean
    ttl: number // seconds
    maxSize: number // MB
  }
  rateLimit: {
    enabled: boolean
    requestsPerMinute: number
    requestsPerHour: number
  }
  security: {
    enabled: boolean
    apiKeyRequired: boolean
    ipWhitelist: string[]
    encryption: boolean
  }
}

interface APIStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  rateLimitHits: number
  cacheHits: number
  cacheMisses: number
  endpoints: Array<{
    path: string
    method: string
    requests: number
    avgResponseTime: number
    errorRate: number
  }>
  recentErrors: Array<{
    timestamp: Date
    endpoint: string
    error: string
    statusCode: number
  }>
}

interface APIEnhancementsProps {
  portfolios: Portfolio[]
  connectedBots: BotType[]
  apiConfig: APIConfig
  apiStats: APIStats
  onUpdateConfig: (config: Partial<APIConfig>) => void
  onTestConnection: (service: keyof APIConfig) => Promise<boolean>
  onClearCache: () => Promise<void>
  onResetStats: () => void
}

export function APIEnhancements({
  portfolios,
  connectedBots,
  apiConfig,
  apiStats,
  onUpdateConfig,
  onTestConnection,
  onClearCache,
  onResetStats
}: APIEnhancementsProps) {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

  const handleTestConnection = async (service: keyof APIConfig) => {
    setTestingConnection(service)
    try {
      const success = await onTestConnection(service)
      // Handle success/failure feedback
    } catch (error) {
      console.error('Connection test failed:', error)
    } finally {
      setTestingConnection(null)
    }
  }

  const handleClearCache = async () => {
    try {
      await onClearCache()
    } catch (error) {
      console.error('Cache clear failed:', error)
    }
  }

  const getSuccessRate = () => {
    if (apiStats.totalRequests === 0) return 0
    return (apiStats.successfulRequests / apiStats.totalRequests) * 100
  }

  const getCacheHitRate = () => {
    const total = apiStats.cacheHits + apiStats.cacheMisses
    if (total === 0) return 0
    return (apiStats.cacheHits / total) * 100
  }

  const getErrorRate = () => {
    if (apiStats.totalRequests === 0) return 0
    return (apiStats.failedRequests / apiStats.totalRequests) * 100
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="w-5 h-5 mr-2" />
            API Enhancements & Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="cache">Cache</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* API Health Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">
                      {apiStats.totalRequests.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Requests</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">
                      {getSuccessRate().toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">
                      {apiStats.averageResponseTime.toFixed(0)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <div className="text-2xl font-bold">
                      {getErrorRate().toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Error Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Service Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${apiConfig.alpaca.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className="font-medium">Alpaca Markets</div>
                          <div className="text-sm text-muted-foreground">Trading API</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestConnection('alpaca')}
                        disabled={testingConnection === 'alpaca'}
                      >
                        {testingConnection === 'alpaca' ? 'Testing...' : 'Test'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${apiConfig.yahoo.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className="font-medium">Yahoo Finance</div>
                          <div className="text-sm text-muted-foreground">Market Data</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestConnection('yahoo')}
                        disabled={testingConnection === 'yahoo'}
                      >
                        {testingConnection === 'yahoo' ? 'Testing...' : 'Test'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${apiConfig.news.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className="font-medium">News API</div>
                          <div className="text-sm text-muted-foreground">Market News</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestConnection('news')}
                        disabled={testingConnection === 'news'}
                      >
                        {testingConnection === 'news' ? 'Testing...' : 'Test'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              {/* Alpaca Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Alpaca Markets Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="alpaca-enabled"
                      checked={apiConfig.alpaca.enabled}
                      onCheckedChange={(enabled) => onUpdateConfig({
                        alpaca: { ...apiConfig.alpaca, enabled }
                      })}
                    />
                    <Label htmlFor="alpaca-enabled">Enable Alpaca Integration</Label>
                  </div>

                  {apiConfig.alpaca.enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="alpaca-key">API Key</Label>
                          <Input
                            id="alpaca-key"
                            type="password"
                            value={apiConfig.alpaca.apiKey}
                            onChange={(e) => onUpdateConfig({
                              alpaca: { ...apiConfig.alpaca, apiKey: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="alpaca-secret">API Secret</Label>
                          <Input
                            id="alpaca-secret"
                            type="password"
                            value={apiConfig.alpaca.apiSecret}
                            onChange={(e) => onUpdateConfig({
                              alpaca: { ...apiConfig.alpaca, apiSecret: e.target.value }
                            })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="alpaca-rate-limit">Rate Limit (req/min)</Label>
                          <Input
                            id="alpaca-rate-limit"
                            type="number"
                            value={apiConfig.alpaca.rateLimit}
                            onChange={(e) => onUpdateConfig({
                              alpaca: { ...apiConfig.alpaca, rateLimit: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="alpaca-timeout">Timeout (ms)</Label>
                          <Input
                            id="alpaca-timeout"
                            type="number"
                            value={apiConfig.alpaca.timeout}
                            onChange={(e) => onUpdateConfig({
                              alpaca: { ...apiConfig.alpaca, timeout: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="alpaca-base-url">Base URL</Label>
                          <Input
                            id="alpaca-base-url"
                            value={apiConfig.alpaca.baseUrl}
                            onChange={(e) => onUpdateConfig({
                              alpaca: { ...apiConfig.alpaca, baseUrl: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Yahoo Finance Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Yahoo Finance Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="yahoo-enabled"
                      checked={apiConfig.yahoo.enabled}
                      onCheckedChange={(enabled) => onUpdateConfig({
                        yahoo: { ...apiConfig.yahoo, enabled }
                      })}
                    />
                    <Label htmlFor="yahoo-enabled">Enable Yahoo Finance</Label>
                  </div>

                  {apiConfig.yahoo.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="yahoo-key">API Key (Optional)</Label>
                        <Input
                          id="yahoo-key"
                          type="password"
                          value={apiConfig.yahoo.apiKey}
                          onChange={(e) => onUpdateConfig({
                            yahoo: { ...apiConfig.yahoo, apiKey: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="yahoo-rate-limit">Rate Limit (req/min)</Label>
                        <Input
                          id="yahoo-rate-limit"
                          type="number"
                          value={apiConfig.yahoo.rateLimit}
                          onChange={(e) => onUpdateConfig({
                            yahoo: { ...apiConfig.yahoo, rateLimit: Number(e.target.value) }
                          })}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {/* Rate Limiting */}
              <Card>
                <CardHeader>
                  <CardTitle>Rate Limiting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="rate-limit-enabled"
                      checked={apiConfig.rateLimit.enabled}
                      onCheckedChange={(enabled) => onUpdateConfig({
                        rateLimit: { ...apiConfig.rateLimit, enabled }
                      })}
                    />
                    <Label htmlFor="rate-limit-enabled">Enable Rate Limiting</Label>
                  </div>

                  {apiConfig.rateLimit.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="requests-per-minute">Requests per Minute</Label>
                        <Input
                          id="requests-per-minute"
                          type="number"
                          value={apiConfig.rateLimit.requestsPerMinute}
                          onChange={(e) => onUpdateConfig({
                            rateLimit: { ...apiConfig.rateLimit, requestsPerMinute: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="requests-per-hour">Requests per Hour</Label>
                        <Input
                          id="requests-per-hour"
                          type="number"
                          value={apiConfig.rateLimit.requestsPerHour}
                          onChange={(e) => onUpdateConfig({
                            rateLimit: { ...apiConfig.rateLimit, requestsPerHour: Number(e.target.value) }
                          })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Rate limit hits: {apiStats.rateLimitHits}
                  </div>
                </CardContent>
              </Card>

              {/* Endpoint Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Endpoint Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiStats.endpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">
                            {endpoint.method} {endpoint.path}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {endpoint.requests} requests | {endpoint.avgResponseTime.toFixed(0)}ms avg
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {(endpoint.errorRate * 100).toFixed(1)}% errors
                          </div>
                          <Progress
                            value={(1 - endpoint.errorRate) * 100}
                            className="w-20 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    API Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="security-enabled"
                      checked={apiConfig.security.enabled}
                      onCheckedChange={(enabled) => onUpdateConfig({
                        security: { ...apiConfig.security, enabled }
                      })}
                    />
                    <Label htmlFor="security-enabled">Enable Security Features</Label>
                  </div>

                  {apiConfig.security.enabled && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="api-key-required"
                          checked={apiConfig.security.apiKeyRequired}
                          onCheckedChange={(apiKeyRequired) => onUpdateConfig({
                            security: { ...apiConfig.security, apiKeyRequired }
                          })}
                        />
                        <Label htmlFor="api-key-required">Require API Key</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="encryption"
                          checked={apiConfig.security.encryption}
                          onCheckedChange={(encryption) => onUpdateConfig({
                            security: { ...apiConfig.security, encryption }
                          })}
                        />
                        <Label htmlFor="encryption">Enable Encryption</Label>
                      </div>

                      <div>
                        <Label htmlFor="ip-whitelist">IP Whitelist (one per line)</Label>
                        <textarea
                          id="ip-whitelist"
                          className="w-full h-24 p-2 border rounded-md"
                          value={apiConfig.security.ipWhitelist.join('\n')}
                          onChange={(e) => onUpdateConfig({
                            security: {
                              ...apiConfig.security,
                              ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim())
                            }
                          })}
                          placeholder="192.168.1.1&#10;10.0.0.1"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cache" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cache Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cache-enabled"
                      checked={apiConfig.cache.enabled}
                      onCheckedChange={(enabled) => onUpdateConfig({
                        cache: { ...apiConfig.cache, enabled }
                      })}
                    />
                    <Label htmlFor="cache-enabled">Enable Caching</Label>
                  </div>

                  {apiConfig.cache.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cache-ttl">TTL (seconds)</Label>
                        <Input
                          id="cache-ttl"
                          type="number"
                          value={apiConfig.cache.ttl}
                          onChange={(e) => onUpdateConfig({
                            cache: { ...apiConfig.cache, ttl: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cache-max-size">Max Size (MB)</Label>
                        <Input
                          id="cache-max-size"
                          type="number"
                          value={apiConfig.cache.maxSize}
                          onChange={(e) => onUpdateConfig({
                            cache: { ...apiConfig.cache, maxSize: Number(e.target.value) }
                          })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {getCacheHitRate().toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {apiStats.cacheHits.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Cache Hits</div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" onClick={handleClearCache}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              {/* Recent Errors */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent API Errors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {apiStats.recentErrors.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                        <p className="text-muted-foreground">No recent errors</p>
                      </div>
                    ) : (
                      apiStats.recentErrors.map((error, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <div className="flex-1">
                            <div className="font-medium">{error.endpoint}</div>
                            <div className="text-sm text-muted-foreground">
                              {error.timestamp.toLocaleString()} | Status: {error.statusCode}
                            </div>
                            <div className="text-sm text-red-600 mt-1">{error.error}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Reset Stats */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">API Statistics</div>
                      <div className="text-sm text-muted-foreground">
                        Reset all API monitoring statistics
                      </div>
                    </div>
                    <Button variant="outline" onClick={onResetStats}>
                      Reset Stats
                    </Button>
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
