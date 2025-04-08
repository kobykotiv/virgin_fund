"use client"

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"
import { DatabaseService } from '@/lib/services/database'

export function ConnectionStatus() {
  const [isDemo, setIsDemo] = useState(false)
  const [isIgnored, setIsIgnored] = useState(false)
  
  useEffect(() => {
    try {
      const db = DatabaseService.getInstance()
      setIsDemo(db.isUsingDemo())
      setIsIgnored(db.getConnectionMode() === 'ignore')
    } catch (error) {
      console.error("Error accessing database service:", error)
      setIsDemo(true)
    }
  }, [])

  const handleReconnect = async () => {
    try {
      const db = DatabaseService.getInstance()
      if (db.getConnectionMode() === 'ignore') {
        // Can't reconnect in ignore mode
        return;
      }
      const connected = await db.reconnect()
      setIsDemo(!connected)
    } catch (error) {
      console.error("Error reconnecting:", error)
    }
  }

  if (!isDemo && !isIgnored) return null

  if (isIgnored) {
    return (
      <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
        <WifiOff className="h-4 w-4 mr-2" />
        <AlertTitle>Database Connections Disabled</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>All database operations are disabled and using demo data.</span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="warning" className="mb-4">
      <AlertTitle>Running in Demo Mode</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Using demo data due to connection issues.</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleReconnect}
        >
          Try Reconnect
        </Button>
      </AlertDescription>
    </Alert>
  )
}
