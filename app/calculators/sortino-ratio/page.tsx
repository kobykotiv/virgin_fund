"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SortinoRatioCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Sortino Ratio Calculator</h1>
        <p className="text-muted-foreground">
          Measure risk-adjusted returns focusing on downside volatility
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Parameters</CardTitle>
            <CardDescription>
              Enter portfolio returns and risk metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-return">Portfolio Annual Return (%)</Label>
              <Input id="portfolio-return" type="number" placeholder="12.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downside-deviation">Downside Deviation (%)</Label>
              <Input id="downside-deviation" type="number" placeholder="8.2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-return">Target/Minimum Acceptable Return (%)</Label>
              <Input id="target-return" type="number" placeholder="3.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark-return">Benchmark Return (%)</Label>
              <Input id="benchmark-return" type="number" placeholder="7.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-name">Portfolio Name</Label>
              <Input id="portfolio-name" placeholder="Growth Portfolio" />
            </div>

            <Button className="w-full">
              Calculate Sortino Ratio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sortino Ratio Analysis</CardTitle>
            <CardDescription>
              Risk-adjusted performance assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1.22</div>
                <div className="text-sm text-muted-foreground">Sortino Ratio</div>
                <div className="text-xs text-green-600 mt-1">Above Average</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Sortino Ratio</TableCell>
                    <TableCell>1.22</TableCell>
                    <TableCell><Badge className="bg-green-500">Good</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Sharpe Ratio</TableCell>
                    <TableCell>0.95</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Average</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Excess Return</TableCell>
                    <TableCell>5.0%</TableCell>
                    <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Downside Risk</TableCell>
                    <TableCell>8.2%</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Moderate</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sortino Ratio Methodology</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Sortino Formula</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><strong>Sortino Ratio = (Rp - Rf) / σd</strong></div>
                <div><strong>Where:</strong></div>
                <div>• Rp = Portfolio return</div>
                <div>• Rf = Risk-free rate (target return)</div>
                <div>• σd = Downside deviation</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Sortino Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Risk Assessment:</strong> Focus on harmful volatility</li>
                <li><strong>Portfolio Comparison:</strong> Better than Sharpe for asymmetric returns</li>
                <li><strong>Strategy Evaluation:</strong> Hedge fund and alternative investment analysis</li>
                <li><strong>Performance Attribution:</strong> Downside risk contribution</li>
                <li><strong>Risk Management:</strong> Tail risk measurement</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Sortino Ratio Guidelines</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Higher Sortino ratios indicate better risk-adjusted returns</li>
              <li>• Focuses on downside volatility rather than total volatility</li>
              <li>• Particularly useful for portfolios with asymmetric return distributions</li>
              <li>• Compare Sortino ratios across similar investment strategies</li>
              <li>• Use alongside other risk metrics for comprehensive analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
