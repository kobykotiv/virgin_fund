"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react"
import type { Signal } from "@/types/bot"

interface SignalViewerProps {
  botId?: string
  asset?: string
  limit?: number
}

export function SignalViewer({ botId, asset, limit = 10 }: SignalViewerProps) {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchSignals()
  }, [botId, asset, limit])
  
  const fetchSignals = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let url = '/api/signals?'
      
      if (botId) url += `botId=${botId}&`
      if (asset) url += `asset=${asset}&`
      if (limit) url += `limit=${limit}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch signals')
      }
      
      const data = await response.json()
      setSignals(data)
    } catch (error: any) {
      console.error('Error fetching signals:', error)
      setError(error.message || 'Failed to load signals')
    } finally {
      setLoading(false)
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }
  
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge className="bg-green-500">High</Badge>
    if (confidence >= 0.5) return <Badge className="bg-amber-500">Medium</Badge>
    return <Badge className="bg-red-500">Low</Badge>
  }
  
  const getSignalTypeBadge = (type: string) => {
    if (type === 'entry') {
      return (
        <Badge className="bg-green-500 text-white flex items-center gap-1">
          <ArrowUp className="h-3 w-3" />
          Entry
        </Badge>
      )
    }
    
    if (type === 'exit') {
      return (
        <Badge className="bg-red-500 text-white flex items-center gap-1">
          <ArrowDown className="h-3 w-3" />
          Exit
        </Badge>
      )
    }
    
    return <Badge>{type}</Badge>
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Signals</CardTitle>
          <CardDescription>Recent trading signals</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Signals</CardTitle>
          <CardDescription>Recent trading signals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[100px] text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchSignals} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Trading Signals</CardTitle>
          <CardDescription>Recent trading signals {botId ? 'for this bot' : ''}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSignals}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[100px]">
            <p className="text-muted-foreground">No trading signals yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signals.map((signal, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap">{formatDate(signal.timestamp)}</TableCell>
                    <TableCell className="font-medium">{signal.asset}</TableCell>
                    <TableCell>{getSignalTypeBadge(signal.type)}</TableCell>
                    <TableCell>{formatPrice(signal.price)}</TableCell>
                    <TableCell>{getConfidenceBadge(signal.confidence || 0)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{signal.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
