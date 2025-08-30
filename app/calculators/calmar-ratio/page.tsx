"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CalmarRatioCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Calmar Ratio Calculator</h1>
        <p className="text-muted-foreground">
          Measure annualized return relative to maximum drawdown
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Metrics Input</CardTitle>
            <CardDescription>
              Enter annualized return and drawdown data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="annual-return">Annualized Return (%)</Label>
              <Input id="annual-return" type="number" placeholder="12.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-drawdown">Maximum Drawdown (%)</Label>
              <Input id="max-drawdown" type="number" placeholder="25.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period">Time Period (Years)</Label>
              <Input id="time-period" type="number" placeholder="3" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark-return">Benchmark Annual Return (%)</Label>
              <Input id="benchmark-return" type="number" placeholder="8.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-name">Portfolio Name</Label>
              <Input id="portfolio-name" placeholder="Long-Term Portfolio" />
            </div>

            <Button className="w-full">
              Calculate Calmar Ratio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calmar Ratio Analysis</CardTitle>
            <CardDescription>
              Risk-adjusted return assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0.50</div>
                <div className="text-sm text-muted-foreground">Calmar Ratio</div>
                <div className="text-xs text-green-600 mt-1">Good Risk-Adjusted Return</div>
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
                    <TableCell className="font-semibold">Calmar Ratio</TableCell>
                    <TableCell>0.50</TableCell>
                    <TableCell><Badge className="bg-green-500">Good</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Annual Return</TableCell>
                    <TableCell>12.5%</TableCell>
                    <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Max Drawdown</TableCell>
                    <TableCell>-25.0%</TableCell>
                    <TableCell><Badge className="bg-red-500">High</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Recovery Ratio</TableCell>
                    <TableCell>0.50</TableCell>
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
          <CardTitle>Calmar Ratio Explained</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Calmar Formula</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><strong>Calmar Ratio = Annual Return / |Max Drawdown|</strong></div>
                <div><strong>Where:</strong></div>
                <div>• Annual Return = Compounded annual growth rate</div>
                <div>• Max Drawdown = Maximum peak-to-trough decline</div>
                <div>• Higher ratio = Better risk-adjusted performance</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Calmar Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Long-term Investing:</strong> Multi-year performance assessment</li>
                <li><strong>Hedge Fund Evaluation:</strong> Risk-adjusted return comparison</li>
                <li><strong>Portfolio Management:</strong> Drawdown risk measurement</li>
                <li><strong>Strategy Validation:</strong> Historical stress testing</li>
                <li><strong>Risk Management:</strong> Capital preservation metrics</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Calmar Ratio Guidelines</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Calmar ratios above 0.5 are considered good</li>
              <li>• Ratios above 1.0 indicate excellent risk-adjusted returns</li>
              <li>• Particularly useful for evaluating long-term investment strategies</li>
              <li>• Accounts for the most severe loss experienced by the portfolio</li>
              <li>• Should be used alongside other risk metrics for comprehensive analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
