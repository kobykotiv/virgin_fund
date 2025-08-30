"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PEGRatioCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">PEG Ratio Calculator</h1>
        <p className="text-muted-foreground">
          Calculate Price/Earnings to Growth ratio for growth-adjusted valuation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Stock Valuation Input</CardTitle>
            <CardDescription>
              Enter P/E ratio and growth rate for PEG calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pe-ratio">P/E Ratio</Label>
              <Input id="pe-ratio" type="number" placeholder="25.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth-rate">Earnings Growth Rate (%)</Label>
              <Input id="growth-rate" type="number" placeholder="15.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-price">Current Stock Price ($)</Label>
              <Input id="stock-price" type="number" placeholder="150.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eps">Earnings Per Share ($)</Label>
              <Input id="eps" type="number" placeholder="6.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-name">Stock Symbol/Name</Label>
              <Input id="stock-name" placeholder="AAPL" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth-period">Growth Period</Label>
              <select className="w-full p-2 border rounded-md" id="growth-period">
                <option value="1year">1 Year</option>
                <option value="3year">3 Year</option>
                <option value="5year">5 Year</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate PEG Ratio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PEG Analysis</CardTitle>
            <CardDescription>
              Growth-adjusted valuation metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1.67</div>
                <div className="text-sm text-muted-foreground">PEG Ratio</div>
                <div className="text-xs text-blue-600 mt-1">Fairly Valued</div>
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
                    <TableCell className="font-semibold">P/E Ratio</TableCell>
                    <TableCell>25.0x</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Premium</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Growth Rate</TableCell>
                    <TableCell>15.0%</TableCell>
                    <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">PEG Ratio</TableCell>
                    <TableCell>1.67</TableCell>
                    <TableCell><Badge className="bg-blue-500">Fair</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Fair P/E</TableCell>
                    <TableCell>20.0x</TableCell>
                    <TableCell><Badge variant="outline">Target</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Growth-Adjusted Value</TableCell>
                    <TableCell>$120.00</TableCell>
                    <TableCell><Badge className="bg-green-500">Undervalued</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>PEG Ratio Interpretation</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 PEG Ratio Scale</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>PEG &lt; 1.0:</strong> Potentially undervalued (good value)</li>
                <li><strong>PEG = 1.0:</strong> Fairly valued</li>
                <li><strong>PEG 1.0-2.0:</strong> Reasonably valued</li>
                <li><strong>PEG &gt; 2.0:</strong> Potentially overvalued</li>
                <li><strong>PEG &gt; 3.0:</strong> Significantly overvalued</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 PEG Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Growth Stock Valuation:</strong> Better than P/E alone</li>
                <li><strong>Relative Comparison:</strong> Compare similar growth stocks</li>
                <li><strong>Market Timing:</strong> Identify overvalued growth stocks</li>
                <li><strong>Portfolio Allocation:</strong> Balance value and growth</li>
                <li><strong>Risk Assessment:</strong> Growth vs valuation risk</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 PEG Ratio Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use consistent growth periods (1-year, 3-year, 5-year)</li>
              <li>• Compare PEG ratios within the same industry</li>
              <li>• Consider quality of earnings growth (sustainable vs cyclical)</li>
              <li>• Use PEG with other valuation metrics for comprehensive analysis</li>
              <li>• Be cautious with negative earnings or extremely high growth rates</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
