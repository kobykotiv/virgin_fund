"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CorrelationCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Correlation Calculator</h1>
        <p className="text-muted-foreground">
          Analyze the relationship between different assets and build diversified portfolios
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Asset Returns Input</CardTitle>
            <CardDescription>
              Enter historical returns for correlation analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset1">Asset 1 Returns (%)</Label>
              <Input id="asset1" placeholder="e.g., 5.2, 3.1, -2.5, 8.7, 4.3" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset2">Asset 2 Returns (%)</Label>
              <Input id="asset2" placeholder="e.g., 3.8, 4.2, -1.8, 6.9, 5.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset1-name">Asset 1 Name</Label>
              <Input id="asset1-name" placeholder="S&P 500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset2-name">Asset 2 Name</Label>
              <Input id="asset2-name" placeholder="Gold" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period">Time Period</Label>
              <select className="w-full p-2 border rounded-md" id="time-period">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Correlation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Correlation Results</CardTitle>
            <CardDescription>
              Statistical relationship between assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">0.65</div>
                <div className="text-sm text-muted-foreground">Correlation Coefficient</div>
                <div className="text-xs text-blue-600 mt-1">Moderate Positive Correlation</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statistic</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Interpretation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Correlation (r)</TableCell>
                    <TableCell>0.65</TableCell>
                    <TableCell><Badge className="bg-blue-500">Moderate</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">R-squared</TableCell>
                    <TableCell>42.3%</TableCell>
                    <TableCell><Badge variant="outline">Explained Variance</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Covariance</TableCell>
                    <TableCell>0.023</TableCell>
                    <TableCell><Badge variant="outline">Joint Variability</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Beta</TableCell>
                    <TableCell>0.78</TableCell>
                    <TableCell><Badge className="bg-green-500">Market Sensitivity</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Correlation Interpretation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Correlation Scale</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>+1.0:</strong> Perfect positive correlation</li>
                <li><strong>+0.7 to +1.0:</strong> Strong positive correlation</li>
                <li><strong>+0.3 to +0.7:</strong> Moderate positive correlation</li>
                <li><strong>0 to +0.3:</strong> Weak positive correlation</li>
                <li><strong>0:</strong> No correlation</li>
                <li><strong>-0.3 to 0:</strong> Weak negative correlation</li>
                <li><strong>-0.7 to -0.3:</strong> Moderate negative correlation</li>
                <li><strong>-1.0 to -0.7:</strong> Strong negative correlation</li>
                <li><strong>-1.0:</strong> Perfect negative correlation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Portfolio Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Diversification:</strong> Low correlation reduces risk</li>
                <li><strong>Hedging:</strong> Negative correlation for protection</li>
                <li><strong>Risk Management:</strong> Monitor changing correlations</li>
                <li><strong>Asset Allocation:</strong> Balance correlated assets</li>
                <li><strong>Rebalancing:</strong> Adjust based on correlation shifts</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Correlation Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Correlation can change during market stress</li>
              <li>• Use rolling correlations for trend analysis</li>
              <li>• Consider multiple time periods for robustness</li>
              <li>• Correlation ≠ Causation in investment relationships</li>
              <li>• Monitor correlations regularly for portfolio health</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
