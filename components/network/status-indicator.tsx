"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff, Database, Upload, Loader2, AlertTriangle } from "lucide-react"
import { SyncManager } from "@/lib/sync-manager"
import { WebSocketQueue } from "@/lib/ws-queue"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )
  const [syncStatus, setSyncStatus] = useState<string>("idle")
  const [queueLength, setQueueLength] = useState(0)
  const [wsQueueLength, setWsQueueLength] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [latency, setLatency] = useState<number | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Sync status updates
    const syncManager = SyncManager.getInstance()
    const handleSyncStatusChange = (status: string) => {
      setSyncStatus(status)
      setQueueLength(syncManager.getQueueLength())
    }
    syncManager.addListener(handleSyncStatusChange)
    setQueueLength(syncManager.getQueueLength())

    // WebSocket queue updates
    try {
      const wsQueue = WebSocketQueue.getInstance()
      const updateWsQueue = () => {
        setWsQueueLength(wsQueue.getPendingMessagesCount())
      }
      
      // Set up periodic check
      const wsInterval = setInterval(updateWsQueue, 5000)
      updateWsQueue()

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
        syncManager.removeListener(handleSyncStatusChange)
        clearInterval(wsInterval)
      }
    } catch (error) {
      // WebSocketQueue might not be initialized yet
      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
        syncManager.removeListener(handleSyncStatusChange)
      }
    }
  }, [])

  const checkLatency = async () => {
    if (isChecking) return
    
    setIsChecking(true)
    setLatency(null)
    
    try {
      const start = performance.now()
      const response = await fetch('/api/ping')
      if (response.ok) {
        const end = performance.now()
        setLatency(Math.round(end - start))
      } else {
        setLatency(-1) // Error
      }
    } catch (error) {
      setLatency(-1) // Error
    } finally {
      setIsChecking(false)
    }
  }

  // Check latency automatically when coming online
  useEffect(() => {
    if (isOnline) {
      checkLatency()
    }
  }, [isOnline])

  const getStatusColor = () => {
    if (!isOnline) return "text-red-500"
    if (syncStatus === 'error' || queueLength > 10 || wsQueueLength > 10) return "text-amber-500"
    return "text-green-500"
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowDetails(true)}
              className={`flex items-center gap-2 p-2 rounded-full ${getStatusColor()}`}
            >
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {(queueLength > 0 || wsQueueLength > 0) && (
                <Badge variant="outline" className="h-4 min-w-4 px-1 text-xs">
                  {queueLength + wsQueueLength}
                </Badge>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-xs">
              <p>Network: {isOnline ? "Online" : "Offline"}</p>
              {queueLength > 0 && <p>Sync Queue: {queueLength} items</p>}
              {wsQueueLength > 0 && <p>WebSocket Queue: {wsQueueLength} messages</p>}
              {latency !== null && <p>Latency: {latency === -1 ? "Error" : `${latency}ms`}</p>}
              <p className="text-muted-foreground mt-1">Click for details</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Network Status</DialogTitle>
            <DialogDescription>
              Realtime connection and synchronization status
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <span>{isOnline ? "Online" : "Offline"}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkLatency}
                    disabled={isChecking || !isOnline}
                  >
                    {isChecking ? <Loader2 className="h-3 w-3 animate-spin" /> : "Test"}
                  </Button>
                </div>
                {latency !== null && (
                  <div className="mt-2 text-sm">
                    Latency: {latency === -1 ? (
                      <span className="text-red-500">Connection Error</span>
                    ) : (
                      <span className={latency > 300 ? "text-amber-500" : "text-green-500"}>
                        {latency}ms
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Data Synchronization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Sync Status</span>
                    </div>
                    <Badge variant={syncStatus === 'syncing' ? 'outline' : syncStatus === 'error' ? 'destructive' : 'default'}>
                      {syncStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>Pending Uploads</span>
                    </div>
                    <Badge variant={queueLength > 0 ? 'secondary' : 'outline'}>
                      {queueLength} items
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>WebSocket Queue</span>
                    </div>
                    <Badge variant={wsQueueLength > 0 ? 'secondary' : 'outline'}>
                      {wsQueueLength} messages
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    SyncManager.getInstance().processQueue()
                    try {
                      WebSocketQueue.getInstance().processQueue()
                    } catch (error) {
                      // WebSocketQueue might not be initialized
                    }
                  }}
                  disabled={!isOnline || (queueLength === 0 && wsQueueLength === 0)}
                >
                  Force Sync Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
