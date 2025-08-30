"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BreakEvenCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Break-Even Calculator</h1>
        <p className="text-muted-foreground">
          Calculate the point where investment costs equal returns
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Investment Parameters</CardTitle>
            <CardDescription>
              Enter costs and expected returns for break-even analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initial-investment">Initial Investment ($)</Label>
              <Input id="initial-investment" type="number" placeholder="10000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual-contribution">Annual Contribution ($)</Label>
              <Input id="annual-contribution" type="number" placeholder="2000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
              <Input id="expected-return" type="number" placeholder="7.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-horizon">Time Horizon (years)</Label>
              <Input id="time-horizon" type="number" placeholder="10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
              <Input id="inflation-rate" type="number" placeholder="3.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation-type">Calculation Type</Label>
              <select className="w-full p-2 border rounded-md" id="calculation-type">
                <option value="investment">Investment Break-Even</option>
                <option value="business">Business Break-Even</option>
                <option value="trading">Trading Break-Even</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Break-Even
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Break-Even Analysis</CardTitle>
            <CardDescription>
              Point where costs equal returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$19,450</div>
                <div className="text-sm text-muted-foreground">Total Investment Required</div>
                <div className="text-xs text-green-600 mt-1">Break-even at 7 years</div>
              </div>

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
                    <TableCell className="font-semibold">Break-Even Point</TableCell>
                    <TableCell>7 years</TableCell>
                    <TableCell><Badge className="bg-blue-500">Achievable</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Total Contributions</TableCell>
                    <TableCell>$34,000</TableCell>
                    <TableCell><Badge variant="outline">Cumulative</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Investment Growth</TableCell>
                    <TableCell>$14,550</TableCell>
                    <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Real Return</TableCell>
                    <TableCell>$8,920</TableCell>
                    <TableCell><Badge className="bg-green-500">After Inflation</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Annual Break-Even</TableCell>
                    <TableCell>$2,778</TableCell>
                    <TableCell><Badge variant="outline">Per Year</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Break-Even Analysis Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Break-Even Components</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Fixed Costs:</strong> Initial investment, setup fees</li>
                <li><strong>Variable Costs:</strong> Ongoing contributions, maintenance</li>
                <li><strong>Revenue/Returns:</strong> Investment growth, income</li>
                <li><strong>Time Factor:</strong> When costs equal returns</li>
                <li><strong>Risk Factor:</strong> Probability of achieving break-even</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Investment Strategies</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Conservative:</strong> Lower returns, longer break-even</li>
                <li><strong>Aggressive:</strong> Higher returns, shorter break-even</li>
                <li><strong>Diversified:</strong> Balanced risk, moderate timeline</li>
                <li><strong>Regular Contributions:</strong> Dollar-cost averaging</li>
                <li><strong>Tax Optimization:</strong> Maximize after-tax returns</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Break-Even Considerations</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Break-even is a minimum target, not optimal outcome</li>
              <li>• Consider opportunity costs of tied-up capital</li>
              <li>• Account for taxes, fees, and inflation</li>
              <li>• Reassess periodically as market conditions change</li>
              <li>• Use break-even as one of many decision factors</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
