"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function IRRCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">IRR Calculator</h1>
        <p className="text-muted-foreground">
          Calculate Internal Rate of Return for investment projects and cash flows
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Input</CardTitle>
            <CardDescription>
              Enter initial investment and periodic cash flows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initial-investment">Initial Investment ($)</Label>
              <Input id="initial-investment" type="number" placeholder="-100000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year1">Year 1 Cash Flow ($)</Label>
              <Input id="year1" type="number" placeholder="30000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year2">Year 2 Cash Flow ($)</Label>
              <Input id="year2" type="number" placeholder="35000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year3">Year 3 Cash Flow ($)</Label>
              <Input id="year3" type="number" placeholder="40000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year4">Year 4 Cash Flow ($)</Label>
              <Input id="year4" type="number" placeholder="45000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year5">Year 5 Cash Flow ($)</Label>
              <Input id="year5" type="number" placeholder="50000" />
            </div>

            <Button className="w-full">
              Calculate IRR
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IRR Analysis</CardTitle>
            <CardDescription>
              Internal rate of return and investment metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">18.5%</div>
                <div className="text-sm text-muted-foreground">Internal Rate of Return</div>
                <div className="text-xs text-green-600 mt-1">Excellent Investment</div>
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
                    <TableCell className="font-semibold">IRR</TableCell>
                    <TableCell>18.5%</TableCell>
                    <TableCell><Badge className="bg-green-500">Attractive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">NPV at 10%</TableCell>
                    <TableCell>$25,430</TableCell>
                    <TableCell><Badge className="bg-green-500">Positive</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Payback Period</TableCell>
                    <TableCell>3.2 years</TableCell>
                    <TableCell><Badge className="bg-blue-500">Reasonable</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Total Return</TableCell>
                    <TableCell>$100,000</TableCell>
                    <TableCell><Badge className="bg-green-500">Profit</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Profitability Index</TableCell>
                    <TableCell>1.25</TableCell>
                    <TableCell><Badge className="bg-green-500">Good</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>IRR Interpretation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 IRR Performance Scale</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Excellent (20%+):</strong> Outstanding returns</li>
                <li><strong>Very Good (15-20%):</strong> Strong performance</li>
                <li><strong>Good (10-15%):</strong> Solid investment</li>
                <li><strong>Average (5-10%):</strong> Acceptable returns</li>
                <li><strong>Poor (&lt;5%):</strong> Questionable investment</li>
                <li><strong>Negative:</strong> Loss-making project</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 IRR Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Capital Budgeting:</strong> Project evaluation</li>
                <li><strong>Private Equity:</strong> Fund performance</li>
                <li><strong>Real Estate:</strong> Property investments</li>
                <li><strong>Venture Capital:</strong> Startup valuations</li>
                <li><strong>Portfolio Analysis:</strong> Return comparison</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 IRR Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• IRR assumes reinvestment at the IRR rate (often unrealistic)</li>
              <li>• Use NPV for absolute profitability assessment</li>
              <li>• Compare IRR to your required rate of return</li>
              <li>• Be cautious with unconventional cash flows</li>
              <li>• Consider multiple IRR scenarios for sensitivity analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
