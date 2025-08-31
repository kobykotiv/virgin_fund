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
  Database,
  Zap,
  RefreshCw,
  Cloud,
  Server,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Settings,
  Download,
  Upload,
  Sync,
  Clock,
  Activity
} from 'lucide-react'
import { Portfolio } from '@/types/portfolio'
import { Bot as BotType } from '@/types/bot'

interface DatabaseConfig {
  provider: 'supabase' | 'postgresql' | 'mongodb' | 'firebase'
  connectionString: string
  autoSync: boolean
  syncInterval: number // minutes
  backupEnabled: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  encryptionEnabled: boolean
  realTimeEnabled: boolean
}

interface SyncStatus {
  lastSync: Date | null
  isOnline: boolean
  pendingChanges: number
  syncInProgress: boolean
  lastError: string | null
}

interface DatabaseIntegrationProps {
  portfolios: Portfolio[]
  connectedBots: BotType[]
  databaseConfig: DatabaseConfig
  syncStatus: SyncStatus
  onUpdateConfig: (config: Partial<DatabaseConfig>) => void
  onSyncNow: () => Promise<void>
  onBackupNow: () => Promise<void>
  onExportData: (format: 'json' | 'csv' | 'excel') => Promise<void>
  onImportData: (file: File) => Promise<void>
}

