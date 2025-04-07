"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function SettingsTab() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="backtesting">Backtesting</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue="Algorithmic trader and investor" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc-0">UTC</SelectItem>
                    <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="marketing" defaultChecked />
                <Label htmlFor="marketing">Receive marketing emails</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
              <CardDescription>Configure your trading settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-order-size">Default Order Size ($)</Label>
                <Input id="default-order-size" type="number" defaultValue="1000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-order-size">Maximum Order Size ($)</Label>
                <Input id="max-order-size" type="number" defaultValue="5000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk-per-trade">Risk Per Trade (%)</Label>
                <Input id="risk-per-trade" type="number" defaultValue="2" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="default-strategy">Default Trading Strategy</Label>
                <Select defaultValue="mean-reversion">
                  <SelectTrigger id="default-strategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="grid">Grid Trading</SelectItem>
                    <SelectItem value="dca">Dollar Cost Averaging</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-timeframe">Default Timeframe</Label>
                <Select defaultValue="1d">
                  <SelectTrigger id="default-timeframe">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Minute</SelectItem>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="4h">4 Hours</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch id="auto-trading" defaultChecked />
                <Label htmlFor="auto-trading">Enable Automated Trading</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="stop-loss" defaultChecked />
                <Label htmlFor="stop-loss">Always Use Stop Loss</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="take-profit" defaultChecked />
                <Label htmlFor="take-profit">Always Use Take Profit</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="trailing-stop" />
                <Label htmlFor="trailing-stop">Enable Trailing Stop</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-trades">Trade Executions</Label>
                    <Switch id="email-trades" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-signals">Trading Signals</Label>
                    <Switch id="email-signals" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-news">Market News</Label>
                    <Switch id="email-news" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-performance">Performance Reports</Label>
                    <Switch id="email-performance" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-trades">Trade Executions</Label>
                    <Switch id="push-trades" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-signals">Trading Signals</Label>
                    <Switch id="push-signals" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-news">Market News</Label>
                    <Switch id="push-news" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-performance">Performance Reports</Label>
                    <Switch id="push-performance" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alpaca-key">Alpaca API Key</Label>
                <Input id="alpaca-key" type="password" defaultValue="••••••••••••••••" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alpaca-secret">Alpaca API Secret</Label>
                <Input id="alpaca-secret" type="password" defaultValue="••••••••••••••••" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="tradingview-key">TradingView API Key</Label>
                <Input id="tradingview-key" type="password" defaultValue="••••••••••••••••" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="coinbase-key">Coinbase API Key</Label>
                <Input id="coinbase-key" placeholder="Enter your Coinbase API key" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coinbase-secret">Coinbase API Secret</Label>
                <Input id="coinbase-secret" type="password" placeholder="Enter your Coinbase API secret" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-background border"></span>
                    Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-black"></span>
                    Dark
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2 h-4 w-4 rounded-full bg-background border border-black/20 dark:border-white/20"></span>
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="density">Density</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chart-theme">Chart Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="colored">Colored</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="animations" defaultChecked />
                <Label htmlFor="animations">Enable animations</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="backtesting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backtesting Configuration</CardTitle>
              <CardDescription>Configure default settings for backtesting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-period">Default Backtest Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="default-period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">6 Months</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                    <SelectItem value="730">2 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-capital">Default Initial Capital</Label>
                <Input id="default-capital" type="number" defaultValue="10000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slippage">Default Slippage (%)</Label>
                <Input id="slippage" type="number" defaultValue="0.1" step="0.1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission">Default Commission (%)</Label>
                <Input id="commission" type="number" defaultValue="0.1" step="0.1" />
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch id="auto-save-backtest" defaultChecked />
                <Label htmlFor="auto-save-backtest">Auto-save Backtest Results</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="compare-benchmark" defaultChecked />
                <Label htmlFor="compare-benchmark">Compare with Benchmark</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

