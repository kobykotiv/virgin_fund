"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function OptionsGreeksCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Options Greeks Calculator</h1>
        <p className="text-muted-foreground">
          Calculate delta, gamma, theta, vega, and rho for options pricing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Option Parameters</CardTitle>
            <CardDescription>
              Enter option details to calculate Greeks
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
              <Label htmlFor="time">Time to Expiration (days)</Label>
              <Input id="time" type="number" placeholder="30" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Risk-Free Rate (%)</Label>
              <Input id="rate" type="number" placeholder="5.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="option-type">Option Type</Label>
              <select className="w-full p-2 border rounded-md" id="option-type">
                <option value="call">Call Option</option>
                <option value="put">Put Option</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Greeks
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Greeks Values</CardTitle>
            <CardDescription>
              Calculated option sensitivity measures
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  <TableCell>0.35</TableCell>
                  <TableCell><Badge className="bg-blue-500">Price Sensitivity</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Gamma (Γ)</TableCell>
                  <TableCell>0.04</TableCell>
                  <TableCell><Badge className="bg-purple-500">Delta Sensitivity</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Theta (Θ)</TableCell>
                  <TableCell>-0.12</TableCell>
                  <TableCell><Badge className="bg-red-500">Time Decay</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Vega (V)</TableCell>
                  <TableCell>0.08</TableCell>
                  <TableCell><Badge className="bg-green-500">Volatility Sensitivity</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Rho (ρ)</TableCell>
                  <TableCell>0.02</TableCell>
                  <TableCell><Badge className="bg-orange-500">Rate Sensitivity</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Greeks Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📈 Price & Direction</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Delta:</strong> How much option price changes per $1 underlying move</li>
                <li><strong>Gamma:</strong> Rate of change of delta (acceleration)</li>
                <li><strong>Positive Delta:</strong> Profits when underlying rises</li>
                <li><strong>Negative Delta:</strong> Profits when underlying falls</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">⏰ Time & Volatility</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Theta:</strong> Daily time decay (negative for long options)</li>
                <li><strong>Vega:</strong> Sensitivity to volatility changes</li>
                <li><strong>Rho:</strong> Sensitivity to interest rate changes</li>
                <li><strong>Time Value:</strong> Portion of premium from time remaining</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Trading Applications</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use delta for hedging ratios and position sizing</li>
              <li>• Monitor gamma for delta hedging frequency</li>
              <li>• Theta shows time decay risk/reward</li>
              <li>• Vega indicates volatility exposure</li>
              <li>• Combine Greeks for comprehensive risk assessment</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
