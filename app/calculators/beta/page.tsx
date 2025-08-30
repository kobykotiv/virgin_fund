"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BetaCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Beta Calculator</h1>
        <p className="text-muted-foreground">
          Calculate stock beta and systematic risk relative to market
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Stock Returns Input</CardTitle>
            <CardDescription>
              Enter stock and market returns for beta calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock-returns">Stock Returns (%)</Label>
              <Input id="stock-returns" placeholder="e.g., 5.2, 3.1, -2.5, 8.7, 4.3" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-returns">Market Returns (%)</Label>
              <Input id="market-returns" placeholder="e.g., 3.8, 4.2, -1.8, 6.9, 5.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-name">Stock Symbol/Name</Label>
              <Input id="stock-name" placeholder="AAPL" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benchmark">Benchmark Index</Label>
              <select className="w-full p-2 border rounded-md" id="benchmark">
                <option value="sp500">S&P 500</option>
                <option value="nasdaq">NASDAQ-100</option>
                <option value="dow">Dow Jones</option>
                <option value="russell">Russell 2000</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period">Time Period</Label>
              <select className="w-full p-2 border rounded-md" id="time-period">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Beta
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beta Analysis</CardTitle>
            <CardDescription>
              Systematic risk and market sensitivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">1.25</div>
                <div className="text-sm text-muted-foreground">Stock Beta</div>
                <div className="text-xs text-orange-600 mt-1">Above Average Market Risk</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Beta</TableCell>
                    <TableCell>1.25</TableCell>
                    <TableCell><Badge className="bg-orange-500">High</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Correlation</TableCell>
                    <TableCell>0.78</TableCell>
                    <TableCell><Badge className="bg-blue-500">Strong</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">R-squared</TableCell>
                    <TableCell>61%</TableCell>
                    <TableCell><Badge variant="outline">Good Fit</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Alpha</TableCell>
                    <TableCell>2.1%</TableCell>
                    <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Volatility</TableCell>
                    <TableCell>28%</TableCell>
                    <TableCell><Badge className="bg-red-500">High</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Beta Interpretation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Beta Scale</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>β > 1.0:</strong> More volatile than market</li>
                <li><strong>β = 1.0:</strong> Same volatility as market</li>
                <li><strong>β &lt; 1.0:</strong> Less volatile than market</li>
                <li><strong>β = 0:</strong> No correlation with market</li>
                <li><strong>β &lt; 0:</strong> Negative correlation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Risk Categories</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Low Risk (β &lt; 0.8):</strong> Defensive stocks</li>
                <li><strong>Moderate Risk (β 0.8-1.2):</strong> Market followers</li>
                <li><strong>High Risk (β &gt; 1.2):</strong> Aggressive stocks</li>
                <li><strong>Very High Risk (β &gt; 1.5):</strong> Speculative</li>
                <li><strong>Negative Beta:</strong> Inverse to market</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Beta Analysis Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Beta measures systematic risk, not total risk</li>
              <li>• Use at least 2-3 years of data for reliable beta</li>
              <li>• Beta can change during different market conditions</li>
              <li>• Consider industry and company-specific factors</li>
              <li>• Use beta in CAPM for expected return calculations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
