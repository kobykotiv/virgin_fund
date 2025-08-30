"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ROICalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">ROI Calculator</h1>
        <p className="text-muted-foreground">
          Calculate return on investment and analyze profitability metrics
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>
              Enter investment costs and returns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initial-investment">Initial Investment ($)</Label>
              <Input id="initial-investment" type="number" placeholder="10000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="final-value">Final Value ($)</Label>
              <Input id="final-value" type="number" placeholder="12500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-contributions">Additional Contributions ($)</Label>
              <Input id="additional-contributions" type="number" placeholder="2000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period">Time Period (years)</Label>
              <Input id="time-period" type="number" placeholder="3" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment-type">Investment Type</Label>
              <select className="w-full p-2 border rounded-md" id="investment-type">
                <option value="simple">Simple ROI</option>
                <option value="annualized">Annualized ROI</option>
                <option value="total">Total Return</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate ROI
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI Analysis</CardTitle>
            <CardDescription>
              Return metrics and performance analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">25.0%</div>
                <div className="text-sm text-muted-foreground">Total ROI</div>
                <div className="text-xs text-green-600 mt-1">Excellent Performance</div>
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
                    <TableCell className="font-semibold">Total Return</TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell><Badge className="bg-green-500">Profit</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">ROI Percentage</TableCell>
                    <TableCell>25.0%</TableCell>
                    <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Annualized ROI</TableCell>
                    <TableCell>7.8%</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Average</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">CAGR</TableCell>
                    <TableCell>7.8%</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Moderate</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Break-Even Time</TableCell>
                    <TableCell>2.4 years</TableCell>
                    <TableCell><Badge className="bg-blue-500">Achieved</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>ROI Interpretation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 ROI Performance Scale</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Excellent (20%+):</strong> Outstanding returns</li>
                <li><strong>Very Good (15-20%):</strong> Strong performance</li>
                <li><strong>Good (10-15%):</strong> Solid returns</li>
                <li><strong>Average (5-10%):</strong> Moderate performance</li>
                <li><strong>Poor (&lt;5%):</strong> Below average returns</li>
                <li><strong>Negative:</strong> Loss on investment</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Investment Benchmarks</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>S&P 500:</strong> ~10% annual average</li>
                <li><strong>Bonds:</strong> ~4-6% annual average</li>
                <li><strong>Real Estate:</strong> ~8-12% annual average</li>
                <li><strong>Savings Account:</strong> ~1-2% annual average</li>
                <li><strong>Inflation:</strong> ~3% annual average</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 ROI Analysis Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Compare ROI across similar investment types</li>
              <li>• Consider risk-adjusted returns, not just raw ROI</li>
              <li>• Account for inflation when evaluating long-term returns</li>
              <li>• Include all costs (fees, taxes) in calculations</li>
              <li>• Use annualized ROI for fair comparisons across time periods</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
