"use client"

import { useState, useEffect } from "react"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { NewsWidget } from "@/components/news-widget"
import { NewsAlert } from "@/components/news-alert"
import { ApiKeyForm } from "@/components/api-key-form"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { UserProfileWidget } from "@/components/user-profile-widget"

export default function DashboardPage() {
  const [isApiKeyFormOpen, setIsApiKeyFormOpen] = useState(false)
  const [apiConfigured, setApiConfigured] = useState(false)
  const { isDemoMode } = useAuth()

  // Add a state for the API configuration
  const [apiConfig, setApiConfig] = useState<{
    keyId: string
    secretKey: string
    baseUrl: string
    isPaper: boolean
  } | null>(null)

  // Add this state at the beginning of the DashboardPage component:
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    // Check if API keys are configured
    const checkApiConfig = async () => {
      try {
        // If in demo mode, we don't need to check API config
        if (isDemoMode) {
          setApiConfigured(true)
          return
        }

        const response = await fetch("/api/alpaca/status")
        const data = await response.json()
        setApiConfigured(data.configured)
        if (data.config) {
          setApiConfig(data.config)
        }
        if (!data.configured) {
          setIsApiKeyFormOpen(true)
        }
      } catch (error) {
        console.error("Error checking API configuration:", error)
      }
    }

    checkApiConfig()
  }, [isDemoMode])

  // Add this useEffect after the existing useEffect:
  useEffect(() => {
    // Simulate loading time for initial data fetch
    const loadingTimer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1500)

    return () => clearTimeout(loadingTimer)
  }, [])

  const handleApiKeySave = async () => {
    setIsApiKeyFormOpen(false)
    setApiConfigured(true)
  }

  return (
    <div className="container mx-auto p-4">
      {isPageLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Loading Dashboard</h3>
          <p className="text-muted-foreground text-sm">Fetching market data and portfolio information...</p>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {!isDemoMode && (
          <Button variant="outline" size="sm" onClick={() => setIsApiKeyFormOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            API Settings
          </Button>
        )}
      </div>

      {isDemoMode && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Demo Mode Active</AlertTitle>
          <AlertDescription className="text-amber-700">
            You're currently using the platform in demo mode. All data is simulated and no real trades will be executed.
          </AlertDescription>
        </Alert>
      )}

      {!apiConfigured && !isDemoMode ? (
        <div className="text-center p-8 border rounded-lg bg-card">
          <p className="mb-4">Please configure your Alpaca API keys to get started.</p>
          <Button onClick={() => setIsApiKeyFormOpen(true)}>Configure API</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedDashboard apiConfig={apiConfig} />
          </div>
          <div className="space-y-6">
            <UserProfileWidget />
            <NewsWidget limit={5} />
            {/* Add other widgets here */}
          </div>
        </div>
      )}

      {isApiKeyFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <ApiKeyForm
              onSave={handleApiKeySave}
              onCancel={() => setIsApiKeyFormOpen(false)}
              currentConfig={apiConfig}
            />
          </div>
        </div>
      )}

      {/* News alert component for breaking news */}
      <NewsAlert />
    </div>
  )
}

