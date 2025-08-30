"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function OmegaRatioCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Omega Ratio Calculator</h1>
        <p className="text-muted-foreground">
          Measure the probability-weighted ratio of gains versus losses
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Return Distribution Input</CardTitle>
            <CardDescription>
              Enter portfolio return data and threshold
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold-return">Threshold Return (%)</Label>
              <Input id="threshold-return" type="number" placeholder="5.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returns-above">Returns Above Threshold (%)</Label>
              <Input id="returns-above" type="number" placeholder="15.2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returns-below">Returns Below Threshold (%)</Label>
              <Input id="returns-below" type="number" placeholder="-8.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight-above">Weight Above Threshold</Label>
              <Input id="weight-above" type="number" placeholder="0.6" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight-below">Weight Below Threshold</Label>
              <Input id="weight-below" type="number" placeholder="0.4" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-name">Portfolio Name</Label>
              <Input id="portfolio-name" placeholder="Diversified Portfolio" />
            </div>

            <Button className="w-full">
              Calculate Omega Ratio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Omega Ratio Results</CardTitle>
            <CardDescription>
              Probability-weighted performance assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1.85</div>
                <div className="text-sm text-muted-foreground">Omega Ratio</div>
                <div className="text-xs text-green-600 mt-1">Strong Performance</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Upside Potential</TableCell>
                    <TableCell>9.12%</TableCell>
                    <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Downside Risk</TableCell>
                    <TableCell>-3.4%</TableCell>
                    <TableCell><Badge className="bg-red-500">Negative</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Upside Weight</TableCell>
                    <TableCell>60%</TableCell>
                    <TableCell><Badge className="bg-blue-500">Dominant</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Downside Weight</TableCell>
                    <TableCell>40%</TableCell>
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
          <CardTitle>Omega Ratio Methodology</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Omega Formula</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><strong>Ω(r) = ∫(r to ∞) [1 - F(x)] dx / ∫(-∞ to r) F(x) dx</strong></div>
                <div><strong>Simplified:</strong></div>
                <div>• Ω = (Upside Area) / (Downside Area)</div>
                <div>• r = Threshold return level</div>
                <div>• F(x) = Cumulative distribution function</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Omega Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Performance Measurement:</strong> All moments of return distribution</li>
                <li><strong>Risk Assessment:</strong> Tail risk and extreme outcomes</li>
                <li><strong>Portfolio Optimization:</strong> Higher moment considerations</li>
                <li><strong>Hedge Fund Analysis:</strong> Alternative investment evaluation</li>
                <li><strong>Strategy Comparison:</strong> Beyond mean-variance analysis</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Omega Ratio Guidelines</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Omega ratio > 1 indicates positive performance above threshold</li>
              <li>• Higher values suggest better risk-adjusted returns</li>
              <li>• Considers the entire return distribution, not just variance</li>
              <li>• Particularly useful for strategies with asymmetric returns</li>
              <li>• Can be calculated at different threshold levels</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
