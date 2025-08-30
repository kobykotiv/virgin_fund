"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ValueAtRiskCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Value at Risk (VaR) Calculator</h1>
        <p className="text-muted-foreground">
          Calculate portfolio risk using Value at Risk methodology
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Risk Parameters</CardTitle>
            <CardDescription>
              Enter portfolio details for VaR calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-value">Portfolio Value ($)</Label>
              <Input id="portfolio-value" type="number" placeholder="1000000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volatility">Portfolio Volatility (%)</Label>
              <Input id="volatility" type="number" placeholder="15.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence Level (%)</Label>
              <select className="w-full p-2 border rounded-md" id="confidence">
                <option value="95">95% (Standard)</option>
                <option value="99">99% (Conservative)</option>
                <option value="99.9">99.9% (Very Conservative)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-horizon">Time Horizon (days)</Label>
              <Input id="time-horizon" type="number" placeholder="1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">VaR Method</Label>
              <select className="w-full p-2 border rounded-md" id="method">
                <option value="parametric">Parametric (Variance-Covariance)</option>
                <option value="historical">Historical Simulation</option>
                <option value="monte-carlo">Monte Carlo Simulation</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Value at Risk
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
            <CardDescription>
              Calculated VaR and risk measures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-600">-$23,450</div>
                <div className="text-sm text-muted-foreground">1-day VaR (95% confidence)</div>
                <div className="text-xs text-red-600 mt-1">Maximum expected loss</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk Measure</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">VaR (95%)</TableCell>
                    <TableCell>-$23,450</TableCell>
                    <TableCell><Badge className="bg-red-500">-2.35%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">VaR (99%)</TableCell>
                    <TableCell>-$35,200</TableCell>
                    <TableCell><Badge className="bg-red-600">-3.52%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Expected Shortfall</TableCell>
                    <TableCell>-$28,500</TableCell>
                    <TableCell><Badge className="bg-red-700">-2.85%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Maximum Drawdown</TableCell>
                    <TableCell>-$45,000</TableCell>
                    <TableCell><Badge className="bg-red-800">-4.50%</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>VaR Methodology & Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 VaR Methods</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Parametric:</strong> Assumes normal distribution</li>
                <li><strong>Historical:</strong> Uses past market data</li>
                <li><strong>Monte Carlo:</strong> Simulates multiple scenarios</li>
                <li><strong>95% Confidence:</strong> 5% probability of larger loss</li>
                <li><strong>99% Confidence:</strong> 1% probability of larger loss</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Risk Management</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Position Sizing:</strong> Limit exposure to VaR limits</li>
                <li><strong>Diversification:</strong> Reduce portfolio correlation</li>
                <li><strong>Hedging:</strong> Use derivatives to offset risk</li>
                <li><strong>Stress Testing:</strong> Test extreme scenarios</li>
                <li><strong>Risk Limits:</strong> Set maximum acceptable VaR</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Important Considerations</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• VaR is a statistical estimate, not a guarantee</li>
              <li>• Past performance doesn't predict future losses</li>
              <li>• Black swan events can exceed VaR estimates</li>
              <li>• Use multiple confidence levels for comprehensive risk assessment</li>
              <li>• Combine VaR with other risk measures for better risk management</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
