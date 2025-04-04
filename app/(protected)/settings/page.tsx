"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/providers/auth-provider"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || "",
    name: "John Doe",
    notifications: {
      email: true,
      push: true,
      trades: true,
      performance: true,
    },
  })

  const [tradingSettings, setTradingSettings] = useState({
    defaultRiskPercentage: 2,
    maxDrawdown: 10,
    autoRebalance: false,
    tradingHours: {
      start: "09:30",
      end: "16:00",
    },
  })

  const handleSaveAccountSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings Saved",
        description: "Your account settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save account settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTradingSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings Saved",
        description: "Your trading settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trading settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs id="settings-tabs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList id="settings-tabs-list" className="mb-6">
          <TabsTrigger id="settings-tab-general" value="general">General</TabsTrigger>
          <TabsTrigger id="settings-tab-notifications" value="notifications">Notifications</TabsTrigger>
          <TabsTrigger id="settings-tab-security" value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent id="settings-content-general" value="general">
          <Card id="general-settings-card">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={accountSettings.email}
                    onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={accountSettings.name}
                    onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="flex-1">
                      Email Notifications
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={accountSettings.notifications.email}
                      onCheckedChange={(checked) =>
                        setAccountSettings({
                          ...accountSettings,
                          notifications: { ...accountSettings.notifications, email: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="flex-1">
                      Push Notifications
                    </Label>
                    <Switch
                      id="push-notifications"
                      checked={accountSettings.notifications.push}
                      onCheckedChange={(checked) =>
                        setAccountSettings({
                          ...accountSettings,
                          notifications: { ...accountSettings.notifications, push: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trade-notifications" className="flex-1">
                      Trade Notifications
                    </Label>
                    <Switch
                      id="trade-notifications"
                      checked={accountSettings.notifications.trades}
                      onCheckedChange={(checked) =>
                        setAccountSettings({
                          ...accountSettings,
                          notifications: { ...accountSettings.notifications, trades: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="performance-notifications" className="flex-1">
                      Performance Reports
                    </Label>
                    <Switch
                      id="performance-notifications"
                      checked={accountSettings.notifications.performance}
                      onCheckedChange={(checked) =>
                        setAccountSettings({
                          ...accountSettings,
                          notifications: { ...accountSettings.notifications, performance: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAccountSettings} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent id="settings-content-notifications" value="notifications">
          <Card id="notifications-settings-card">
            <CardHeader>
              <CardTitle>Trading Settings</CardTitle>
              <CardDescription>Configure your default trading parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="risk-percentage">Default Risk Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="risk-percentage"
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={tradingSettings.defaultRiskPercentage}
                      onChange={(e) =>
                        setTradingSettings({ ...tradingSettings, defaultRiskPercentage: Number(e.target.value) })
                      }
                    />
                    <span>%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The default percentage of your portfolio to risk on each trade
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-drawdown">Maximum Drawdown</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="max-drawdown"
                      type="number"
                      min="1"
                      max="50"
                      step="1"
                      value={tradingSettings.maxDrawdown}
                      onChange={(e) => setTradingSettings({ ...tradingSettings, maxDrawdown: Number(e.target.value) })}
                    />
                    <span>%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">The maximum drawdown allowed before stopping a bot</p>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-rebalance" className="flex-1">
                    Auto-Rebalance Portfolio
                  </Label>
                  <Switch
                    id="auto-rebalance"
                    checked={tradingSettings.autoRebalance}
                    onCheckedChange={(checked) => setTradingSettings({ ...tradingSettings, autoRebalance: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trading Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trading-start">Start Time</Label>
                      <Input
                        id="trading-start"
                        type="time"
                        value={tradingSettings.tradingHours.start}
                        onChange={(e) =>
                          setTradingSettings({
                            ...tradingSettings,
                            tradingHours: { ...tradingSettings.tradingHours, start: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trading-end">End Time</Label>
                      <Input
                        id="trading-end"
                        type="time"
                        value={tradingSettings.tradingHours.end}
                        onChange={(e) =>
                          setTradingSettings({
                            ...tradingSettings,
                            tradingHours: { ...tradingSettings.tradingHours, end: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only execute trades during these hours (in your local time zone)
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveTradingSettings} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent id="settings-content-security" value="security">
          <Card id="security-settings-card">
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage your Alpaca Markets API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Configure your Alpaca Markets API keys to enable paper trading. These keys are used to connect to the
                  Alpaca API for executing trades and retrieving market data.
                </p>
                <Button onClick={() => window.dispatchEvent(new CustomEvent("openApiSettings"))}>
                  Configure API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

