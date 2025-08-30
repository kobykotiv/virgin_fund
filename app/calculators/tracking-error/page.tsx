"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TrackingErrorCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tracking Error Calculator</h1>
        <p className="text-muted-foreground">
          Measure the volatility of active returns relative to a benchmark
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Return Data Input</CardTitle>
            <CardDescription>
              Enter portfolio and benchmark returns over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-returns">Portfolio Returns (%)</Label>
              <Input id="portfolio-returns" placeholder="12.5, 8.3, 15.2, -5.1, 9.8" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark-returns">Benchmark Returns (%)</Label>
              <Input id="benchmark-returns" placeholder="10.2, 7.8, 12.1, -4.5, 8.9" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period">Time Period</Label>
              <Input id="time-period" placeholder="Monthly" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-name">Portfolio Name</Label>
              <Input id="portfolio-name" placeholder="Active Fund" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark-name">Benchmark Name</Label>
              <Input id="benchmark-name" placeholder="S&P 500" />
            </div>

            <Button className="w-full">
              Calculate Tracking Error
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tracking Error Analysis</CardTitle>
            <CardDescription>
              Active risk and deviation measurement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3.2%</div>
                <div className="text-sm text-muted-foreground">Annual Tracking Error</div>
                <div className="text-xs text-blue-600 mt-1">Moderate Active Risk</div>
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
                    <TableCell className="font-semibold">Tracking Error</TableCell>
                    <TableCell>3.2%</TableCell>
                    <TableCell><Badge className="bg-blue-500">Moderate</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Active Return</TableCell>
                    <TableCell>2.3%</TableCell>
                    <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Information Ratio</TableCell>
                    <TableCell>0.72</TableCell>
                    <TableCell><Badge className="bg-green-500">Good</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Benchmark Correlation</TableCell>
                    <TableCell>0.85</TableCell>
                    <TableCell><Badge className="bg-yellow-500">High</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tracking Error Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Tracking Error Formula</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><strong>TE = σ(Rp - Rb)</strong></div>
                <div><strong>Where:</strong></div>
                <div>• Rp = Portfolio returns</div>
                <div>• Rb = Benchmark returns</div>
                <div>• σ = Standard deviation</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Tracking Error Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Risk Management:</strong> Active risk measurement</li>
                <li><strong>Portfolio Construction:</strong> Benchmark deviation control</li>
                <li><strong>Performance Attribution:</strong> Sources of excess returns</li>
                <li><strong>Strategy Evaluation:</strong> Active management assessment</li>
                <li><strong>Compliance Monitoring:</strong> Investment mandate adherence</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Tracking Error Guidelines</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Lower tracking error indicates closer benchmark following</li>
              <li>• Higher tracking error suggests more active management</li>
              <li>• Should be evaluated relative to investment objectives</li>
              <li>• Important for understanding portfolio risk profile</li>
              <li>• Used in combination with information ratio for performance assessment</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
