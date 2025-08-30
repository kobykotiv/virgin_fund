"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BlackScholesCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Black-Scholes Calculator</h1>
        <p className="text-muted-foreground">
          Calculate theoretical option prices using the Black-Scholes model
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Option Parameters</CardTitle>
            <CardDescription>
              Enter the parameters for Black-Scholes calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="underlying">Underlying Price ($)</Label>
              <Input id="underlying" type="number" placeholder="100.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strike">Strike Price ($)</Label>
              <Input id="strike" type="number" placeholder="105.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volatility">Volatility (%)</Label>
              <Input id="volatility" type="number" placeholder="25.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time to Expiration (years)</Label>
              <Input id="time" type="number" placeholder="0.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Risk-Free Rate (%)</Label>
              <Input id="rate" type="number" placeholder="5.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dividend">Dividend Yield (%)</Label>
              <Input id="dividend" type="number" placeholder="2.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="option-type">Option Type</Label>
              <select className="w-full p-2 border rounded-md" id="option-type">
                <option value="call">European Call</option>
                <option value="put">European Put</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Option Price
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Results</CardTitle>
            <CardDescription>
              Theoretical option price and Greeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">$3.85</div>
                <div className="text-sm text-muted-foreground">Theoretical Call Price</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Greek</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Interpretation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Delta (Δ)</TableCell>
                    <TableCell>0.52</TableCell>
                    <TableCell><Badge className="bg-blue-500">Hedge Ratio</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Gamma (Γ)</TableCell>
                    <TableCell>0.03</TableCell>
                    <TableCell><Badge className="bg-purple-500">Delta Change</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Theta (Θ)</TableCell>
                    <TableCell>-0.08</TableCell>
                    <TableCell><Badge className="bg-red-500">Time Decay</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Vega (V)</TableCell>
                    <TableCell>0.15</TableCell>
                    <TableCell><Badge className="bg-green-500">Volatility Risk</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Rho (ρ)</TableCell>
                    <TableCell>0.12</TableCell>
                    <TableCell><Badge className="bg-orange-500">Rate Sensitivity</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Black-Scholes Model Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Model Assumptions</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Lognormal stock price distribution</li>
                <li>• Constant volatility and risk-free rate</li>
                <li>• No transaction costs or taxes</li>
                <li>• European-style options only</li>
                <li>• Continuous trading possible</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Practical Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Theoretical option pricing</li>
                <li>• Implied volatility calculation</li>
                <li>• Risk management and hedging</li>
                <li>• Portfolio valuation</li>
                <li>• Option strategy analysis</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Important Considerations</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Black-Scholes provides theoretical prices, not actual market prices</li>
              <li>• Real options may trade at different prices due to supply/demand</li>
              <li>• Model assumptions may not hold in real markets</li>
              <li>• Use for educational purposes and as a pricing benchmark</li>
              <li>• Consider transaction costs and liquidity when trading</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
