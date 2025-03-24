import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Play, Pause, Settings, XCircle } from "lucide-react"

interface Strategy {
  id: string
  name: string
  status: "active" | "paused" | "error"
  performance: {
    totalReturn: number
    winRate: number
    trades: number
  }
}

export function StrategiesDashboard() {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const router = useRouter()

  const toggleStrategy = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active"
    await fetch(`/api/strategies/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
    // Update local state
    setStrategies(prev => 
      prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {strategies.map(strategy => (
        <Card key={strategy.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">{strategy.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toggleStrategy(strategy.id, strategy.status)}
              >
                {strategy.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push(`/dashboard/strategies/edit/${strategy.id}`)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Return</span>
                <span className={strategy.performance.totalReturn >= 0 ? "text-green-500" : "text-red-500"}>
                  {strategy.performance.totalReturn}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate</span>
                <span>{strategy.performance.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Trades</span>
                <span>{strategy.performance.trades}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
