"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function WACCCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">WACC Calculator</h1>
        <p className="text-muted-foreground">
          Calculate Weighted Average Cost of Capital for valuation and investment decisions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Capital Structure Input</CardTitle>
            <CardDescription>
              Enter company capital structure and costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="market-value-equity">Market Value of Equity ($M)</Label>
              <Input id="market-value-equity" type="number" placeholder="5000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-value-debt">Market Value of Debt ($M)</Label>
              <Input id="market-value-debt" type="number" placeholder="2000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-of-equity">Cost of Equity (%)</Label>
              <Input id="cost-of-equity" type="number" placeholder="12.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-of-debt">Cost of Debt (%)</Label>
              <Input id="cost-of-debt" type="number" placeholder="6.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-rate">Corporate Tax Rate (%)</Label>
              <Input id="tax-rate" type="number" placeholder="25.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk-free-rate">Risk-Free Rate (%)</Label>
              <Input id="risk-free-rate" type="number" placeholder="4.0" />
            </div>

            <Button className="w-full">
              Calculate WACC
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WACC Analysis</CardTitle>
            <CardDescription>
              Weighted average cost of capital breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">9.8%</div>
                <div className="text-sm text-muted-foreground">Weighted Average Cost of Capital</div>
                <div className="text-xs text-blue-600 mt-1">Discount Rate for Valuation</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Weighted Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Equity</TableCell>
                    <TableCell>71.4%</TableCell>
                    <TableCell>12.0%</TableCell>
                    <TableCell>8.6%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Debt</TableCell>
                    <TableCell>28.6%</TableCell>
                    <TableCell>4.5%</TableCell>
                    <TableCell>1.3%</TableCell>
                  </TableRow>
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableCell className="font-semibold">WACC</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell><Badge className="bg-blue-500">9.8%</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>WACC Applications & Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 WACC Components</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Cost of Equity:</strong> Required return for shareholders</li>
                <li><strong>Cost of Debt:</strong> Interest rate on borrowed funds</li>
                <li><strong>Tax Shield:</strong> Tax savings from interest deductions</li>
                <li><strong>Capital Weights:</strong> Proportion of equity vs debt</li>
                <li><strong>Market Values:</strong> Current market valuation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 WACC Uses</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>DCF Valuation:</strong> Discount rate for cash flows</li>
                <li><strong>Capital Budgeting:</strong> Hurdle rate for projects</li>
                <li><strong>M&A Analysis:</strong> Value creation assessment</li>
                <li><strong>Performance Evaluation:</strong> Return vs cost of capital</li>
                <li><strong>Optimal Capital Structure:</strong> Debt-equity balance</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 WACC Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use market values, not book values, for accurate weights</li>
              <li>• Cost of equity should reflect current market conditions</li>
              <li>• Consider target capital structure for long-term planning</li>
              <li>• WACC varies by industry and company risk profile</li>
              <li>• Regularly update WACC as market conditions change</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
