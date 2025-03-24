import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, TrendingUp, TrendingDown, Percent } from "lucide-react"

const mockAlerts = [
  {
    id: 1,
    symbol: "BTC/USD",
    type: "Price Above",
    value: 45000,
    created: "2024-01-15",
    active: true,
    triggers: 0,
  },
  {
    id: 2,
    symbol: "ETH/USD",
    type: "Price Below",
    value: 2200,
    created: "2024-01-14",
    active: true,
    triggers: 2,
  },
  {
    id: 3,
    symbol: "BTC/USD",
    type: "Percent Change",
    value: 5,
    created: "2024-01-13",
    active: false,
    triggers: 3,
  },
]

interface PriceAlertsTabProps {
  onSelectSignal: (signal: any) => void
}

export function PriceAlertsTab({ onSelectSignal }: PriceAlertsTabProps) {
  const [alerts, setAlerts] = useState(mockAlerts)

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "Price Above": return <TrendingUp className="h-4 w-4 text-green-500" />
      case "Price Below": return <TrendingDown className="h-4 w-4 text-red-500" />
      case "Percent Change": return <Percent className="h-4 w-4 text-blue-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Active Price Alerts</h3>
        <Button>Create Alert</Button>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id} onClick={() => onSelectSignal(alert)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <CardTitle className="text-base font-medium">
                    {alert.symbol}
                  </CardTitle>
                </div>
                <Switch 
                  checked={alert.active}
                  onCheckedChange={() => toggleAlert(alert.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2">{alert.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Value:</span>
                  <span className="ml-2">
                    {alert.type === "Percent Change" ? `${alert.value}%` : `$${alert.value}`}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2">{alert.created}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Triggers:</span>
                  <Badge variant="outline" className="ml-2">{alert.triggers}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
