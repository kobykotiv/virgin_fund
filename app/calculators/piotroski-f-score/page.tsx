"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PiotroskiFScoreCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Piotroski F-Score Calculator</h1>
        <p className="text-muted-foreground">
          Calculate fundamental strength using Piotroski's F-Score methodology
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics Input</CardTitle>
            <CardDescription>
              Enter company financial data for F-Score calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="return-on-assets">Return on Assets (ROA) Current Year</Label>
              <Input id="return-on-assets" type="number" placeholder="8.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operating-cash-flow">Operating Cash Flow Current Year</Label>
              <Input id="operating-cash-flow" type="number" placeholder="1200000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="change-in-roa">Change in ROA (Current - Previous)</Label>
              <Input id="change-in-roa" type="number" placeholder="0.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="change-in-leverage">Change in Leverage (Current - Previous)</Label>
              <Input id="change-in-leverage" type="number" placeholder="-0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="change-in-liquidity">Change in Current Ratio (Current - Previous)</Label>
              <Input id="change-in-liquidity" type="number" placeholder="0.2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="change-in-gross-margin">Change in Gross Margin (Current - Previous)</Label>
              <Input id="change-in-gross-margin" type="number" placeholder="1.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="change-in-asset-turnover">Change in Asset Turnover (Current - Previous)</Label>
              <Input id="change-in-asset-turnover" type="number" placeholder="0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Microsoft Corp." />
            </div>

            <Button className="w-full">
              Calculate F-Score
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>F-Score Analysis</CardTitle>
            <CardDescription>
              Fundamental strength assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">7</div>
                <div className="text-sm text-muted-foreground">Piotroski F-Score</div>
                <div className="text-xs text-green-600 mt-1">Strong Fundamentals</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criterion</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Profitability</TableCell>
                    <TableCell>3/3</TableCell>
                    <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Leverage/Liquidity</TableCell>
                    <TableCell>2/2</TableCell>
                    <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Operating Efficiency</TableCell>
                    <TableCell>2/2</TableCell>
                    <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Total F-Score</TableCell>
                    <TableCell>7/9</TableCell>
                    <TableCell><Badge className="bg-green-500">High Quality</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>F-Score Criteria & Interpretation</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 F-Score Components</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Profitability (3 points):</strong> ROA, CFO, ΔROA</li>
                <li><strong>Leverage (2 points):</strong> ΔLeverage, ΔLiquidity</li>
                <li><strong>Operating Efficiency (4 points):</strong> ΔMargin, ΔTurnover</li>
                <li><strong>Total Score:</strong> 0-9 points possible</li>
                <li><strong>High Score:</strong> 7-9 (Strong fundamentals)</li>
                <li><strong>Low Score:</strong> 0-3 (Weak fundamentals)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 F-Score Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Value Investing:</strong> Quality screen for value stocks</li>
                <li><strong>Portfolio Construction:</strong> Fundamental strength filter</li>
                <li><strong>Risk Management:</strong> Avoid deteriorating companies</li>
                <li><strong>Performance Prediction:</strong> Future return indicator</li>
                <li><strong>Due Diligence:</strong> Comprehensive health check</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 F-Score Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use F-Score to complement other valuation metrics</li>
              <li>• Focus on companies with improving fundamentals (higher scores)</li>
              <li>• Consider industry context when interpreting scores</li>
              <li>• Monitor F-Score trends over multiple years</li>
              <li>• Combine with other quality metrics for robust analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
