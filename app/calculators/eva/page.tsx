"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EVACalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Economic Value Added (EVA) Calculator</h1>
        <p className="text-muted-foreground">
          Calculate economic profit and shareholder value creation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Financials</CardTitle>
            <CardDescription>
              Enter NOPAT and capital employed for EVA calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nopat">NOPAT (Net Operating Profit After Tax) ($M)</Label>
              <Input id="nopat" type="number" placeholder="500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capital-employed">Capital Employed ($M)</Label>
              <Input id="capital-employed" type="number" placeholder="2500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wacc">WACC (Weighted Average Cost of Capital) (%)</Label>
              <Input id="wacc" type="number" placeholder="10.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Apple Inc." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period">Time Period</Label>
              <select className="w-full p-2 border rounded-md" id="time-period">
                <option value="annual">Annual</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate EVA
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>EVA Analysis</CardTitle>
            <CardDescription>
              Economic profit and value creation metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$250M</div>
                <div className="text-sm text-muted-foreground">Economic Value Added</div>
                <div className="text-xs text-green-600 mt-1">Value Creation</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Analysis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">NOPAT</TableCell>
                    <TableCell>$500M</TableCell>
                    <TableCell><Badge className="bg-blue-500">Operating Profit</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Capital Charge</TableCell>
                    <TableCell>$250M</TableCell>
                    <TableCell><Badge variant="outline">Cost of Capital</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Economic Profit</TableCell>
                    <TableCell>$250M</TableCell>
                    <TableCell><Badge className="bg-green-500">Value Added</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Return on Capital</TableCell>
                    <TableCell>20.0%</TableCell>
                    <TableCell><Badge className="bg-green-500">Above WACC</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Value Creation Rate</TableCell>
                    <TableCell>10.0%</TableCell>
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
          <CardTitle>EVA Framework & Applications</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 EVA Formula</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>EVA = NOPAT - (Capital Employed × WACC)</strong></li>
                <li><strong>NOPAT:</strong> True economic profit</li>
                <li><strong>Capital Employed:</strong> Total capital invested</li>
                <li><strong>WACC:</strong> Required return on capital</li>
                <li><strong>EVA:</strong> Economic value added/wealth created</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 EVA Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Performance Measurement:</strong> Better than accounting profit</li>
                <li><strong>Executive Compensation:</strong> EVA-based incentives</li>
                <li><strong>Capital Allocation:</strong> Value-creating projects</li>
                <li><strong>Shareholder Value:</strong> Direct link to stock price</li>
                <li><strong>Strategic Planning:</strong> Long-term value focus</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 EVA Advantages</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Measures true economic profit after cost of capital</li>
              <li>• Encourages efficient use of capital and resources</li>
              <li>• Aligns management decisions with shareholder interests</li>
              <li>• Provides clear link between operations and value creation</li>
              <li>• Useful for comparing performance across companies and industries</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
