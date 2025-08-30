"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function JensensAlphaCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Jensen's Alpha Calculator</h1>
        <p className="text-muted-foreground">
          Measure portfolio performance relative to CAPM expected returns
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>CAPM Parameters Input</CardTitle>
            <CardDescription>
              Enter portfolio and market data for alpha calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-return">Portfolio Return (%)</Label>
              <Input id="portfolio-return" type="number" placeholder="15.2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk-free-rate">Risk-Free Rate (%)</Label>
              <Input id="risk-free-rate" type="number" placeholder="3.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-return">Market Return (%)</Label>
              <Input id="market-return" type="number" placeholder="12.8" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-beta">Portfolio Beta</Label>
              <Input id="portfolio-beta" type="number" placeholder="1.2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-name">Portfolio Name</Label>
              <Input id="portfolio-name" placeholder="Growth Fund" />
            </div>

            <Button className="w-full">
              Calculate Jensen's Alpha
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jensen's Alpha Results</CardTitle>
            <CardDescription>
              Risk-adjusted performance vs market expectations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">2.1%</div>
                <div className="text-sm text-muted-foreground">Jensen's Alpha</div>
                <div className="text-xs text-green-600 mt-1">Outperforming Market</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Analysis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Actual Return</TableCell>
                    <TableCell>15.2%</TableCell>
                    <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Expected Return (CAPM)</TableCell>
                    <TableCell>13.1%</TableCell>
                    <TableCell><Badge className="bg-blue-500">Market</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Jensen's Alpha</TableCell>
                    <TableCell>2.1%</TableCell>
                    <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Portfolio Beta</TableCell>
                    <TableCell>1.2</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Aggressive</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Jensen's Alpha Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Jensen's Alpha Formula</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><strong>α = Rp - [Rf + β(Rm - Rf)]</strong></div>
                <div><strong>Where:</strong></div>
                <div>• Rp = Portfolio return</div>
                <div>• Rf = Risk-free rate</div>
                <div>• Rm = Market return</div>
                <div>• β = Portfolio beta</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Alpha Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Manager Skill:</strong> Measure stock selection and timing ability</li>
                <li><strong>Performance Attribution:</strong> Sources of excess returns</li>
                <li><strong>Portfolio Evaluation:</strong> Risk-adjusted performance</li>
                <li><strong>Strategy Assessment:</strong> Active vs passive management</li>
                <li><strong>Compensation:</strong> Performance-based fee structures</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Jensen's Alpha Guidelines</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Positive alpha indicates outperformance vs market expectations</li>
              <li>• Negative alpha suggests underperformance after risk adjustment</li>
              <li>• Alpha should be evaluated over multiple market cycles</li>
              <li>• Higher alpha values indicate better risk-adjusted performance</li>
              <li>• Useful for comparing managers with different risk profiles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
