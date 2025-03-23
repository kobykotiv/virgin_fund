"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import StrategiesTab from "@/components/dashboard/strategies-tab"
import PerformanceTab from "@/components/dashboard/performance-tab"
import AnalyticsTab from "@/components/dashboard/analytics-tab"
import SettingsTab from "@/components/dashboard/settings-tab"
import CustomSignalsTab from "@/components/dashboard/custom-signals-tab"
import CalculatorsTab from "@/components/dashboard/calculators-tab"

export default function DashboardPage() {
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/login")
      return
    }

    // Simulate API configuration check
    const checkApiConfiguration = async () => {
      try {
        // In a real app, this would be an actual API call
        // For demo purposes, we'll simulate a check
        if (user.email === "demo@example.com") {
          // Demo account has API configured
          setApiConfigured(true)
        } else {
          // Check if API is configured for real users
          // This is a placeholder for your actual API check
          const response = await fetch("/api/check-configuration")
          const data = await response.json()
          setApiConfigured(data.configured)
        }
      } catch (error) {
        console.error("Error checking API configuration:", error)
        setApiConfigured(false)
      }
    }

    checkApiConfiguration()
  }, [user, router])

  if (apiConfigured === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Trading Bot Dashboard</h1>

      {!apiConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Not Configured</AlertTitle>
          <AlertDescription>
            Your trading API is not configured. Please go to Settings to set up your API keys.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-7 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="custom-signals">Custom Signals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="calculators">Calculators</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DashboardOverview apiConfigured={apiConfigured} />
        </TabsContent>

        <TabsContent value="strategies">{!apiConfigured ? <ApiNotConfiguredAlert /> : <StrategiesTab />}</TabsContent>

        <TabsContent value="custom-signals">
          {!apiConfigured ? <ApiNotConfiguredAlert /> : <CustomSignalsTab />}
        </TabsContent>

        <TabsContent value="performance">{!apiConfigured ? <ApiNotConfiguredAlert /> : <PerformanceTab />}</TabsContent>

        <TabsContent value="analytics">{!apiConfigured ? <ApiNotConfiguredAlert /> : <AnalyticsTab />}</TabsContent>

        <TabsContent value="calculators">
          <CalculatorsTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab apiConfigured={apiConfigured} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApiNotConfiguredAlert() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Not Configured</CardTitle>
        <CardDescription>You need to configure your trading API before using this feature.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Please go to the Settings tab to set up your API keys and preferences.</p>
      </CardContent>
    </Card>
  )
}

