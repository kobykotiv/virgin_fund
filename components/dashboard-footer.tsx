"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Signal, 
  ServerOff, 
  Activity, 
  CheckCircle2,
  Globe
} from "lucide-react"

export function DashboardFooter() {
  const [marketStatus, setMarketStatus] = useState<"open" | "closed" | "unknown">("unknown")
  const [serverStatus, setServerStatus] = useState<"connected" | "disconnected" | "pending">("pending")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [apiMode, setApiMode] = useState<"demo" | "paper" | "live" | "disconnected">("disconnected")

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Check market status and server connection
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // For demo purposes, we'll simulate random state updates
        // In production, this would make actual API calls
        
        // Simulate market open during normal trading hours
        const now = new Date()
        const hours = now.getHours()
        const isWeekday = now.getDay() > 0 && now.getDay() < 6
        const isMarketHours = hours >= 9 && hours < 16

        setMarketStatus(isWeekday && isMarketHours ? "open" : "closed")
        setServerStatus(Math.random() > 0.1 ? "connected" : "disconnected")
        setApiMode(localStorage.getItem('is_demo_mode') === 'true' 
          ? "demo" 
          : localStorage.getItem('alpaca_is_paper') === 'true'
            ? "paper"
            : localStorage.getItem('alpaca_api_key') 
              ? "live" 
              : "disconnected")
        
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (error) {
        console.error("Failed to check status:", error)
        setMarketStatus("unknown")
        setServerStatus("disconnected")
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="border-t py-2 px-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{currentTime}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Signal className="h-3 w-3" />
            <span>
              Market: {" "}
              {marketStatus === "open" ? (
                <Badge className="outline bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                  Open
                </Badge>
              ) : marketStatus === "closed" ? (
                <Badge className="outline bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900">
                  Closed
                </Badge>
              ) : (
                <Badge className="outline bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900">
                  Unknown
                </Badge>
              )}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Globe className="h-3 w-3" />
            <span>
              {apiMode === "demo" ? (
                <Badge className="outline bg-purple-100 text-purple-800">Demo Mode</Badge>
              ) : apiMode === "paper" ? (
                <Badge className="outline bg-blue-100 text-blue-800">Paper Trading</Badge>
              ) : apiMode === "live" ? (
                <Badge className="outline bg-red-100 text-red-800">Live Trading</Badge>
              ) : (
                <Badge className="outline">Disconnected</Badge>
              )}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {serverStatus === "connected" ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : serverStatus === "disconnected" ? (
              <ServerOff className="h-3 w-3 text-red-500" />
            ) : (
              <Activity className="h-3 w-3 text-amber-500" />
            )}
            <span>
              {serverStatus === "connected" 
                ? "Server Connected" 
                : serverStatus === "disconnected" 
                  ? "Server Disconnected" 
                  : "Connecting..."}
            </span>
          </div>
          
          <div>
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
