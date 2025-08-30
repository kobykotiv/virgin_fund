"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function GrahamNumberCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Graham Number Calculator</h1>
        <p className="text-muted-foreground">
          Calculate Benjamin Graham's intrinsic value formula for defensive investing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Fundamentals</CardTitle>
            <CardDescription>
              Enter EPS and BVPS for Graham Number calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eps">Earnings Per Share (EPS) ($)</Label>
              <Input id="eps" type="number" placeholder="8.50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bvps">Book Value Per Share (BVPS) ($)</Label>
              <Input id="bvps" type="number" placeholder="45.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-price">Current Stock Price ($)</Label>
              <Input id="current-price" type="number" placeholder="120.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-name">Stock Symbol/Name</Label>
              <Input id="stock-name" placeholder="BRK.A" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin-of-safety">Margin of Safety (%)</Label>
              <Input id="margin-of-safety" type="number" placeholder="50" />
            </div>

            <Button className="w-full">
              Calculate Graham Number
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Graham Valuation</CardTitle>
            <CardDescription>
              Intrinsic value and margin of safety analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$61.52</div>
                <div className="text-sm text-muted-foreground">Graham Number</div>
                <div className="text-xs text-green-600 mt-1">Intrinsic Value</div>
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
                    <TableCell className="font-semibold">Graham Number</TableCell>
                    <TableCell>$61.52</TableCell>
                    <TableCell><Badge className="bg-green-500">Intrinsic Value</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Current Price</TableCell>
                    <TableCell>$120.00</TableCell>
                    <TableCell><Badge className="bg-red-500">Market Price</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Upside/Downside</TableCell>
                    <TableCell>-$58.48</TableCell>
                    <TableCell><Badge className="bg-red-500">Overvalued</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Margin of Safety</TableCell>
                    <TableCell>-95.1%</TableCell>
                    <TableCell><Badge className="bg-red-600">No Safety</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Fair Value Range</TableCell>
                    <TableCell>$30.76 - $61.52</TableCell>
                    <TableCell><Badge variant="outline">Buy Below</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Graham's Value Investing Principles</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Graham Number Formula</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Graham Number = √(22.5 × EPS × BVPS)</strong></li>
                <li><strong>EPS:</strong> Trailing 12-month earnings per share</li>
                <li><strong>BVPS:</strong> Book value per share</li>
                <li><strong>22.5:</strong> Graham's multiplier (15 P/E × 1.5 P/B)</li>
                <li><strong>Safety Margin:</strong> Buy at 50% below Graham Number</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Graham's Criteria</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>PE Ratio:</strong> ≤ 15 (earnings multiple)</li>
                <li><strong>Price to Book:</strong> ≤ 1.5 (asset protection)</li>
                <li><strong>Debt to Equity:</strong> ≤ 30% (financial stability)</li>
                <li><strong>Dividend Yield:</strong> ≥ 4% (income generation)</li>
                <li><strong>Market Cap:</strong> ≥ $2B (liquidity and stability)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Graham's Investment Philosophy</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• "The intelligent investor is a realist who sells to optimists and buys from pessimists"</li>
              <li>• Focus on fundamentals, not market sentiment</li>
              <li>• Margin of safety protects against errors and market declines</li>
              <li>• Long-term perspective beats market timing</li>
              <li>• Diversification reduces risk without sacrificing returns</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
