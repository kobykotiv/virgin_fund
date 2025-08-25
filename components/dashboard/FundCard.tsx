"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Fund } from "@/lib/mockApi"

export default function FundCard({ fund, onOpen }: { fund: Fund; onOpen?: (ticker: string) => void }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{fund.ticker} — {fund.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{fund.sectorTags.join(' • ')}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold">${fund.price.toFixed(2)}</div>
            <div className={`text-sm ${fund.changePct >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fund.changePct >= 0 ? `+${fund.changePct}%` : `${fund.changePct}%`}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">AUM: ${Number(fund.aum).toLocaleString()}</div>
        <div className="text-sm">Expense ratio: {fund.expenseRatio}%</div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" onClick={() => onOpen?.(fund.ticker)}>View options</Button>
          <Button size="sm">Add to watchlist</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
