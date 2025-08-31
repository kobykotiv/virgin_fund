"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Globe,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp
} from 'lucide-react'

export const SettingsWindow: React.FC = () => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('general')

  // General Settings
  const [theme, setTheme] = useState('system')
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('UTC')

  // Trading Settings
  const [defaultOrderType, setDefaultOrderType] = useState('market')
  const [defaultQuantity, setDefaultQuantity] = useState('100')
  const [autoSaveStrategies, setAutoSaveStrategies] = useState(true)
  const [confirmOrders, setConfirmOrders] = useState(true)
  const [maxDailyLoss, setMaxDailyLoss] = useState('1000')

  // API Settings
  const [apiKey, setApiKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [paperTrading, setPaperTrading] = useState(true)

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [tradeAlerts, setTradeAlerts] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Display Settings
  const [compactView, setCompactView] = useState(false)
  const [showAnimations, setShowAnimations] = useState(true)
  const [chartTheme, setChartTheme] = useState('light')
  const [fontSize, setFontSize] = useState('medium')

  // Privacy Settings
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [errorReporting, setErrorReporting] = useState(true)
  const [dataRetention, setDataRetention] = useState('1year')

  const handleSave = () => {
    // Save settings logic here
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleReset = () => {
    // Reset to defaults
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
      variant: "destructive"
    })
  }

  return (
    <div className="w-full h-full bg-background p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Settings
          </h2>
          <p className="text-muted-foreground">Customize your trading platform experience</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="text-xs">
            <Settings className="w-4 h-4 mr-1" />
            General
          </TabsTrigger>
          <TabsTrigger value="trading" className="text-xs">
            <TrendingUp className="w-4 h-4 mr-1" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="api" className="text-xs">
            <Key className="w-4 h-4 mr-1" />
            API
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="w-4 h-4 mr-1" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="display" className="text-xs">
            <Palette className="w-4 h-4 mr-1" />
            Display
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs">
            <Shield className="w-4 h-4 mr-1" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-4 h-4" />
                General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-3 h-3" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-3 h-3" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-3 h-3" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Settings */}
        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Default Order Type</Label>
                  <Select value={defaultOrderType} onValueChange={setDefaultOrderType}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                      <SelectItem value="stop">Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Quantity</Label>
                  <Input
                    className="h-8"
                    type="number"
                    value={defaultQuantity}
                    onChange={(e) => setDefaultQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Daily Loss ($)</Label>
                  <Input
                    className="h-8"
                    type="number"
                    value={maxDailyLoss}
                    onChange={(e) => setMaxDailyLoss(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Auto-save Strategies</Label>
                  <Switch checked={autoSaveStrategies} onCheckedChange={setAutoSaveStrategies} />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Order Confirmation</Label>
                  <Switch checked={confirmOrders} onCheckedChange={setConfirmOrders} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="w-4 h-4" />
                Alpaca API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-700 dark:text-blue-300">
                    API keys are stored locally. Get credentials from alpaca.markets
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    className="h-8"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input
                    className="h-8"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secret key"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Paper Trading</Label>
                  <Switch checked={paperTrading} onCheckedChange={setPaperTrading} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Email Notifications</Label>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Push Notifications</Label>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Trade Alerts</Label>
                  <Switch checked={tradeAlerts} onCheckedChange={setTradeAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Price Alerts</Label>
                  <Switch checked={priceAlerts} onCheckedChange={setPriceAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Sound Effects</Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Chart Theme</Label>
                  <Select value={chartTheme} onValueChange={setChartTheme}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Compact View</Label>
                  <Switch checked={compactView} onCheckedChange={setCompactView} />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Animations</Label>
                  <Switch checked={showAnimations} onCheckedChange={setShowAnimations} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Analytics</Label>
                  <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Error Reporting</Label>
                  <Switch checked={errorReporting} onCheckedChange={setErrorReporting} />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Data Retention</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsWindow
