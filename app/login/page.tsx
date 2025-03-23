"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  Loader2,
  DollarSign,
  Github,
  X,
  Bot,
  Signal,
  BarChart2,
  Grid,
  ArrowRight,
  ChevronRight,
  Award,
  Users,
  Info,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { CookieBanner } from "@/components/cookie-banner"
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"

const LOCAL_STORAGE_KEY = "generic-trader-login-dismissed"

type DemoType = "middle-life" | "signals" | "grid" | "general" | "crypto" | "ai"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [isVisible, setIsVisible] = useState(true)
  const [activeDemo, setActiveDemo] = useState<DemoType | null>(null)
  const [demoAnimation, setDemoAnimation] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showDemoInfo, setShowDemoInfo] = useState(false)
  const router = useRouter()
  const { login, enableDemoMode } = useAuth()

  // Fix the login screen auto-dismissal issue by modifying the useEffect hook
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      try {
        // Check if user is already logged in
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

        // Only redirect if authenticated - remove the hasBeenDismissed check
        if (isAuthenticated) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking authentication state:", error)
        // Don't redirect in case of error - let the user try to log in
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
        await handleDemoLogin("general")
        return
      }

      await login(email, password)

      // On successful login, mark as dismissed
      localStorage.setItem(LOCAL_STORAGE_KEY, "true")

      // Add a small delay before redirecting to ensure state is updated
      setTimeout(() => {
        router.push("/")
      }, 100)
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

      // On successful signup and login, mark as dismissed
      localStorage.setItem(LOCAL_STORAGE_KEY, "true")

      // Add a small delay before redirecting to ensure state is updated
      setTimeout(() => {
        router.push("/")
      }, 100)
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
      enableDemoMode(demoType)

      // Redirect to dashboard with a small delay to ensure state is updated
      setTimeout(() => {
        router.push("/")
      }, 500) // Increased delay for better state synchronization
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

  // If not visible, don't render anything
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        onClick={handleDismiss} // Allow clicking outside to dismiss
      />

      <div className="relative z-20 w-full max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[90vh] overflow-y-auto">
        {/* Close button for the entire interface */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-6 top-6 z-10 bg-background/80 backdrop-blur-sm rounded-full"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Column 1: Registration */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <Badge className="w-fit mb-2" variant="outline">
              New Users
            </Badge>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join GenEric TraDer and start your trading journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && activeTab === "signup" && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                />
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

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or try a demo
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => startDemoAnimation("middle-life")}
                disabled={isLoading || demoAnimation}
              >
                <div className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Middle Life Example</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-primary"
              >
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Column 2: Login */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <Badge className="w-fit mb-2" variant="secondary">
              Existing Users
            </Badge>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Log in to access your GenEric TraDer account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && activeTab === "login" && (
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
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
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
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || demoAnimation}
              >
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
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isLoading || demoAnimation}
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isLoading || demoAnimation}
                >
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
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isLoading || demoAnimation}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                      fill="#1877F2"
                    />
                  </svg>
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => startDemoAnimation("signals")}
                disabled={isLoading || demoAnimation}
              >
                <div className="flex items-center">
                  <Signal className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Signals Example</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="w-full text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-1">
                <p>Demo credentials:</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={toggleDemoInfo}
                >
                  <Info className="h-3 w-3" />
                  <span className="sr-only">Demo Info</span>
                </Button>
              </div>
              <p className="font-mono text-xs">admin@example.com / admin123</p>
            </div>

            {showDemoInfo && (
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-xs">
                    Demo accounts provide a simulated trading environment with
                    pre-configured portfolios and strategies. No real money is
                    used, and all data is reset when you log out.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>

        {/* Column 3: Promotional Content */}
        <Card className="w-full bg-gradient-to-br from-background to-secondary/20">
          <CardHeader className="space-y-1">
            <Badge className="w-fit mb-2" variant="default">
              Featured
            </Badge>
            <CardTitle className="text-2xl font-bold">
              Explore GenEric TraDer
            </CardTitle>
            <CardDescription>
              Discover our advanced trading features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                  <Signal className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Trading Signals</h3>
                  <p className="text-sm text-muted-foreground">
                    Buy and sell signals starting at just $0.01 per signal
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Automated Bots</h3>
                  <p className="text-sm text-muted-foreground">
                    Create custom trading bots with no coding required
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Prediction Markets</h3>
                  <p className="text-sm text-muted-foreground">
                    Speculate on market outcomes with our prediction tools
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Copy Trading</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow and copy successful traders automatically
                  </p>
                </div>
              </div>
            </div>

            {/* Demo buttons */}
            <div className="space-y-3">
              <Button
                className="w-full flex items-center justify-between"
                onClick={() => startDemoAnimation("signals")}
                disabled={isLoading || demoAnimation}
              >
                <div className="flex items-center">
                  <Signal className="h-4 w-4 mr-2" />
                  <span>Try Signal Provider Demo</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="secondary"
                className="w-full flex items-center justify-between"
                onClick={() => startDemoAnimation("grid")}
                disabled={isLoading || demoAnimation}
              >
                <div className="flex items-center">
                  <Grid className="h-4 w-4 mr-2" />
                  <span>Try 1% Grid Example</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between bg-background/60"
                onClick={() => startDemoAnimation("general")}
                disabled={isLoading || demoAnimation}
              >
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  <span>Try $10M Demo Portfolio</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between bg-background/60"
                onClick={() => startDemoAnimation("crypto")}
                disabled={isLoading || demoAnimation}
              >
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-2 text-orange-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                    <path d="M2 17L12 22L22 17" fill="currentColor" />
                    <path d="M2 12L12 17L22 12" fill="currentColor" />
                  </svg>
                  <span>Try Crypto Trading Demo</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between bg-background/60"
                onClick={() => startDemoAnimation("ai")}
                disabled={isLoading || demoAnimation}
              >
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-2 text-purple-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                  <span>Try AI-Powered Trading</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Testimonial */}
            <div className="bg-background/40 p-4 rounded-lg border border-border/50">
              <div className="flex items-center mb-2">
                <Award className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium">Hey</span>
              </div>
              <p className="text-sm italic mb-2">
                "GenEric TraDer has transformed my trading strategy. The signals
                are accurate and the bots execute atomic trades."
              </p>
              <p className="text-xs text-muted-foreground">
                — Alex K., "Professional Trader"
              </p>
            </div>

            <div className="bg-background/40 p-4 rounded-lg border border-border/50">
              <div className="flex items-center mb-2">
                <Award className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium"></span>
              </div>
              <p className="text-sm italic mb-2">
                "GenEric TraDer has transformed my trading strategy. The signals
                are accurate and the bots execute atomic trades."
              </p>
              <p className="text-xs text-muted-foreground">
                — Alex K., "Professional Trader"
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-center w-full text-muted-foreground">
              Self-hostable, isolated environment. Autoscale Your data stays
              private.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
}

