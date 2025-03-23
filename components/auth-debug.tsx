"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"

/**
 * A debug component to help diagnose authentication issues
 * Only visible in development mode
 */
export function AuthDebug() {
  const { user, isAuthenticated, isDemoMode } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [localStorageItems, setLocalStorageItems] = useState<Record<string, string>>({})

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const refreshLocalStorage = () => {
    const items: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        items[key] = localStorage.getItem(key) || ""
      }
    }
    setLocalStorageItems(items)
  }

  const clearLocalStorage = () => {
    localStorage.clear()
    refreshLocalStorage()
    window.location.reload()
  }

  if (!isVisible) {
    return (
      <Button
        className="fixed bottom-4 right-4 z-50 opacity-30 hover:opacity-100"
        variant="outline"
        size="sm"
        onClick={() => {
          setIsVisible(true)
          refreshLocalStorage()
        }}
      >
        Debug Auth
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Auth Debug</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <p>
            <strong>Auth State:</strong>
          </p>
          <p>isAuthenticated: {isAuthenticated ? "true" : "false"}</p>
          <p>isDemoMode: {isDemoMode ? "true" : "false"}</p>
        </div>

        <div>
          <p>
            <strong>User:</strong>
          </p>
          <pre className="bg-muted p-2 rounded text-[10px] overflow-auto max-h-20">{JSON.stringify(user, null, 2)}</pre>
        </div>

        <div>
          <p>
            <strong>LocalStorage:</strong>
          </p>
          <div className="bg-muted p-2 rounded overflow-auto max-h-40">
            {Object.entries(localStorageItems).map(([key, value]) => (
              <div key={key} className="mb-1">
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" onClick={refreshLocalStorage}>
            Refresh
          </Button>
          <Button size="sm" variant="destructive" onClick={clearLocalStorage}>
            Clear & Reload
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

