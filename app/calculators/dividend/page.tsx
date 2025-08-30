"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DividendCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Dividend Calculator</h1>
        <p className="text-muted-foreground">
          Calculate dividend income, yield, and reinvestment growth
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Dividend Investment Input</CardTitle>
            <CardDescription>
              Enter stock details and investment parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock-price">Stock Price ($)</Label>
              <Input id="stock-price" type="number" placeholder="50.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual-dividend">Annual Dividend ($)</Label>
              <Input id="annual-dividend" type="number" placeholder="2.50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shares-owned">Shares Owned</Label>
              <Input id="shares-owned" type="number" placeholder="100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dividend-growth">Dividend Growth Rate (%)</Label>
              <Input id="dividend-growth" type="number" placeholder="5.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holding-period">Holding Period (years)</Label>
              <Input id="holding-period" type="number" placeholder="10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reinvestment">Dividend Reinvestment</Label>
              <select className="w-full p-2 border rounded-md" id="reinvestment">
                <option value="yes">Yes - Reinvest Dividends</option>
                <option value="no">No - Take Cash Dividends</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Dividend Income
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dividend Analysis</CardTitle>
            <CardDescription>
              Current and projected dividend metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$250</div>
                <div className="text-sm text-muted-foreground">Annual Dividend Income</div>
                <div className="text-xs text-green-600 mt-1">5.0% Current Yield</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Projected (10yr)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Dividend Yield</TableCell>
                    <TableCell>5.0%</TableCell>
                    <TableCell>8.1%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Annual Income</TableCell>
                    <TableCell>$250</TableCell>
                    <TableCell>$1,625</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Shares Owned</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>163</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Portfolio Value</TableCell>
                    <TableCell>$5,000</TableCell>
                    <TableCell>$8,150</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Total Dividends</TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell>$16,250</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Dividend Investment Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Dividend Yield Categories</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>High Yield (4%+):</strong> Income focus, higher risk</li>
                <li><strong>Moderate Yield (2-4%):</strong> Balanced approach</li>
                <li><strong>Low Yield (&lt;2%):</strong> Growth focus, lower income</li>
                <li><strong>Growth Stocks:</strong> Low current yield, high growth potential</li>
                <li><strong>Value Stocks:</strong> Higher yield, stable companies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Dividend Aristocrats</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>25+ Years:</strong> Consistent dividend increases</li>
                <li><strong>Stable Companies:</strong> Blue-chip dividend payers</li>
                <li><strong>Sector Diversification:</strong> Spread across industries</li>
                <li><strong>Dividend Coverage:</strong> Earnings support payments</li>
                <li><strong>Payout Ratios:</strong> Sustainable dividend levels</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Dividend Investing Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Focus on companies with strong fundamentals and cash flow</li>
              <li>• Consider dividend growth rate over current yield</li>
              <li>• Diversify across sectors to reduce risk</li>
              <li>• Monitor payout ratios and dividend coverage</li>
              <li>• Consider tax implications of dividend income</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
