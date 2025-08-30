"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function RiskRewardCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Risk/Reward Calculator</h1>
        <p className="text-muted-foreground">
          Calculate optimal risk-reward ratios for your trading positions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>
              Enter your trade parameters to calculate risk-reward metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry">Entry Price</Label>
                <Input id="entry" type="number" placeholder="100.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stop">Stop Loss</Label>
                <Input id="stop" type="number" placeholder="95.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target Price</Label>
                <Input id="target" type="number" placeholder="110.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shares">Number of Shares</Label>
                <Input id="shares" type="number" placeholder="100" />
              </div>
            </div>

            <Button className="w-full">
              Calculate Risk/Reward
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Your calculated risk-reward metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Risk Amount</Label>
                <div className="text-2xl font-bold text-red-600">$500</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Reward Amount</Label>
                <div className="text-2xl font-bold text-green-600">$1,000</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Risk/Reward Ratio:</span>
                <Badge variant="secondary">1:2</Badge>
              </div>
              <div className="flex justify-between">
                <span>Win Rate Needed:</span>
                <Badge variant="outline">34%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Expected Value:</span>
                <Badge className="bg-green-500">Positive</Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/10 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Trading Tip</h4>
              <p className="text-sm text-muted-foreground">
                A risk-reward ratio of 1:2 or better is generally considered favorable.
                This means your potential reward should be at least twice your risk.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Risk Management Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold">Position Sizing</h4>
              <p className="text-sm text-muted-foreground">
                Never risk more than 1-2% of your account on a single trade
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold">Reward Targets</h4>
              <p className="text-sm text-muted-foreground">
                Set realistic profit targets based on technical analysis
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-semibold">Stop Losses</h4>
              <p className="text-sm text-muted-foreground">
                Always use stop losses to protect your capital
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
