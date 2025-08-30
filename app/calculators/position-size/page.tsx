"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PositionSizeCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Position Size Calculator</h1>
        <p className="text-muted-foreground">
          Determine the optimal position size based on your risk tolerance and account balance
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Position Parameters</CardTitle>
            <CardDescription>
              Enter your account details and risk preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">Account Balance ($)</Label>
              <Input id="account" type="number" placeholder="10000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk">Risk per Trade (%)</Label>
              <Input id="risk" type="number" placeholder="1" step="0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry">Entry Price ($)</Label>
              <Input id="entry" type="number" placeholder="100.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop">Stop Loss Price ($)</Label>
              <Input id="stop" type="number" placeholder="95.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Trade Direction</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long (Buy)</SelectItem>
                  <SelectItem value="short">Short (Sell)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">
              Calculate Position Size
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Size Results</CardTitle>
            <CardDescription>
              Recommended position size and risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Shares to Buy/Sell</Label>
                <div className="text-2xl font-bold text-blue-600">250</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Dollar Amount</Label>
                <div className="text-2xl font-bold text-green-600">$25,000</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Risk Amount:</span>
                <span className="font-semibold">$100</span>
              </div>
              <div className="flex justify-between">
                <span>Risk Percentage:</span>
                <span className="font-semibold">1.0%</span>
              </div>
              <div className="flex justify-between">
                <span>Stop Loss Distance:</span>
                <span className="font-semibold">$5.00 (5%)</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">📈 Position Analysis</h4>
              <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Position size is within safe risk limits</li>
                <li>• Stop loss is appropriately placed</li>
                <li>• Consider market volatility before executing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Position Sizing Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Fixed Percentage Method</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Risk a fixed percentage of your account on each trade. This method automatically adjusts position sizes as your account grows or shrinks.
              </p>
              <div className="text-sm">
                <strong>Formula:</strong> Position Size = (Account Balance × Risk %) / (Entry Price - Stop Loss Price)
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Fixed Dollar Method</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Risk a fixed dollar amount on each trade. This provides consistency but doesn't account for account growth.
              </p>
              <div className="text-sm">
                <strong>Formula:</strong> Position Size = Risk Amount / |Entry Price - Stop Loss Price|
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