export function DatabaseIntegration({
  portfolios,
  connectedBots,
  databaseConfig,
  syncStatus,
  onUpdateConfig,
  onSyncNow,
  onBackupNow,
  onExportData,
  onImportData
}: DatabaseIntegrationProps) {
  const [selectedTab, setSelectedTab] = useState('status')
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'excel'>('json')

  const handleSync = async () => {
    try {
      await onSyncNow()
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

  const handleBackup = async () => {
    try {
      await onBackupNow()
    } catch (error) {
      console.error('Backup failed:', error)
    }
  }

  const handleExport = async () => {
    try {
      await onExportData(exportFormat)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await onImportData(file)
      } catch (error) {
        console.error('Import failed:', error)
      }
    }
  }

  const getConnectionStatusColor = () => {
    if (syncStatus.isOnline) return 'text-green-600'
    return 'text-red-600'
  }

  const getConnectionStatusIcon = () => {
    if (syncStatus.isOnline) return <Wifi className="w-4 h-4" />
    return <WifiOff className="w-4 h-4" />
  }

  const getSyncStatusText = () => {
    if (syncStatus.syncInProgress) return 'Syncing...'
    if (syncStatus.lastSync) {
      const minutesAgo = Math.floor((Date.now() - syncStatus.lastSync.getTime()) / 1000 / 60)
      return `Last sync: ${minutesAgo}m ago`
    }
    return 'Never synced'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Database Integration & Persistence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="sync">Sync</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
              <TabsTrigger value="import-export">Import/Export</TabsTrigger>
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
                          {syncStatus.isOnline ? 'Connected' : 'Disconnected'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {databaseConfig.provider} Database
                        </div>
                      </div>
                    </div>
                    <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
                      {syncStatus.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Sync Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sync className={`w-4 h-4 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
                      <div>
                        <div className="font-medium">
                          {syncStatus.syncInProgress ? 'Syncing...' : 'Sync Status'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getSyncStatusText()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {syncStatus.pendingChanges} pending
                      </div>
                      <div className="text-xs text-muted-foreground">
                        changes to sync
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{portfolios.length}</div>
                    <div className="text-sm text-muted-foreground">Portfolios</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{connectedBots.length}</div>
                    <div className="text-sm text-muted-foreground">Bots</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">
                      {portfolios.reduce((sum, p) => sum + p.positions.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Positions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Cloud className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">
                      {syncStatus.lastSync ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-sm text-muted-foreground">Sync Status</div>
                  </CardContent>
                </Card>
              </div>

              {/* Error Display */}
              {syncStatus.lastError && (
                <Alert className="border-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {syncStatus.lastError}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="provider">Database Provider</Label>
                    <Select
                      value={databaseConfig.provider}
                      onValueChange={(value: any) => onUpdateConfig({ provider: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supabase">Supabase</SelectItem>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                        <SelectItem value="mongodb">MongoDB</SelectItem>
                        <SelectItem value="firebase">Firebase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="connection-string">Connection String</Label>
                    <Input
                      id="connection-string"
                      type="password"
                      value={databaseConfig.connectionString}
                      onChange={(e) => onUpdateConfig({ connectionString: e.target.value })}
                      placeholder="Enter your database connection string"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-sync"
                      checked={databaseConfig.autoSync}
                      onCheckedChange={(autoSync) => onUpdateConfig({ autoSync })}
                    />
                    <Label htmlFor="auto-sync">Auto Sync</Label>
                  </div>

                  {databaseConfig.autoSync && (
                    <div>
                      <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                      <Input
                        id="sync-interval"
                        type="number"
                        value={databaseConfig.syncInterval}
                        onChange={(e) => onUpdateConfig({ syncInterval: Number(e.target.value) })}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="real-time"
                      checked={databaseConfig.realTimeEnabled}
                      onCheckedChange={(realTimeEnabled) => onUpdateConfig({ realTimeEnabled })}
                    />
                    <Label htmlFor="real-time">Real-time Updates</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encryption"
                      checked={databaseConfig.encryptionEnabled}
                      onCheckedChange={(encryptionEnabled) => onUpdateConfig({ encryptionEnabled })}
                    />
                    <Label htmlFor="encryption">Data Encryption</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="backup"
                      checked={databaseConfig.backupEnabled}
                      onCheckedChange={(backupEnabled) => onUpdateConfig({ backupEnabled })}
                    />
                    <Label htmlFor="backup">Automatic Backups</Label>
                  </div>

                  {databaseConfig.backupEnabled && (
                    <div>
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select
                        value={databaseConfig.backupFrequency}
                        onValueChange={(value: any) => onUpdateConfig({ backupFrequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sync" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Synchronization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Sync Status</div>
                      <div className="text-sm text-muted-foreground">
                        {getSyncStatusText()}
                      </div>
                    </div>
                    <Button onClick={handleSync} disabled={syncStatus.syncInProgress}>
                      {syncStatus.syncInProgress ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <Sync className="w-4 h-4 mr-2" />
                          Sync Now
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {syncStatus.pendingChanges}
                      </div>
                      <div className="text-sm text-muted-foreground">Pending Changes</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {portfolios.length + connectedBots.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Synced Items</div>
                    </div>
                  </div>

                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      {databaseConfig.autoSync
                        ? `Auto-sync enabled with ${databaseConfig.syncInterval} minute intervals`
                        : 'Auto-sync is disabled. Manual sync required.'
                      }
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Backup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Backup Status</div>
                      <div className="text-sm text-muted-foreground">
                        {databaseConfig.backupEnabled
                          ? `${databaseConfig.backupFrequency} backups enabled`
                          : 'Backups disabled'
                        }
                      </div>
                    </div>
                    <Button onClick={handleBackup}>
                      <Download className="w-4 h-4 mr-2" />
                      Backup Now
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-sm font-medium">Portfolios</div>
                      <div className="text-lg font-bold">{portfolios.length}</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-sm font-medium">Bots</div>
                      <div className="text-lg font-bold">{connectedBots.length}</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Settings className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm font-medium">Settings</div>
                      <div className="text-lg font-bold">1</div>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      All data is encrypted and securely stored. Backups include portfolios, bots, and configuration.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="import-export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Import/Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Export Section */}
                  <div>
                    <h3 className="font-medium mb-3">Export Data</h3>
                    <div className="flex space-x-4">
                      <Select
                        value={exportFormat}
                        onValueChange={(value: any) => setExportFormat(value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export {exportFormat.toUpperCase()}
                      </Button>
                    </div>
                  </div>

                  {/* Import Section */}
                  <div>
                    <h3 className="font-medium mb-3">Import Data</h3>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept=".json,.csv,.xlsx,.xls"
                        onChange={handleImport}
                        className="hidden"
                        id="import-file"
                      />
                      <Label htmlFor="import-file" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </span>
                        </Button>
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Supports JSON, CSV, and Excel files
                      </span>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Import will merge data with existing records. Review the data before importing to avoid duplicates.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
