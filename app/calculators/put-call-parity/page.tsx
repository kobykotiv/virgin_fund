"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PutCallParityCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Put-Call Parity Calculator</h1>
        <p className="text-muted-foreground">
          Calculate theoretical relationships between put and call options
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Option Parameters</CardTitle>
            <CardDescription>
              Enter option prices and underlying details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="underlying-price">Underlying Price ($)</Label>
              <Input id="underlying-price" type="number" placeholder="100.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strike-price">Strike Price ($)</Label>
              <Input id="strike-price" type="number" placeholder="105.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="call-price">Call Option Price ($)</Label>
              <Input id="call-price" type="number" placeholder="3.50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="put-price">Put Option Price ($)</Label>
              <Input id="put-price" type="number" placeholder="5.25" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk-free-rate">Risk-Free Rate (%)</Label>
              <Input id="risk-free-rate" type="number" placeholder="5.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-to-expiry">Time to Expiry (years)</Label>
              <Input id="time-to-expiry" type="number" placeholder="0.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation-type">Calculation Type</Label>
              <select className="w-full p-2 border rounded-md" id="calculation-type">
                <option value="verify">Verify Put-Call Parity</option>
                <option value="calculate-call">Calculate Call Price</option>
                <option value="calculate-put">Calculate Put Price</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Parity
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Put-Call Parity Analysis</CardTitle>
            <CardDescription>
              Theoretical relationship verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$0.12</div>
                <div className="text-sm text-muted-foreground">Parity Difference</div>
                <div className="text-xs text-green-600 mt-1">Within Acceptable Range</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Left Side (S - PV(K))</TableCell>
                    <TableCell>$97.25</TableCell>
                    <TableCell><Badge variant="outline">Stock + Bond</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Right Side (C - P)</TableCell>
                    <TableCell>$97.37</TableCell>
                    <TableCell><Badge variant="outline">Call - Put</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Theoretical Difference</TableCell>
                    <TableCell>$0.12</TableCell>
                    <TableCell><Badge className="bg-green-500">Arbitrage Free</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Present Value of Strike</TableCell>
                    <TableCell>$102.75</TableCell>
                    <TableCell><Badge variant="outline">PV(K)</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Arbitrage Opportunity</TableCell>
                    <TableCell>None</TableCell>
                    <TableCell><Badge className="bg-blue-500">Fair Value</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Put-Call Parity Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Parity Formula</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>S - PV(K) = C - P</strong></li>
                <li><strong>S:</strong> Current stock price</li>
                <li><strong>PV(K):</strong> Present value of strike price</li>
                <li><strong>C:</strong> Call option price</li>
                <li><strong>P:</strong> Put option price</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Arbitrage Strategies</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>If C - P > S - PV(K):</strong> Sell call, buy put, buy stock, sell bond</li>
                <li><strong>If C - P < S - PV(K):</strong> Buy call, sell put, sell stock, buy bond</li>
                <li><strong>Box Spread:</strong> Combination of bull and bear spreads</li>
                <li><strong>Conversion:</strong> Synthetic long stock position</li>
                <li><strong>Reversal:</strong> Synthetic short stock position</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Put-Call Parity Applications</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Verify option pricing efficiency in the market</li>
              <li>• Identify arbitrage opportunities between options</li>
              <li>• Create synthetic positions (stock, bond, etc.)</li>
              <li>• Hedge existing positions with synthetic equivalents</li>
              <li>• Compare theoretical vs actual option prices</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
