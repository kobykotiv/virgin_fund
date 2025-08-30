"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SharpeRatioCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Sharpe Ratio Calculator</h1>
        <p className="text-muted-foreground">
          Calculate risk-adjusted returns using the Sharpe ratio methodology
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
              <Label htmlFor="portfolio-return">Portfolio Return (%)</Label>
              <Input id="portfolio-return" type="number" placeholder="12.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk-free-rate">Risk-Free Rate (%)</Label>
              <Input id="risk-free-rate" type="number" placeholder="3.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volatility">Portfolio Volatility (%)</Label>
              <Input id="volatility" type="number" placeholder="18.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark-return">Benchmark Return (%)</Label>
              <Input id="benchmark-return" type="number" placeholder="8.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark-volatility">Benchmark Volatility (%)</Label>
              <Input id="benchmark-volatility" type="number" placeholder="12.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period">Time Period</Label>
              <select className="w-full p-2 border rounded-md" id="time-period">
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Sharpe Ratio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk-Adjusted Metrics</CardTitle>
            <CardDescription>
              Calculated Sharpe ratio and related metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  <TableCell className="font-semibold">Sharpe Ratio</TableCell>
                  <TableCell>0.50</TableCell>
                  <TableCell><Badge className="bg-yellow-500">Average</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Sortino Ratio</TableCell>
                  <TableCell>0.65</TableCell>
                  <TableCell><Badge className="bg-green-500">Good</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Information Ratio</TableCell>
                  <TableCell>0.35</TableCell>
                  <TableCell><Badge className="bg-yellow-500">Average</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Excess Return</TableCell>
                  <TableCell>9.0%</TableCell>
                  <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Tracking Error</TableCell>
                  <TableCell>8.5%</TableCell>
                  <TableCell><Badge variant="outline">Moderate</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sharpe Ratio Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Sharpe Ratio Scale</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>&lt; 0.5:</strong> Poor risk-adjusted returns</li>
                <li><strong>0.5 - 1.0:</strong> Average performance</li>
                <li><strong>1.0 - 1.5:</strong> Good risk-adjusted returns</li>
                <li><strong>1.5 - 2.0:</strong> Very good performance</li>
                <li><strong>&gt; 2.0:</strong> Excellent risk-adjusted returns</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Risk Metrics</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Sortino Ratio:</strong> Downside risk only</li>
                <li><strong>Information Ratio:</strong> Active return vs tracking error</li>
                <li><strong>Excess Return:</strong> Return above risk-free rate</li>
                <li><strong>Tracking Error:</strong> Volatility vs benchmark</li>
                <li><strong>Volatility:</strong> Total risk (standard deviation)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Portfolio Optimization Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Higher Sharpe ratio indicates better risk-adjusted returns</li>
              <li>• Compare ratios across similar investment strategies</li>
              <li>• Consider both upside and downside volatility</li>
              <li>• Use Sharpe ratio for portfolio selection and rebalancing</li>
              <li>• Historical ratios may not predict future performance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
