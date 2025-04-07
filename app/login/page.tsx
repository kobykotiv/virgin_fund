"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, DollarSign, Github, Signal, Grid, X, LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { CookieBanner } from "@/components/cookie-banner"
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"
import { PerformanceChart } from "@/components/performance-chart"
import { PieChart } from "@/components/pie-chart"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart2Icon,
  Shield,
  Rocket,
  Bitcoin,
  Building,
  Globe,
  Sprout,
  Cpu,
  Repeat,
  LineChart,
  Microscope,
  Building2,
  Store,
  Droplet,
  Lightbulb,
  Landmark,
  Wallet,
  Layers,
  DiamondPlusIcon as Gold,
  Scale,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// First, add imports for the calculator components at the top of the file, after the existing imports
import { SavingsCalculator } from "@/components/calculators/savings-calculator"
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest-calculator"
import { InflationCalculator } from "@/components/calculators/inflation-calculator"
import { RetirementCalculator } from "@/components/calculators/retirement-calculator"
import { NewsList } from "@/components/news-list"
import { useToast } from "@/components/ui/use-toast"
import { portfolios } from "@/lib/demo-portfolios"

// Add PortfolioDemoCard import
import { PortfolioDemoCard } from "@/components/portfolio-demo-card"
import { PortfolioPreviewModal } from "@/components/portfolio-preview-modal"

const LOCAL_STORAGE_KEY = "generic-trader-login-dismissed"

