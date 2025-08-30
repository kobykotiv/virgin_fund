"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export default function MonteCarloCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Monte Carlo Simulation</h1>
        <p className="text-muted-foreground">
          Run probabilistic simulations to model investment outcomes and risk
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>
              Configure your Monte Carlo simulation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Investment ($)</Label>
              <Input id="initial" type="number" placeholder="10000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">Time Horizon (years)</Label>
              <Input id="years" type="number" placeholder="30" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="return">Expected Annual Return (%)</Label>
              <Input id="return" type="number" placeholder="7.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volatility">Annual Volatility (%)</Label>
              <Input id="volatility" type="number" placeholder="15.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="simulations">Number of Simulations</Label>
              <Input id="simulations" type="number" placeholder="1000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribution">Annual Contribution ($)</Label>
              <Input id="contribution" type="number" placeholder="5000" />
            </div>

            <Button className="w-full">
              Run Monte Carlo Simulation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              Probabilistic outcomes and risk metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Simulation Progress</Label>
                <Progress value={75} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">750/1000 simulations completed</p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Best Case</TableCell>
                    <TableCell>$1,250,000</TableCell>
                    <TableCell><Badge variant="outline">10%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Expected Value</TableCell>
                    <TableCell>$850,000</TableCell>
                    <TableCell><Badge className="bg-blue-500">50%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Worst Case</TableCell>
                    <TableCell>$425,000</TableCell>
                    <TableCell><Badge variant="outline">10%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Success Rate</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell><Badge className="bg-green-500">>$1M Target</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Probability Distribution</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 10th percentile: $425K</li>
                <li>• 25th percentile: $625K</li>
                <li>• Median: $850K</li>
                <li>• 75th percentile: $1.1M</li>
                <li>• 90th percentile: $1.25M</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Risk Metrics</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Standard Deviation: $285K</li>
                <li>• Sharpe Ratio: 0.85</li>
                <li>• Maximum Drawdown: -22%</li>
                <li>• Value at Risk (95%): -$150K</li>
                <li>• Expected Shortfall: -$200K</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">💡 Insights</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 78% chance of reaching $1M</li>
                <li>• Best case 2.5x expected value</li>
                <li>• Worst case 50% of expected value</li>
                <li>• Moderate risk profile</li>
                <li>• Consider increasing contributions</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Monte Carlo Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use historical data for realistic return/volatility estimates</li>
              <li>• Run at least 1,000 simulations for statistical significance</li>
              <li>• Consider correlation between different asset classes</li>
              <li>• Account for inflation and taxes in long-term projections</li>
              <li>• Re-run simulations regularly as market conditions change</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
