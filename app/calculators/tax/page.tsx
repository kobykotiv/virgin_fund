"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TaxCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tax Calculator</h1>
        <p className="text-muted-foreground">
          Calculate capital gains tax, income tax, and investment tax implications
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tax Calculation Input</CardTitle>
            <CardDescription>
              Enter investment details for tax calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purchase-price">Purchase Price ($)</Label>
              <Input id="purchase-price" type="number" placeholder="10000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale-price">Sale Price ($)</Label>
              <Input id="sale-price" type="number" placeholder="15000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holding-period">Holding Period (years)</Label>
              <Input id="holding-period" type="number" placeholder="1.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-bracket">Tax Bracket (%)</Label>
              <select className="w-full p-2 border rounded-md" id="tax-bracket">
                <option value="10">10% (Lowest)</option>
                <option value="12">12%</option>
                <option value="22">22%</option>
                <option value="24">24%</option>
                <option value="32">32%</option>
                <option value="35">35%</option>
                <option value="37">37% (Highest)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state-tax">State Tax Rate (%)</Label>
              <Input id="state-tax" type="number" placeholder="5.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment-type">Investment Type</Label>
              <select className="w-full p-2 border rounded-md" id="investment-type">
                <option value="stocks">Stocks</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="real-estate">Real Estate</option>
                <option value="retirement">Retirement Account</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Taxes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Calculation Results</CardTitle>
            <CardDescription>
              Breakdown of taxes owed and net proceeds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$3,750</div>
                <div className="text-sm text-muted-foreground">Capital Gain</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Federal Capital Gains</TableCell>
                    <TableCell>$750</TableCell>
                    <TableCell><Badge variant="outline">15%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">State Capital Gains</TableCell>
                    <TableCell>$188</TableCell>
                    <TableCell><Badge variant="outline">5%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Net Investment Income</TableCell>
                    <TableCell>$0</TableCell>
                    <TableCell><Badge variant="outline">3.8%</Badge></TableCell>
                  </TableRow>
                  <TableRow className="bg-red-50 dark:bg-red-950/20">
                    <TableCell className="font-semibold">Total Tax Owed</TableCell>
                    <TableCell>$938</TableCell>
                    <TableCell><Badge className="bg-red-500">25%</Badge></TableCell>
                  </TableRow>
                  <TableRow className="bg-green-50 dark:bg-green-950/20">
                    <TableCell className="font-semibold">Net Proceeds</TableCell>
                    <TableCell>$13,062</TableCell>
                    <TableCell><Badge className="bg-green-500">87.1%</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tax Optimization Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Tax Rates by Holding Period</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Short-term (&lt;1 year):</strong> Ordinary income rates (up to 37%)</li>
                <li><strong>Long-term (1+ years):</strong> 0%, 15%, or 20% capital gains</li>
                <li><strong>Long-term (2+ years crypto):</strong> May qualify for lower rates</li>
                <li><strong>Qualified dividends:</strong> Same rates as long-term capital gains</li>
                <li><strong>Net Investment Income:</strong> Additional 3.8% for high earners</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Tax-Saving Strategies</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Tax-loss harvesting:</strong> Offset gains with losses</li>
                <li><strong>Hold long-term:</strong> Benefit from lower capital gains rates</li>
                <li><strong>Retirement accounts:</strong> Defer taxes on gains</li>
                <li><strong>Tax-efficient funds:</strong> Minimize taxable distributions</li>
                <li><strong>Charitable giving:</strong> Reduce taxable income</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Important Tax Considerations</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Consult a tax professional for personalized advice</li>
              <li>• Tax laws change frequently - stay updated</li>
              <li>• Keep detailed records of all transactions</li>
              <li>• Consider wash sale rules when tax-loss harvesting</li>
              <li>• Report all investment income on your tax return</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