type DemoType = keyof typeof DEMO_SCENARIOS;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    | "login"
    | "signup"
    | "demos"
    | "calculators"
    // | "news"
    // | "education"
  >("login")
  const [isVisible, setIsVisible] = useState(true)
  const [activeDemo, setActiveDemo] = useState<DemoType | null>(null)
  const [demoAnimation, setDemoAnimation] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showDemoInfo, setShowDemoInfo] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16
  const { toast } = useToast()

  // Portfolio data - include all portfolios from the import
  const displayPortfolios = portfolios

  // Add a state to track the currently previewed portfolio
  const [previewPortfolio, setPreviewPortfolio] = useState<string | null>(null)

  // Filter portfolios based on active filter and search query
  const filteredPortfolios = displayPortfolios.filter((portfolio) => {
    // Filter by category
    if (activeFilter !== "all") {
      const filterMap: Record<string, { 
        tags?: string[], 
        risk?: string[],
        sentiment?: string[],
        fearGreedRange?: [number, number]
      }> = {
        stocks: { tags: ["Stocks", "ETFs"] },
        crypto: { tags: ["Crypto", "Blockchain"] },
        income: { tags: ["Income", "Dividends", "Yield"] },
        global: { tags: ["Global", "International"] },
        "low-risk": { risk: ["Low"] },
        "high-risk": { risk: ["High"] },
        "bullish": { sentiment: ["bullish"] },
        "bearish": { sentiment: ["bearish"] },
        "extreme-fear": { fearGreedRange: [0, 25] },
        "extreme-greed": { fearGreedRange: [75, 100] },
      }

      const filterCriteria = filterMap[activeFilter]
      if (!filterCriteria) return false

      // Check if portfolio matches any of the filter criteria
      if (filterCriteria.tags) {
        const matchesTags = filterCriteria.tags.some(tag => 
          portfolio.tags.some(portfolioTag => 
            portfolioTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
        if (matchesTags) return true
      }
      
      if (filterCriteria.risk) {
        const matchesRisk = filterCriteria.risk.some(riskLevel => 
          portfolio.risk.includes(riskLevel)
        )
        if (matchesRisk) return true
      }
      
      if (filterCriteria.sentiment) {
        const matchesSentiment = filterCriteria.sentiment.includes(portfolio.sentiment || '')
        if (matchesSentiment) return true
      }
      
      if (filterCriteria.fearGreedRange && portfolio.fearGreedIndex) {
        const [min, max] = filterCriteria.fearGreedRange
        const matchesFearGreed = portfolio.fearGreedIndex >= min && portfolio.fearGreedIndex <= max
        if (matchesFearGreed) return true
      }
      
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        portfolio.name.toLowerCase().includes(query) ||
        portfolio.focus.toLowerCase().includes(query) ||
        portfolio.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredPortfolios.length / itemsPerPage)

  // Helper function to get badge variant based on risk
  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case "Low":
        return "outline"
      case "Moderate":
        return "secondary"
      case "High":
        return "destructive"
      default:
        return "outline"
    }
  }
  const router = useRouter()
  const { login, enableDemoMode } = useAuth()

  // Fix the login screen auto-dismissal issue by modifying the useEffect hook
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      try {
        // Check if user is already logged in
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
        
        // Remove automatic redirection - let user stay on login page
        // The previous code was redirecting automatically to home
        // Remove: router.push("/")
      } catch (error) {
        console.error("Error checking authentication state:", error)
      }
    }
  }, [router])

  // Effect for demo animation
  useEffect(() => {
    if (activeDemo && demoAnimation) {
      // Simulate typing email
      setEmail("admin@example.com")
      setPassword("••••••••")

      // Simulate login after credentials are "typed"
      const loginTimer = setTimeout(() => {
        setIsLoading(true)

        // Simulate login process
        setTimeout(() => {
          handleDemoLogin(activeDemo)
        }, 1000)
      }, 1500)

      return () => clearTimeout(loginTimer)
    }
  }, [activeDemo, demoAnimation])

  // Enhanced login function with better error handling
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Check if this is a demo account login
      if (email === "admin@example.com" && password === "admin123") {
        // Use the general demo scenario by default
        await handleDemoLogin("retail")
        return
      }

      await login(email, password)

      // On successful login, mark as dismissed but DON'T redirect automatically
      localStorage.setItem(LOCAL_STORAGE_KEY, "true")
      
      // Remove the automatic redirect
      // Remove: setTimeout(() => { router.push("/") }, 100)
      
      // Instead, show a success message
      setError(null)
      toast({
        title: "Login successful",
        description: "You are now logged in. You can continue exploring or go to your dashboard.",
        action: (
          <Button variant="default" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        )
      })
    } catch (err) {
      console.error("Login error:", err)

      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes("network") || err.message.includes("fetch")) {
          setError("Network error. Please check your internet connection and try again.")
        } else if (err.message.includes("credentials") || err.message.includes("password")) {
          setError("Invalid email or password. Please try again or use the demo credentials.")
        } else {
          setError(err.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Add error handling to the signup function
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirmPassword") as string

      if (!email || !password || !confirmPassword) {
        throw new Error("All fields are required")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // In a real app, this would be an API call to register
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Auto-login after signup
      await login(email, password)

      // On successful signup and login, mark as dismissed but DON'T redirect
      localStorage.setItem(LOCAL_STORAGE_KEY, "true")
      
      // Remove automatic redirect
      // Remove: setTimeout(() => { router.push("/") }, 100)
      
      // Show success message instead
      toast({
        title: "Account created",
        description: "Your account has been created successfully. You can now access your dashboard.",
        action: (
          <Button variant="default" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        )
      })
    } catch (err) {
      console.error("Signup error:", err)

      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes("network") || err.message.includes("fetch")) {
          setError("Network error. Please check your internet connection and try again.")
        } else {
          setError(err.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Improved demo login function with better error handling and feedback
  const handleDemoLogin = async (demoType: DemoType) => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate that the demo type exists
      if (!DEMO_SCENARIOS[demoType]) {
        throw new Error(`Demo scenario "${demoType}" not found. Please try another demo.`)
      }

      // Store the demo type in localStorage for the dashboard to use
      localStorage.setItem("demo-scenario", demoType)

      // Create a user object with demo info
      const user = {
        email: "admin@example.com",
        name: "Demo User",
        image: "/placeholder.svg?height=128&width=128",
        isDemoAccount: true,
        demoScenario: demoType,
      }

      // Save authentication state
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("demoMode", "true")

      // Mark login popup as dismissed
      localStorage.setItem(LOCAL_STORAGE_KEY, "true")

      // Enable demo mode in the auth context
      await enableDemoMode()
      setIsLoading(false)

      // Don't automatically redirect after enabling demo mode
      // Remove: setTimeout(() => { router.push("/") }, 500)
      
      // Show success message instead
      toast({
        title: "Demo Mode Enabled",
        description: `You're now using the ${demoType} demo scenario.`,
        action: (
          <Button variant="default" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        )
      })
    } catch (error) {
      console.error("Demo login error:", error)
      setError(error instanceof Error ? error.message : "Failed to start demo. Please try again.")
      setIsLoading(false)
    }
  }

  const startDemoAnimation = (demoType: DemoType) => {
    setActiveDemo(demoType)
    setDemoAnimation(true)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Save the dismissal state to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, "true")
    router.push("/")
  }

  const toggleDemoInfo = () => {
    setShowDemoInfo(!showDemoInfo)
  }

  // Function to handle preview portfolio
  const handlePreviewPortfolio = (id: string) => {
    setPreviewPortfolio(id)
  }

  // Function to close preview modal
  const handleClosePreview = () => {
    setPreviewPortfolio(null)
  }

  // Find the selected portfolio for preview
  const selectedPortfolio = previewPortfolio 
      ? portfolios.find(p => p.id === previewPortfolio)
      ? {
          ...portfolios.find(p => p.id === previewPortfolio)!,
          sentiment: portfolios.find(p => p.id === previewPortfolio)!.sentiment as "bullish" | "neutral" | "bearish" | undefined
        }
      : null
      : null

  // If not visible, don't render anything
  if (!isVisible) {
    return null
  }

  return (
    <div className="relative">
      <div id="login-modal" className="fixed inset-0 flex items-center justify-center z-50">
        {/* Blurred background overlay */}
        <div
          id="login-modal-overlay"
          className="absolute inset-0 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        />

        {/* Main container */}
        <div className="relative z-20 w-full h-full flex flex-col">
          {/* Abstract background image with blur */}
          <div
            className="absolute inset-0 z-0 opacity-40"
            style={{
              backgroundImage: "url('/images/abstract-background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(50px)",
            }}
            />

          {/* Tabs navigation */}
          <div id="login-tabs-container" className="relative z-10 flex border-b border-border/40 bg-background/60 backdrop-blur-md overflow-x-auto">
            {/* Main tabs */}
            <div id="login-tabs-wrapper" className="flex">
              <button
                id="login-tab-btn"
                className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === "login"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("login")}
                  >
                Login
              </button>
              <button
                id="signup-tab-btn"
                className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === "signup"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "bg-orange-500 text-white rounded-md mx-1 hover:bg-orange-600"
                }`}
                onClick={() => setActiveTab("signup")}
                >
                Sign Up
              </button>
              <button
                id="demos-tab-btn"
                className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === "demos"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("demos")}
                  >
                Demo Accounts
              </button>

              {/* Additional tabs */}


            </div>

            {/* Close button */}
            <div className="ml-auto flex-shrink-0 flex items-center pr-4">
              <button
                onClick={handleDismiss}
                className="rounded-full p-1.5 bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
                >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div id="login-tabs-content" className="flex-1 overflow-y-auto p-6 relative z-10">
            {activeTab === "login" && (
              <div id="login-form-container" className="max-w-md mx-auto">
                <Card id="login-card">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Log in to access your GenEric TraDer account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          required
                          value={activeDemo && demoAnimation ? email : email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={activeDemo && demoAnimation ? "animate-pulse" : ""}
                          readOnly={activeDemo !== null && demoAnimation}
                          />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={activeDemo && demoAnimation ? password : password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={activeDemo && demoAnimation ? "animate-pulse" : ""}
                          readOnly={activeDemo !== null && demoAnimation}
                          />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading || demoAnimation}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>

                    <div className="mt-6 space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="w-full" disabled={isLoading || demoAnimation}>
                          <Github className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="w-full" disabled={isLoading || demoAnimation}>
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                              />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                              />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                              />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                              />
                            <path d="M1 1h22v22H1z" fill="none" />
                          </svg>
                        </Button>
                        <Button variant="outline" className="w-full" disabled={isLoading || demoAnimation}>
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                              d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                              fill="#1877F2"
                              />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <p className="text-xs text-center text-muted-foreground">
                      By signing in, you agree to our{" "}
                      <Link href="/terms" className="underline underline-offset-2 hover:text-primary">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
                        Privacy Policy
                      </Link>
                    </p>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "signup" && (
              <div id="signup-form-container" className="max-w-md mx-auto">
                <Card id="signup-card">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>Join GenEric TraDer and start your trading journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" name="email" type="email" placeholder="name@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" name="password" type="password" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" name="confirmPassword" type="password" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <Link href="/terms" className="underline underline-offset-2 hover:text-primary">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
                        Privacy Policy
                      </Link>
                    </p>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "demos" && (
              <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Demo Trading Accounts</h2>
                <p className="text-center text-muted-foreground mb-6">
                  Try our demo accounts to experience different trading scenarios without risking real money
                </p>

                {/* Portfolio filters */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "all" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setActiveFilter("all")}
                      >
                      All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "stocks" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setActiveFilter("stocks")}
                      >
                      Stocks
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "crypto" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setActiveFilter("crypto")}
                      >
                      Crypto
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "bullish" ? "bg-green-500 text-white" : ""}
                      onClick={() => setActiveFilter("bullish")}
                      >
                      Bullish
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "bearish" ? "bg-red-500 text-white" : ""}
                      onClick={() => setActiveFilter("bearish")}
                      >
                      Bearish
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "extreme-fear" ? "bg-red-700 text-white" : ""}
                      onClick={() => setActiveFilter("extreme-fear")}
                      >
                      Extreme Fear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "extreme-greed" ? "bg-green-700 text-white" : ""}
                      onClick={() => setActiveFilter("extreme-greed")}
                      >
                      Extreme Greed
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "low-risk" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setActiveFilter("low-risk")}
                      >
                      Low Risk
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "high-risk" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setActiveFilter("high-risk")}
                      >
                      High Risk
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "income" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setActiveFilter("income")}
                      >
                      Income
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={activeFilter === "global" ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setActiveFilter("global")}
                    >
                      Global
                    </Button>
                  </div>

                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search portfolios..."
                      className="w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchQuery("")}
                    >
                      {searchQuery ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Portfolio grid with pagination */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredPortfolios
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((portfolio) => (
                      <PortfolioDemoCard
                        key={portfolio.id}
                        portfolio={{
                        id: portfolio.id,
                        name: portfolio.name,
                        focus: portfolio.focus,
                        risk: portfolio.risk,
                        tags: portfolio.tags,
                        value: portfolio.value,
                        return: portfolio.return,
                        returnClass: portfolio.returnClass,
                        chartVariant: portfolio.chartVariant as "up" | "volatile" | "down",
                        allocation: portfolio.allocation,
                        icon: portfolio.icon,
                        sentiment: portfolio.sentiment as "bullish" | "bearish" | "neutral" | undefined,
                        sentimentStrength: portfolio.sentimentStrength,
                        fearGreedIndex: portfolio.fearGreedIndex,
                        fearGreedLabel: portfolio.fearGreedLabel,
                        historicalData: portfolio.historicalData?.map(data => ({
                          timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
                          value: data.value
                        })),
                        positions: portfolio.positions || []
                        }}
                        onSelect={(id) => startDemoAnimation(id as DemoType)}
                        onPreview={handlePreviewPortfolio}
                        isLoading={isLoading}
                        activeDemo={activeDemo}
                      />
                      ))}
                  </div>
                  
                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Description and additional info about portfolio types */}
                <div className="mt-10 border-t pt-8">
                  <h3 className="text-xl font-medium mb-4 text-center">Portfolio Strategies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <CardTitle className="text-lg">Bullish Portfolios</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Designed for rising markets with a focus on growth stocks, momentum plays, and emerging sectors. 
                          These portfolios typically have higher beta and are positioned to capitalize on market uptrends. 
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <CardTitle className="text-lg">Bearish Portfolios</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Defensive strategies built for market downturns, featuring value stocks, hedges, and 
                          lower-volatility assets. These portfolios aim to preserve capital in challenging markets.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <CardTitle className="text-lg">Global Portfolios</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Internationally diversified strategies that spread risk across different regions, 
                          currencies, and markets. These portfolios offer exposure to both developed and emerging economies.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "calculators" && (
              <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Financial Calculators</h2>
                <p className="text-center text-muted-foreground mb-6">
                  Explore our suite of financial calculators to help with your investment planning and decision making
                </p>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="trading">Trading</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="col-span-1">
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle>Compound Interest</CardTitle>
                            <CardDescription>Calculate how your investments grow over time</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <CompoundInterestCalculator />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-1">
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle>Savings Calculator</CardTitle>
                            <CardDescription>Plan your savings with regular contributions</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <SavingsCalculator />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-1">
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle>Inflation Impact</CardTitle>
                            <CardDescription>See how inflation affects your purchasing power</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <InflationCalculator />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-1">
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle>Retirement Planning</CardTitle>
                            <CardDescription>Plan for your retirement needs</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <RetirementCalculator />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="news" className="mt-4">
                    <div className="container mx-auto">
                      <h2 className="text-2xl font-bold mb-4 text-center">Market News</h2>
                      <p className="text-center text-muted-foreground mb-6">
                        Stay up-to-date with the latest market news and analysis
                      </p>
                      <NewsList />
                    </div>
                  </TabsContent>
                  <TabsContent value="education" className="mt-4">
                    <div className="container mx-auto">
                      <h2 className="text-2xl font-bold mb-4 text-center">Educational Resources</h2>
                      <p className="text-center text-muted-foreground mb-6">
                        Learn about trading strategies, risk management, and more
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle>Trading Basics</CardTitle>
                            <CardDescription>Learn the fundamentals of trading</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>Learn about trading strategies, risk management, and more.</p>
                          </CardContent>
                        </Card>
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle>Technical Analysis</CardTitle>
                            <CardDescription>Learn about technical analysis</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>Learn about trading strategies, risk management, and more.</p>
                          </CardContent>
                        </Card>
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle>Risk Management</CardTitle>
                            <CardDescription>Learn about risk management</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>Learn about trading strategies, risk management, and more.</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="backtest" className="mt-4">
                    <div className="container mx-auto">
                      <h2 className="text-2xl font-bold mb-4 text-center">Backtesting Tool</h2>
                      <p className="text-center text-muted-foreground mb-6">
                        Test trading strategies with historical data without creating an account
                      </p>
                      <Card className="mb-6">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <Label htmlFor="strategy" className="mb-2 block">Select Strategy</Label>
                              <select id="strategy" className="w-full p-2 border rounded-md bg-background">
                                <option value="moving-average">Moving Average Crossover</option>
                                <option value="rsi">RSI Overbought/Oversold</option>
                                <option value="bollinger">Bollinger Bands Breakout</option>
                                <option value="macd">MACD Signal Line</option>
                                <option value="grid-trading">Grid Trading (1%)</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="portfolio" className="mb-2 block">Select Portfolio/Asset</Label>
                              <select id="portfolio" className="w-full p-2 border rounded-md bg-background">
                                <option value="sp500">S&P 500 ETF</option>
                                <option value="nasdaq">NASDAQ 100</option>
                                <option value="btc">Bitcoin (BTC/USD)</option>
                                <option value="eth">Ethereum (ETH/USD)</option>
                                <option value="tech-stocks">Tech Stocks Basket</option>
                                <option value="dividend-stocks">Dividend Stocks Basket</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                              <Label htmlFor="start-date" className="mb-2 block">Start Date</Label>
                              <Input
                                id="start-date"
                                type="date"
                                defaultValue="2022-01-01"
                                />
                            </div>
                            <div>
                              <Label htmlFor="end-date" className="mb-2 block">End Date</Label>
                              <Input
                                id="end-date"
                                type="date"
                                defaultValue="2023-01-01" 
                                />
                            </div>
                            <div>
                              <Label htmlFor="initial-capital" className="mb-2 block">Initial Capital</Label>
                              <Input
                                id="initial-capital"
                                type="number"
                                defaultValue="10000"
                                />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <Label htmlFor="param1" className="mb-2 block">Parameter 1</Label>
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">5</span>
                                <Input
                                  id="param1"
                                  type="range"
                                  min="5"
                                  max="50"
                                  defaultValue="20"
                                  className="flex-grow"
                                  />
                                <span className="text-sm text-muted-foreground ml-2">50</span>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="param2" className="mb-2 block">Parameter 2</Label>
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">5</span>
                                <Input
                                  id="param2"
                                  type="range"
                                  min="5"
                                  max="100"
                                  defaultValue="50"
                                  className="flex-grow"
                                  />
                                <span className="text-sm text-muted-foreground ml-2">100</span>
                              </div>
                            </div>
                          </div>
                          <Button className="w-full md:w-auto">Run Backtest</Button>
                        </CardContent>
                      </Card>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                          <CardHeader>
                            <CardTitle>Performance Chart</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[300px] relative flex items-center justify-center bg-muted/20 rounded-md">
                              <div className="h-64 w-full" style={{
                                backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAzMDAgTDUwIDI2MCBMMTAwIDI0MCBMMTUwIDI0NSBMMjAwIDI2MCBMMjUwIDIzMCBMMzAwIDIyMCBMMzUwIDE5MCBMNDAwIDE4MCBMNDUwIDE3MCBMNTAwIDE1MCBMNTUwIDE2MCBMNjAwIDE0MCBMNjUwIDEyMCBMNzAwIDEwMCBMNzUwIDgwIEw4MDAgNjAgTDgwMCAzMDAgTDAgMzAwIFoiIGZpbGw9InJnYmEoNzksIDcwLCAyMjksIDAuMikiIHN0cm9rZT0icmdiKDc5LCA3MCwgMjI5KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')",
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                              }} />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-muted-foreground">Run a backtest to see results</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Backtest Results</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <dl className="space-y-4">
                              <div>
                                <dt className="text-sm text-muted-foreground">Total Return</dt>
                                <dd className="text-2xl font-semibold text-green-500">+24.8%</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-muted-foreground">Annualized Return</dt>
                                <dd className="text-xl font-semibold">18.3%</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-muted-foreground">Sharpe Ratio</dt>
                                <dd className="font-medium">1.42</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-muted-foreground">Max Drawdown</dt>
                                <dd className="font-medium text-red-500">-12.6%</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-muted-foreground">Win Rate</dt>
                                <dd className="font-medium">68%</dd>
                              </div>
                            </dl>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Trade History</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-auto max-h-[200px]">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left border-b">
                                    <th className="pb-2">Date</th>
                                    <th className="pb-2">Action</th>
                                    <th className="pb-2">Price</th>
                                    <th className="pb-2">Result</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-border/40">
                                    <td className="py-2">2022-01-15</td>
                                    <td className="py-2 text-green-500">Buy</td>
                                    <td className="py-2">$452.10</td>
                                    <td className="py-2">-</td>
                                  </tr>
                                  <tr className="border-b border-border/40">
                                    <td className="py-2">2022-02-20</td>
                                    <td className="py-2 text-red-500">Sell</td>
                                    <td className="py-2">$468.35</td>
                                    <td className="py-2 text-green-500">+3.6%</td>
                                  </tr>
                                  <tr className="border-b border-border/40">
                                    <td className="py-2">2022-03-10</td>
                                    <td className="py-2 text-green-500">Buy</td>
                                    <td className="py-2">$445.20</td>
                                    <td className="py-2">-</td>
                                  </tr>
                                  <tr className="border-b border-border/40">
                                    <td className="py-2">2022-04-05</td>
                                    <td className="py-2 text-red-500">Sell</td>
                                    <td className="py-2">$439.85</td>
                                    <td className="py-2 text-red-500">-1.2%</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">2022-05-12</td>
                                    <td className="py-2 text-green-500">Buy</td>
                                    <td className="py-2">$428.70</td>
                                    <td className="py-2">-</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Strategy Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-1">Moving Average Crossover</h4>
                                <p className="text-sm text-muted-foreground">
                                  This strategy generates buy signals when a faster moving average crosses above a slower moving average, 
                                  and sell signals when the faster average crosses below the slower one.
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Parameters</h4>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                  <li>Fast MA Period: 20 days</li>
                                  <li>Slow MA Period: 50 days</li>
                                  <li>Position Size: 100%</li>
                                </ul>
                              </div>
                              <div className="pt-2">
                                <p className="text-sm">
                                  <span className="text-muted-foreground">Want more strategy options and full customization? </span>
                                  <Button variant="link" className="h-auto p-0" onClick={() => setActiveTab("signup")}>
                                    Sign up for a free account
                                  </Button>
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="screener" className="mt-4">
                    <div className="container mx-auto">
                      <h2 className="text-2xl font-bold mb-4 text-center">Asset Screener</h2>
                      <p className="text-center text-muted-foreground mb-6">Screen assets</p>
                      <div className="flex items-center justify-center">
                        <Button asChild>
                          <Link href="https://example.com/screener" target="_blank" rel="noopener noreferrer">
                            View Asset Screener
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Portfolio Preview Modal */}
      {previewPortfolio !== null && (
        <PortfolioPreviewModal 
          isOpen={true}
          onClose={handleClosePreview}
          portfolio={selectedPortfolio || null}
        />
      )}
      {/* Add any additional modals or overlays here */}
    </div>
  )
}
// Add TypeScript interface for portfolio scenarios
interface DemoPortfolio {
  id: string;
  name: string; // Changed from title to name
  focus: string;
  risk: string;
  tags: string[];
  value: string;
  return: string;
  returnClass: string;
  chartVariant: "up" | "down" | "volatile";
  allocation: Array<{ label: string; value: number }>;
  icon: LucideIcon;
  historicalData?: Array<{ timestamp: string; value: number }>;
  sentiment?: "bullish" | "bearish" | "neutral";
  sentimentStrength?: number; // 0-100
  fearGreedIndex?: number; // 0-100
  fearGreedLabel?: string; // "Extreme Fear" to "Extreme Greed"
  costBasis?: string; // New field added
}

interface Portfolio {
  id: string;
  name: string;
  focus: string;
  risk: string;
  tags: string[];
  value: string;
  return: string;
  returnClass: string;
  chartVariant: "up" | "volatile" | "down";
  allocation: { name: string; value: number; color?: string }[];
  historicalData?: Array<{ timestamp: string; value: number }>;
  costBasis?: string;
}


