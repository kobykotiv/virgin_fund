"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PivotPointsCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Pivot Points Calculator</h1>
        <p className="text-muted-foreground">
          Calculate key support and resistance levels using pivot point analysis
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Price Data Input</CardTitle>
            <CardDescription>
              Enter the previous day's high, low, and close prices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="high">Previous Day High ($)</Label>
              <Input id="high" type="number" placeholder="105.50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="low">Previous Day Low ($)</Label>
              <Input id="low" type="number" placeholder="102.25" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="close">Previous Day Close ($)</Label>
              <Input id="close" type="number" placeholder="104.75" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Calculation Method</Label>
              <select className="w-full p-2 border rounded-md" id="method">
                <option value="standard">Standard Pivot Points</option>
                <option value="fibonacci">Fibonacci Pivot Points</option>
                <option value="woodie">Woodie Pivot Points</option>
                <option value="camarilla">Camarilla Pivot Points</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Pivot Points
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pivot Levels</CardTitle>
            <CardDescription>
              Calculated support and resistance levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">R2</TableCell>
                  <TableCell>$108.25</TableCell>
                  <TableCell><Badge className="bg-red-500">Resistance 2</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">R1</TableCell>
                  <TableCell>$106.50</TableCell>
                  <TableCell><Badge className="bg-red-400">Resistance 1</Badge></TableCell>
                </TableRow>
                <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                  <TableCell className="font-semibold">PP</TableCell>
                  <TableCell>$104.75</TableCell>
                  <TableCell><Badge variant="secondary">Pivot Point</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">S1</TableCell>
                  <TableCell>$103.00</TableCell>
                  <TableCell><Badge className="bg-green-400">Support 1</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">S2</TableCell>
                  <TableCell>$101.25</TableCell>
                  <TableCell><Badge className="bg-green-500">Support 2</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Pivot Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📈 Bullish Signals</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Price above PP indicates bullish bias</li>
                <li>• Breaking above R1 suggests strong momentum</li>
                <li>• Use S1 and S2 as potential buying levels</li>
                <li>• R2 becomes the next major target</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">📉 Bearish Signals</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Price below PP indicates bearish bias</li>
                <li>• Breaking below S1 suggests strong momentum</li>
                <li>• Use R1 and R2 as potential selling levels</li>
                <li>• S2 becomes the next major target</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Trading Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Pivot points work best in trending markets</li>
              <li>• Combine with other indicators for better accuracy</li>
              <li>• Use volume confirmation when breaking pivot levels</li>
              <li>• Reassess levels at the start of each trading day</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
