"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FibonacciCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Fibonacci Calculator</h1>
        <p className="text-muted-foreground">
          Calculate Fibonacci retracement and extension levels for technical analysis
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Price Range Input</CardTitle>
            <CardDescription>
              Enter the high and low points to calculate Fibonacci levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="high">Swing High ($)</Label>
              <Input id="high" type="number" placeholder="110.50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="low">Swing Low ($)</Label>
              <Input id="low" type="number" placeholder="95.25" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation-type">Calculation Type</Label>
              <select className="w-full p-2 border rounded-md" id="calculation-type">
                <option value="retracement">Retracement Levels</option>
                <option value="extension">Extension Levels</option>
                <option value="projection">Price Projection</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Trend Direction</Label>
              <select className="w-full p-2 border rounded-md" id="direction">
                <option value="uptrend">Uptrend (Bullish)</option>
                <option value="downtrend">Downtrend (Bearish)</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Fibonacci Levels
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fibonacci Levels</CardTitle>
            <CardDescription>
              Calculated support and resistance levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Strength</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">0.0%</TableCell>
                  <TableCell>$95.25</TableCell>
                  <TableCell><Badge variant="outline">Swing Low</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">23.6%</TableCell>
                  <TableCell>$99.85</TableCell>
                  <TableCell><Badge className="bg-yellow-500">Weak Support</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">38.2%</TableCell>
                  <TableCell>$101.75</TableCell>
                  <TableCell><Badge className="bg-orange-500">Medium Support</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">50.0%</TableCell>
                  <TableCell>$102.88</TableCell>
                  <TableCell><Badge className="bg-red-500">Strong Support</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">61.8%</TableCell>
                  <TableCell>$103.99</TableCell>
                  <TableCell><Badge className="bg-red-600">Strong Support</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">78.6%</TableCell>
                  <TableCell>$106.89</TableCell>
                  <TableCell><Badge className="bg-red-700">Major Support</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">100.0%</TableCell>
                  <TableCell>$110.50</TableCell>
                  <TableCell><Badge variant="outline">Swing High</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Fibonacci Trading Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📈 Retracement Levels</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>23.6%:</strong> Shallow pullback, weak support</li>
                <li><strong>38.2%:</strong> Moderate retracement, medium support</li>
                <li><strong>50.0%:</strong> Halfway point, strong psychological level</li>
                <li><strong>61.8%:</strong> Deep retracement, major support/resistance</li>
                <li><strong>78.6%:</strong> Very deep pullback, potential reversal</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Extension Levels</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>127.2%:</strong> First extension target</li>
                <li><strong>161.8%:</strong> Golden ratio extension</li>
                <li><strong>200.0%:</strong> Double extension</li>
                <li><strong>261.8%:</strong> Major extension target</li>
                <li><strong>423.6%:</strong> Extreme extension level</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Trading Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Fibonacci levels work best in trending markets</li>
              <li>• Combine with other indicators for confirmation</li>
              <li>• 61.8% level often acts as major turning point</li>
              <li>• Use extensions for profit targets in breakouts</li>
              <li>• Multiple timeframes improve accuracy</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
