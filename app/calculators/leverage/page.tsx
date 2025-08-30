"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LeverageCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Leverage Calculator</h1>
        <p className="text-muted-foreground">
          Calculate leverage ratios, margin requirements, and potential profits/losses
        </p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          ⚠️ <strong>Warning:</strong> Leverage can amplify both profits and losses. Always use appropriate risk management and never risk more than you can afford to lose.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Leverage Parameters</CardTitle>
            <CardDescription>
              Enter your position details and leverage settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">Account Balance ($)</Label>
              <Input id="account" type="number" placeholder="10000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverage">Leverage Ratio (e.g., 5 for 5:1)</Label>
              <Input id="leverage" type="number" placeholder="5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry">Entry Price ($)</Label>
              <Input id="entry" type="number" placeholder="50000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exit">Exit Price ($)</Label>
              <Input id="exit" type="number" placeholder="51000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Position Type</Label>
              <select className="w-full p-2 border rounded-md" id="direction">
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Leverage Impact
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leverage Analysis</CardTitle>
            <CardDescription>
              Margin requirements and profit/loss calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Margin Required</Label>
                <div className="text-2xl font-bold text-orange-600">$2,000</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Effective Exposure</Label>
                <div className="text-2xl font-bold text-blue-600">$10,000</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Unleveraged P&L:</span>
                <span className="font-semibold text-green-600">+$200</span>
              </div>
              <div className="flex justify-between">
                <span>Leveraged P&L:</span>
                <span className="font-semibold text-green-600">+$1,000</span>
              </div>
              <div className="flex justify-between">
                <span>Leverage Multiplier:</span>
                <Badge variant="secondary">5x</Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold mb-2 text-red-800 dark:text-red-200">⚠️ Risk Warning</h4>
              <ul className="text-sm space-y-1 text-red-700 dark:text-red-300">
                <li>• Liquidation Price: $49,000 (2% below entry)</li>
                <li>• Maximum Loss: $2,000 (100% of margin)</li>
                <li>• Margin Call Risk: High</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conservative (2:1 - 3:1)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>✅ Lower risk of liquidation</li>
              <li>✅ More stable returns</li>
              <li>✅ Suitable for beginners</li>
              <li>❌ Lower profit potential</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Moderate (5:1 - 10:1)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>✅ Balanced risk/reward</li>
              <li>✅ Good for experienced traders</li>
              <li>✅ Higher profit potential</li>
              <li>⚠️ Requires careful monitoring</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aggressive (20:1+)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>✅ Maximum profit potential</li>
              <li>❌ Extremely high risk</li>
              <li>❌ Easy to lose entire account</li>
              <li>⚠️ Only for professionals</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
