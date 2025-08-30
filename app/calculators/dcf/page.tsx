"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DCFCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">DCF Calculator</h1>
        <p className="text-muted-foreground">
          Calculate intrinsic value using Discounted Cash Flow analysis
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Financials</CardTitle>
            <CardDescription>
              Enter company data for DCF valuation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="free-cash-flow">Current Free Cash Flow ($M)</Label>
              <Input id="free-cash-flow" type="number" placeholder="500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth-rate">Growth Rate (%)</Label>
              <Input id="growth-rate" type="number" placeholder="5.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount-rate">Discount Rate (WACC %)</Label>
              <Input id="discount-rate" type="number" placeholder="10.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terminal-growth">Terminal Growth Rate (%)</Label>
              <Input id="terminal-growth" type="number" placeholder="3.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shares-outstanding">Shares Outstanding (M)</Label>
              <Input id="shares-outstanding" type="number" placeholder="100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-price">Current Stock Price ($)</Label>
              <Input id="current-price" type="number" placeholder="50.00" />
            </div>

            <Button className="w-full">
              Calculate DCF Value
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DCF Valuation Results</CardTitle>
            <CardDescription>
              Intrinsic value and investment analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$65.50</div>
                <div className="text-sm text-muted-foreground">Intrinsic Value per Share</div>
                <div className="text-xs text-green-600 mt-1">31% Upside Potential</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Analysis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Enterprise Value</TableCell>
                    <TableCell>$6.55B</TableCell>
                    <TableCell><Badge className="bg-green-500">Undervalued</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Current Price</TableCell>
                    <TableCell>$50.00</TableCell>
                    <TableCell><Badge variant="outline">Market Price</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Upside Potential</TableCell>
                    <TableCell>31.0%</TableCell>
                    <TableCell><Badge className="bg-green-500">Attractive</Badge></TableCell>
                  </Row>
                  <TableRow>
                    <TableCell className="font-semibold">Margin of Safety</TableCell>
                    <TableCell>23.6%</TableCell>
                    <TableCell><Badge className="bg-blue-500">Conservative</Badge></TableCell>
                  </Row>
                  <TableRow>
                    <TableCell className="font-semibold">P/E Ratio</TableCell>
                    <TableCell>18.2x</TableCell>
                    <TableCell><Badge variant="outline">Fair Value</Badge></TableCell>
                  </Row>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>DCF Analysis Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 DCF Components</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Free Cash Flow:</strong> Cash available after expenses</li>
                <li><strong>Growth Rate:</strong> Expected earnings growth</li>
                <li><strong>Discount Rate:</strong> Required rate of return</li>
                <li><strong>Terminal Value:</strong> Value beyond projection period</li>
                <li><strong>Present Value:</strong> Today's value of future cash flows</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Valuation Insights</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Undervalued:</strong> DCF > Current Price</li>
                <li><strong>Overvalued:</strong> DCF < Current Price</li>
                <li><strong>Fair Value:</strong> DCF ≈ Current Price</li>
                <li><strong>Margin of Safety:</strong> Buffer against uncertainty</li>
                <li><strong>Sensitivity Analysis:</strong> Test different assumptions</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 DCF Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use conservative growth and discount rate assumptions</li>
              <li>• Consider multiple scenarios (base, bullish, bearish)</li>
              <li>• Compare DCF value with other valuation methods</li>
              <li>• Focus on companies with predictable cash flows</li>
              <li>• Regularly update assumptions as new data becomes available</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
