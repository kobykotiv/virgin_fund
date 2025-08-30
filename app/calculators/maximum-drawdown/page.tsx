"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MaximumDrawdownCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Maximum Drawdown Calculator</h1>
        <p className="text-muted-foreground">
          Calculate the largest peak-to-trough decline in portfolio value
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Data Input</CardTitle>
            <CardDescription>
              Enter portfolio values or returns over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initial-value">Initial Portfolio Value ($)</Label>
              <Input id="initial-value" type="number" placeholder="100000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peak-value">Peak Portfolio Value ($)</Label>
              <Input id="peak-value" type="number" placeholder="125000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trough-value">Trough Portfolio Value ($)</Label>
              <Input id="trough-value" type="number" placeholder="85000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-value">Current Portfolio Value ($)</Label>
              <Input id="current-value" type="number" placeholder="110000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period">Time Period (Months)</Label>
              <Input id="time-period" type="number" placeholder="24" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-name">Portfolio Name</Label>
              <Input id="portfolio-name" placeholder="Tech Growth Portfolio" />
            </div>

            <Button className="w-full">
              Calculate Maximum Drawdown
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drawdown Analysis</CardTitle>
            <CardDescription>
              Risk assessment and recovery metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">-32.0%</div>
                <div className="text-sm text-muted-foreground">Maximum Drawdown</div>
                <div className="text-xs text-red-600 mt-1">Severe Decline</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Assessment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Max Drawdown</TableCell>
                    <TableCell>-32.0%</TableCell>
                    <TableCell><Badge className="bg-red-500">High Risk</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Recovery Time</TableCell>
                    <TableCell>8 months</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Moderate</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Current Drawdown</TableCell>
                    <TableCell>-12.0%</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Recovering</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Peak to Current</TableCell>
                    <TableCell>-12.0%</TableCell>
                    <TableCell><Badge className="bg-green-500">Improving</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Maximum Drawdown Explained</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Drawdown Formula</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><strong>MDD = (Peak - Trough) / Peak</strong></div>
                <div><strong>Where:</strong></div>
                <div>• Peak = Highest portfolio value</div>
                <div>• Trough = Lowest portfolio value during decline</div>
                <div>• MDD = Maximum percentage decline</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Drawdown Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Risk Assessment:</strong> Worst-case scenario analysis</li>
                <li><strong>Portfolio Stress Testing:</strong> Historical decline simulation</li>
                <li><strong>Strategy Evaluation:</strong> Risk-adjusted performance</li>
                <li><strong>Position Sizing:</strong> Risk management framework</li>
                <li><strong>Investor Psychology:</strong> Loss tolerance measurement</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Drawdown Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Lower maximum drawdown indicates better risk control</li>
              <li>• Consider recovery time alongside drawdown magnitude</li>
              <li>• Use drawdown limits to protect capital during downturns</li>
              <li>• Monitor current drawdown as an early warning signal</li>
              <li>• Compare drawdowns across similar investment strategies</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
