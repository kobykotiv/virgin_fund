"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InformationRatioCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Information Ratio Calculator</h1>
        <p className="text-muted-foreground">
          Measure active return per unit of active risk (tracking error)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio vs Benchmark Input</CardTitle>
            <CardDescription>
              Enter portfolio and benchmark performance data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-return">Portfolio Annual Return (%)</Label>
              <Input id="portfolio-return" type="number" placeholder="14.2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark-return">Benchmark Annual Return (%)</Label>
              <Input id="benchmark-return" type="number" placeholder="10.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tracking-error">Tracking Error (%)</Label>
              <Input id="tracking-error" type="number" placeholder="4.8" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="active-return">Active Return (%)</Label>
              <Input id="active-return" type="number" placeholder="3.7" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-name">Portfolio Name</Label>
              <Input id="portfolio-name" placeholder="Active Equity Fund" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark-name">Benchmark Name</Label>
              <Input id="benchmark-name" placeholder="S&P 500 Index" />
            </div>

            <Button className="w-full">
              Calculate Information Ratio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information Ratio Results</CardTitle>
            <CardDescription>
              Active management efficiency assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0.77</div>
                <div className="text-sm text-muted-foreground">Information Ratio</div>
                <div className="text-xs text-green-600 mt-1">Good Active Management</div>
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
                    <TableCell className="font-semibold">Information Ratio</TableCell>
                    <TableCell>0.77</TableCell>
                    <TableCell><Badge className="bg-green-500">Good</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Active Return</TableCell>
                    <TableCell>3.7%</TableCell>
                    <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Tracking Error</TableCell>
                    <TableCell>4.8%</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Moderate</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Benchmark Outperformance</TableCell>
                    <TableCell>3.7%</TableCell>
                    <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Information Ratio Methodology</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Information Ratio Formula</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><strong>IR = (Rp - Rb) / σ(Rp - Rb)</strong></div>
                <div><strong>Where:</strong></div>
                <div>• Rp = Portfolio return</div>
                <div>• Rb = Benchmark return</div>
                <div>• σ(Rp - Rb) = Tracking error (standard deviation of active returns)</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Information Ratio Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Fund Manager Evaluation:</strong> Active management skill assessment</li>
                <li><strong>Portfolio Attribution:</strong> Source of excess returns</li>
                <li><strong>Risk-Adjusted Performance:</strong> Benchmark-relative efficiency</li>
                <li><strong>Strategy Comparison:</strong> Active vs passive approaches</li>
                <li><strong>Performance Fees:</strong> Incentive compensation basis</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Information Ratio Guidelines</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• IR > 0.5 indicates good active management skill</li>
              <li>• IR > 1.0 suggests exceptional performance consistency</li>
              <li>• Higher IR means better return per unit of active risk</li>
              <li>• Useful for comparing managers with different risk profiles</li>
              <li>• Should be evaluated over multiple time periods</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
