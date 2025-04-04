"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActivitySquare, Check, XCircle } from "lucide-react"

interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "down"
  latency: number
}

export function ApiStatusView() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "Alpaca Markets", status: "operational", latency: 0 },
    { name: "Yahoo Finance", status: "operational", latency: 0 },
    { name: "CoinGecko", status: "operational", latency: 0 },
    { name: "News Feed", status: "operational", latency: 0 }
  ])

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "operational": return "bg-green-500"
      case "degraded": return "bg-yellow-500"
      case "down": return "bg-red-500"
    }
  }

  const checkStatus = async () => {
    // Implement actual API health checks here
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Status</h2>
        <Badge variant="outline">Auto-refreshing</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {service.name}
              </CardTitle>
              <div className={`h-2 w-2 rounded-full ${getStatusColor(service.status)}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {service.latency}ms
              </div>
              <p className="text-xs text-muted-foreground">
                Last checked 1min ago
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
