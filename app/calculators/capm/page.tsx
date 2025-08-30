"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CAPMCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">CAPM Calculator</h1>
        <p className="text-muted-foreground">
          Calculate expected return using Capital Asset Pricing Model
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>CAPM Parameters</CardTitle>
            <CardDescription>
              Enter risk-free rate, market return, and beta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="risk-free-rate">Risk-Free Rate (%)</Label>
              <Input id="risk-free-rate" type="number" placeholder="4.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-return">Expected Market Return (%)</Label>
              <Input id="market-return" type="number" placeholder="10.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beta">Stock Beta</Label>
              <Input id="beta" type="number" placeholder="1.2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-name">Stock Symbol/Name</Label>
              <Input id="stock-name" placeholder="AAPL" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation-type">Calculation Type</Label>
              <select className="w-full p-2 border rounded-md" id="calculation-type">
                <option value="expected-return">Expected Return</option>
                <option value="required-return">Required Return</option>
                <option value="cost-of-equity">Cost of Equity</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate CAPM
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CAPM Results</CardTitle>
            <CardDescription>
              Expected return and risk premium analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">11.1%</div>
                <div className="text-sm text-muted-foreground">Expected Return (CAPM)</div>
                <div className="text-xs text-green-600 mt-1">Above Risk-Free Rate</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Analysis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Risk-Free Rate</TableCell>
                    <TableCell>4.5%</TableCell>
                    <TableCell><Badge variant="outline">Base Rate</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Market Risk Premium</TableCell>
                    <TableCell>5.5%</TableCell>
                    <TableCell><Badge className="bg-blue-500">Market Return</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Beta Risk Premium</TableCell>
                    <TableCell>3.3%</TableCell>
                    <TableCell><Badge className="bg-orange-500">Stock Risk</Badge></TableCell>
                  </TableRow>
                  <TableRow className="bg-green-50 dark:bg-green-950/20">
                    <TableCell className="font-semibold">Expected Return</TableCell>
                    <TableCell>11.1%</TableCell>
                    <TableCell><Badge className="bg-green-500">CAPM Result</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>CAPM Model Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 CAPM Formula</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Expected Return =</strong> Risk-Free Rate + Beta × (Market Return - Risk-Free Rate)</li>
                <li><strong>Risk-Free Rate:</strong> Government bond yield</li>
                <li><strong>Market Return:</strong> Expected market portfolio return</li>
                <li><strong>Beta:</strong> Stock's market sensitivity</li>
                <li><strong>Risk Premium:</strong> Compensation for risk</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 CAPM Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Cost of Equity:</strong> Required return for shareholders</li>
                <li><strong>Security Valuation:</strong> Fair value assessment</li>
                <li><strong>Portfolio Theory:</strong> Efficient frontier construction</li>
                <li><strong>Risk Management:</strong> Risk-adjusted performance</li>
                <li><strong>Capital Budgeting:</strong> Project evaluation</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 CAPM Assumptions & Limitations</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Investors are rational and risk-averse</li>
              <li>• Perfect capital markets with no transaction costs</li>
              <li>• All investors have same expectations and time horizon</li>
              <li>• Unlimited borrowing and lending at risk-free rate</li>
              <li>• May not account for unsystematic risk or behavioral factors</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
