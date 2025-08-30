"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CurrencyConverterCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Currency Converter</h1>
        <p className="text-muted-foreground">
          Convert between currencies with real-time exchange rates and historical data
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Currency Conversion</CardTitle>
            <CardDescription>
              Convert amounts between different currencies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="1000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from-currency">From Currency</Label>
              <select className="w-full p-2 border rounded-md" id="from-currency">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-currency">To Currency</Label>
              <select className="w-full p-2 border rounded-md" id="to-currency">
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Exchange Rate Date</Label>
              <Input id="date" type="date" />
            </div>

            <Button className="w-full">
              Convert Currency
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>
              Converted amount and exchange rate details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold">$1,000 USD</div>
                <div className="text-4xl font-bold text-primary my-2">€850.50</div>
                <div className="text-sm text-muted-foreground">EUR</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Detail</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Exchange Rate</TableCell>
                    <TableCell>0.8505 USD/EUR</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Inverse Rate</TableCell>
                    <TableCell>1.1757 EUR/USD</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Last Updated</TableCell>
                    <TableCell>2024-01-15 14:30 UTC</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Spread</TableCell>
                    <TableCell><Badge variant="outline">0.05%</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Popular Currency Pairs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency Pair</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">EUR/USD</TableCell>
                <TableCell>1.0850</TableCell>
                <TableCell className="text-green-600">+0.25%</TableCell>
                <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">GBP/USD</TableCell>
                <TableCell>1.2750</TableCell>
                <TableCell className="text-red-600">-0.15%</TableCell>
                <TableCell><Badge className="bg-yellow-500">Neutral</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">USD/JPY</TableCell>
                <TableCell>148.50</TableCell>
                <TableCell className="text-green-600">+0.35%</TableCell>
                <TableCell><Badge className="bg-green-500">Strong</Badge></TableCell>
              </Row>
              <TableRow>
                <TableCell className="font-semibold">USD/CAD</TableCell>
                <TableCell>1.3450</TableCell>
                <TableCell className="text-red-600">-0.20%</TableCell>
                <TableCell><Badge className="bg-red-500">Weak</Badge></TableCell>
              </Row>
            </TableBody>
          </Table>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Currency Trading Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Major pairs (EUR/USD, GBP/USD, USD/JPY) offer best liquidity</li>
              <li>• Trade during active market hours for tighter spreads</li>
              <li>• Consider economic events and central bank decisions</li>
              <li>• Use stop-loss orders to manage risk</li>
              <li>• Monitor correlation between currency pairs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
