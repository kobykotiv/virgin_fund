"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SpreadCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Spread Calculator</h1>
        <p className="text-muted-foreground">
          Calculate bid-ask spreads and analyze market liquidity
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Spread Analysis Input</CardTitle>
            <CardDescription>
              Enter bid and ask prices to calculate spread metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bid">Bid Price ($)</Label>
              <Input id="bid" type="number" placeholder="104.50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ask">Ask Price ($)</Label>
              <Input id="ask" type="number" placeholder="104.75" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Average Daily Volume</Label>
              <Input id="volume" type="number" placeholder="1000000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spread-type">Spread Type</Label>
              <select className="w-full p-2 border rounded-md" id="spread-type">
                <option value="fixed">Fixed Spread</option>
                <option value="percentage">Percentage Spread</option>
                <option value="variable">Variable Spread</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Spread Metrics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spread Metrics</CardTitle>
            <CardDescription>
              Calculated spread analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Spread Amount</TableCell>
                  <TableCell>$0.25</TableCell>
                  <TableCell><Badge variant="outline">Normal</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Spread Percentage</TableCell>
                  <TableCell>0.24%</TableCell>
                  <TableCell><Badge className="bg-green-500">Tight</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Mid Price</TableCell>
                  <TableCell>$104.625</TableCell>
                  <TableCell><Badge variant="secondary">Reference</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Liquidity Score</TableCell>
                  <TableCell>85/100</TableCell>
                  <TableCell><Badge className="bg-blue-500">High</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Trading Cost</TableCell>
                  <TableCell>$0.125</TableCell>
                  <TableCell><Badge variant="outline">Per Trade</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Spread Analysis Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Spread Types</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Fixed: Constant spread amount</li>
                <li>• Percentage: Spread as % of price</li>
                <li>• Variable: Changes with volatility</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Liquidity Indicators</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Tight spread = High liquidity</li>
                <li>• Wide spread = Low liquidity</li>
                <li>• Volume correlation</li>
                <li>• Market maker activity</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">💰 Trading Costs</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Half-spread per trade</li>
                <li>• Round-trip costs</li>
                <li>• Slippage impact</li>
                <li>• Commission comparison</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Trading Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Trade during high liquidity periods for better spreads</li>
              <li>• Avoid trading during news events when spreads widen</li>
              <li>• Use limit orders to control execution prices</li>
              <li>• Monitor spread changes as volatility indicators</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
