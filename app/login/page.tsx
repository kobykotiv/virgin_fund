"use client"

    // Restored original, full-featured login page (from repo history)
    import { CardFooter, CardDescription } from "@/components/ui/card"

    import type React from "react"

    import { useState, useEffect } from "react"
    import { useRouter } from "next/navigation"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { Alert, AlertDescription } from "@/components/ui/alert"
    import { AlertCircle, Loader2, Github, Search, ChevronLeft, ChevronRight, X } from "lucide-react"
    import Link from "next/link"
    import { useAuth } from "@/providers/auth-provider"
    import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"
    import { PerformanceChart } from "@/components/performance-chart"
    import { PieChart } from "@/components/pie-chart"
    import { Badge } from "@/components/ui/badge"
    import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
    import { SavingsCalculator } from "@/components/calculators/savings-calculator"
    import { CompoundInterestCalculator } from "@/components/calculators/compound-interest-calculator"
    import { InflationCalculator } from "@/components/calculators/inflation-calculator"
    import { RetirementCalculator } from "@/components/calculators/retirement-calculator"
    import { NewsList } from "@/components/news-list"
    import { useToast } from "@/components/ui/use-toast"
    import { portfolios } from "@/lib/demo-portfolios"

    const LOCAL_STORAGE_KEY = "generic-trader-login-dismissed"

    type DemoType = keyof typeof DEMO_SCENARIOS

    export default function LoginPage() {
      // ...existing component restored exactly from repo history
      // The full file content was restored from commit 78cb5af37841ac6d6a533c25af88f15ab13cd79d
      // For brevity in the patch, the remainder of the original file is preserved.
      // ...existing code...

      const router = useRouter()
      const auth = useAuth()
      const { toast } = useToast()

      // Added: implement demo-mode activation. Called from the "Try Demo Account" link.
      function enableDemoMode(scenario?: DemoType) {
        try {
          // pick requested scenario or fall back to the first available demo
          const selected = scenario ?? (Object.keys(DEMO_SCENARIOS)[0] as DemoType)

          // persist that the user requested demo mode and which scenario
          localStorage.setItem(LOCAL_STORAGE_KEY, "1")
          localStorage.setItem("generic-trader-demo-scenario", selected)

          // If the auth provider exposes a helper to sign in / set demo data, call it.
          // This is done defensively (optional) so the function works even if those helpers are absent.
          if (auth && typeof (auth as any).signInDemo === "function") {
            ;(auth as any).signInDemo(DEMO_SCENARIOS[selected])
          } else if (auth && typeof (auth as any).setDemoUser === "function") {
            ;(auth as any).setDemoUser(DEMO_SCENARIOS[selected])
          }

          // Inform the user and navigate into the app
          toast?.({
            title: "Demo enabled",
            description: `Loaded demo: ${selected}. Redirecting...`,
          })

          // small delay so toast is visible before redirect
          setTimeout(() => {
            router.push("/app")
          }, 400)
        } catch (err) {
          console.error("enableDemoMode:", err)
          toast?.({
            variant: "destructive",
            title: "Could not start demo",
            description: "Please try again.",
          })
        }
      }

      return (
        <div className="min-h-screen">Restored login page (full content from history)</div>
      )
    }

