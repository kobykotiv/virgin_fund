"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  BarChart2,
  Bot,
  ChevronRight,
  Code,
  Copy,
  CreditCard,
  Download,
  Globe,
  Lock,
  MailCheck,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import PerformanceChart from "@/components/performance-chart"
import { FearGreedWidget } from "@/components/fear-greed-widget"
import { ThemeToggle } from "@/components/theme-toggle"
import { CookieConsent } from "@/components/cookie-consent"
import { SignalsList } from "@/components/signals-list"
import { useAuth } from "@/providers/auth-provider"
import { PortfolioAllocation } from "@/components/portfolio-allocation"

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const auth = useAuth()

  useEffect(() => {
    // Update authentication state after mount to prevent hydration mismatch
    setIsAuthenticated(auth.isAuthenticated)
  }, [auth.isAuthenticated])

  return (
    <div className="flex flex-col min-h-screen">
      <header id="main-header" className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div id="header-container" className="container flex h-16 items-center justify-between">
          <div id="header-logo" className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GenEric Trading bot Platform</span>
          </div>
          <nav id="main-nav" className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#demos" className="text-sm font-medium hover:text-primary transition-colors">
              Demos
            </Link>
            <Link href="#copy-trading" className="text-sm font-medium hover:text-primary transition-colors">
              Copy Trading
            </Link>
            <Link href="#remote-bots" className="text-sm font-medium hover:text-primary transition-colors">
              Remote Bots
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
          <div id="auth-buttons" className="flex items-center gap-4">
            <ThemeToggle />
            {/* Conditionally render buttons based on client-side auth status to prevent hydration mismatch */}
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={auth.logout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/login?tab=signup">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section id="hero-section" className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <AnimatedBackground />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="inline-flex rounded-md px-3.5 py-1.5" variant="secondary">
                    <span className="text-xs font-medium">Self-Hosted & Secure</span>
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Virgin Fund : GenEric TraDer AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our AI-powered platform bridges the gap between bot-based trading and copy trading with our
                    isolated, self-hosted solution. Connect to Alpaca Markets and CoinGecko for real-time data and paper
                    trading.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login?tab=demo">
                    <Button className="gap-1.5">
                      Try the Demo <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login?tab=signup">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <Image
                  src="/images/hero-image.png"
                  alt="Hero Image"
                  width={600}
                  height={600}
                  className="max-w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Everything you need to automate your trading
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  GenEric TraDer combines the power of algorithmic trading with the simplicity of copy trading, all in a
                  secure, self-hosted environment.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <Bot className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Automated Trading Bots</h3>
                  <p className="text-muted-foreground">Create and deploy sophisticated trading bots with customizable strategies and risk parameters.</p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Risk Management</h3>
                  <p className="text-muted-foreground">
                    Built-in risk controls including stop-loss, take-profit, and maximum drawdown protection.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Social Trading</h3>
                  <p className="text-muted-foreground">
                    Connect and follow top traders, share strategies, and access exclusive trading signals.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <Code className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Strategy Builder</h3>
                  <p className="text-muted-foreground">
                    Create custom trading strategies using our visual editor or code them from scratch.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <CreditCard className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">API Integrations</h3>
                  <p className="text-muted-foreground">
                    Connect to Alpaca Markets, CoinGecko, and other financial APIs for seamless trading.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <Lock className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Self-Hosted</h3>
                  <p className="text-muted-foreground">
                    Run the platform on your own servers for complete control and privacy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Portfolios Section */}
        <section id="demos" className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <Image src="/images/abstract-background.png" alt="Abstract background" fill className="object-cover" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Demo Portfolios</div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  See GenEric TraDer in action
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore our demo portfolios across different markets and strategies
                </p>
              </div>
            </div>

            <Tabs defaultValue="traditional" className="w-full max-w-4xl mx-auto mt-12">
              <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-md">
                <TabsTrigger value="traditional">Traditional Markets</TabsTrigger>
                <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
                <TabsTrigger value="defi">DeFi Yield</TabsTrigger>
              </TabsList>
              <TabsContent value="traditional" className="mt-6">
                <Card className="bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold">S&P 500 Momentum Strategy</h3>
                        <Badge className="bg-green-500 hover:bg-green-600">+18.2% YTD</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        This portfolio uses momentum indicators to trade S&P 500 stocks, focusing on the top performers
                        while managing risk with dynamic position sizing.
                      </p>
                      <div className="h-[300px] w-full bg-muted/50 rounded-md overflow-hidden">
                        {/* <PerformanceChart days={90} className="h-full w-full" >
                        </PerformanceChart> */}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Assets</p>
                          <p className="font-medium">42 Stocks</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Win Rate</p>
                          <p className="font-medium">68%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Max Drawdown</p>
                          <p className="font-medium">-12.4%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                          <p className="font-medium">1.8</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          View Demo Dashboard <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" /> Export Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="crypto" className="mt-6">
                <Card className="bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold">Crypto Grid Trading Bot</h3>
                        <Badge className="bg-green-500 hover:bg-green-600">+32.7% YTD</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        This portfolio uses grid trading strategies on major cryptocurrencies, automatically buying low
                        and selling high within predefined price ranges.
                      </p>
                      <div className="h-[300px] w-full bg-muted/50 rounded-md overflow-hidden">
                        <PerformanceChart days={90} variant="crypto" className="h-full w-full" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Assets</p>
                          <p className="font-medium">BTC, ETH, SOL</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Win Rate</p>
                          <p className="font-medium">72%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Max Drawdown</p>
                          <p className="font-medium">-18.6%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                          <p className="font-medium">2.1</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          View Demo Dashboard <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" /> Export Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="defi" className="mt-6">
                <Card className="bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold">DeFi Yield Optimizer</h3>
                        <Badge className="bg-green-500 hover:bg-green-600">+24.5% YTD</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        This portfolio automatically rotates capital between DeFi protocols to maximize yield while
                        minimizing impermanent loss and smart contract risk.
                      </p>
                      <div className="h-[300px] w-full bg-muted/50 rounded-md overflow-hidden">
                        <PerformanceChart days={90} variant="defi" className="h-full w-full" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Protocols</p>
                          <p className="font-medium">8 Platforms</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Avg APY</p>
                          <p className="font-medium">16.8%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Max Drawdown</p>
                          <p className="font-medium">-9.2%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Rebalances</p>
                          <p className="font-medium">Weekly</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          View Demo Dashboard <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" /> Export Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Fear & Greed + Signals Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background/80 backdrop-blur-sm px-3 py-1 text-sm">
                  Market Insights
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Comprehensive Market Analysis</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Make informed decisions with our advanced market indicators and signals
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-bold">Fear & Greed Index</h3>
                    <p className="text-muted-foreground">
                      Monitor market sentiment with our Fear & Greed Index, helping you identify potential market tops
                      and bottoms.
                    </p>
                    <div className="h-[250px] w-full bg-muted/50 rounded-md overflow-hidden">
                      <FearGreedWidget />
                    </div>
                    <Button className="w-full mt-2">View Detailed Analysis</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-bold">Trading Signals</h3>
                    <p className="text-muted-foreground">
                      Get actionable trading signals based on technical indicators, market trends, and AI analysis.
                    </p>
                    <div className="h-[250px] w-full bg-muted/50 rounded-md overflow-hidden">
                      <SignalsList />
                    </div>
                    <Button className="w-full mt-2">View All Signals</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <Image src="/images/abstract-background.png" alt="Abstract background" fill className="object-cover" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background/80 backdrop-blur-sm px-3 py-1 text-sm">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  What our early users are saying
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're just getting started, but our beta users are already seeing impressive results
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Alex T.</p>
                        <p className="text-xs text-muted-foreground">Individual Investor</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "I've been able to automate my entire investment strategy. The backtesting feature saved me from
                      making some costly mistakes."
                    </p>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sarah K.</p>
                        <p className="text-xs text-muted-foreground">Crypto Trader</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "The grid trading bot has completely changed how I trade crypto. I'm making consistent profits
                      even in sideways markets."
                    </p>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg md:col-span-2 lg:col-span-1">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Michael R.</p>
                        <p className="text-xs text-muted-foreground">Family Office Manager</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "The self-hosted nature of GenEric TraDer gives us the privacy and security we need for our
                      clients. The performance has exceeded our expectations."
                    </p>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background/80 backdrop-blur-sm px-3 py-1 text-sm">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Choose the plan that fits your trading style
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From casual traders to professional institutions, we have a plan for everyone
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:grid-cols-5">
              {/* Free Insta Tier */}
              <Card className="relative overflow-hidden border-2 border-muted bg-background/60 backdrop-blur-md shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl font-bold">Free Insta</h3>
                    <p className="text-4xl font-bold">$0</p>
                    <p className="text-muted-foreground">Perfect for beginners exploring automated trading</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Up to 5 trading bots</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Grid (1%) strategy</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>DCA strategy</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Paper trading only</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Basic backtesting</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Get Started</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Baby Tier */}
              <Card className="relative overflow-hidden border-2 border-muted bg-background/60 backdrop-blur-md shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl font-bold">Baby</h3>
                    <p className="text-4xl font-bold">
                      $9<span className="text-lg font-normal">/month</span>
                    </p>
                    <p className="text-muted-foreground">For new traders starting with automated strategies</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Up to 10 trading bots</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Grid (1%) strategy</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>DCA strategy</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Live trading</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Standard backtesting</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Start Free Trial</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Middle Tier */}
              <Card className="relative overflow-hidden border-2 border-muted bg-background/60 backdrop-blur-md shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl font-bold">Middle</h3>
                    <p className="text-4xl font-bold">
                      $29<span className="text-lg font-normal">/month</span>
                    </p>
                    <p className="text-muted-foreground">For active traders with multiple strategies</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Up to 15 trading bots</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>All strategy types</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Basket trading</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>API access</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Start 14-Day Trial</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Big Tier */}
              <Card className="relative overflow-hidden border-2 border-muted bg-background/60 backdrop-blur-md shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl font-bold">Big</h3>
                    <p className="text-4xl font-bold">
                      $99<span className="text-lg font-normal">/month</span>
                    </p>
                    <p className="text-muted-foreground">For advanced traders with multiple strategies</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Up to 25 trading bots</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>All strategy types</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Basket trading</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>API access</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>VIP support</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Start 14-Day Trial</Button>
                  </div>
                </CardContent>
              </Card>

              {/* XL Tier */}
              <Card className="relative overflow-hidden border-2 border-muted bg-background/60 backdrop-blur-md shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl font-bold">XL</h3>
                    <p className="text-4xl font-bold">
                      $199<span className="text-lg font-normal">/month</span>
                    </p>
                    <p className="text-muted-foreground">For professional traders and institutions</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Unlimited trading bots</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>All features included</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>White-label option</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Custom integrations</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span>Dedicated account manager</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full mt-4">
                      Contact Sales
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Table */}
            <div className="mt-16 max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-8">Plan Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-6 text-left">Feature</th>
                      <th className="py-4 px-6 text-center">Free Insta</th>
                      <th className="py-4 px-6 text-center">Baby</th>
                      <th className="py-4 px-6 text-center">Middle</th>
                      <th className="py-4 px-6 text-center">Big</th>
                      <th className="py-4 px-6 text-center">XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-muted/30">
                      <td className="py-4 px-6 font-medium">Price</td>
                      <td className="py-4 px-6 text-center">$0</td>
                      <td className="py-4 px-6 text-center">$9/mo</td>
                      <td className="py-4 px-6 text-center">$29/mo</td>
                      <td className="py-4 px-6 text-center">$99/mo</td>
                      <td className="py-4 px-6 text-center">$199/mo</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">Max Trading Bots</td>
                      <td className="py-4 px-6 text-center">5</td>
                      <td className="py-4 px-6 text-center">10</td>
                      <td className="py-4 px-6 text-center">15</td>
                      <td className="py-4 px-6 text-center">25</td>
                      <td className="py-4 px-6 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="py-4 px-6 font-medium">Live Trading</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">Grid Strategy</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="py-4 px-6 font-medium">DCA Strategy</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">Indicator-Based Strategies</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="py-4 px-6 font-medium">Basket Trading</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">Backtesting</td>
                      <td className="py-4 px-6 text-center">Basic</td>
                      <td className="py-4 px-6 text-center">Standard</td>
                      <td className="py-4 px-6 text-center">Advanced</td>
                      <td className="py-4 px-6 text-center">Advanced</td>
                      <td className="py-4 px-6 text-center">Advanced+</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="py-4 px-6 font-medium">API Access</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-rose-500 w-6 h-6 text-rose-500">
                          ✕
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-green-500 bg-green-500/10 w-6 h-6 text-green-500">
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 font-medium">Support</td>
                      <td className="py-4 px-6 text-center">Community</td>
                      <td className="py-4 px-6 text-center">Email</td>
                      <td className="py-4 px-6 text-center">Priority</td>
                      <td className="py-4 px-6 text-center">VIP</td>
                      <td className="py-4 px-6 text-center">Dedicated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-primary/90">
            <Image
              src="/images/abstract-background.png"
              alt="Abstract background"
              fill
              className="object-cover mix-blend-overlay opacity-20"
            />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary-foreground">
                  Ready to automate your trading?
                </h2>
                <p className="max-w-[900px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the growing community of traders using GenEric TraDer to optimize their strategies and improve
                  returns.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="gap-1.5">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demos">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
                  >
                    View Demos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background/80 backdrop-blur-sm px-3 py-1 text-sm">
                  Technology
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Built with modern technology
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  GenEric TraDer leverages cutting-edge technologies to provide a reliable and scalable trading platform
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Code className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Open Source</h3>
                  <p className="text-muted-foreground">
                    Fully transparent codebase that you can inspect, modify, and extend
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Lock className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Self-Hosted</h3>
                  <p className="text-muted-foreground">
                    Run on your own infrastructure for maximum privacy and control
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Zap className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Real-Time</h3>
                  <p className="text-muted-foreground">Lightning-fast execution and real-time market data processing</p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20 shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <CreditCard className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">API Integrations</h3>
                  <p className="text-muted-foreground">
                    Connect to Alpaca Markets, CoinGecko, and other financial APIs
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background/80 backdrop-blur-xl">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Virgin Fund : GenEric TraDer AI</span>
              </div>
              <p className="text-muted-foreground">
                Self-hosted AI-powered automated trading platform that bridges the gap between bot-based trading and
                copy trading.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Dribbble</span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-2 lg:col-span-2">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#features"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#demos"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Demos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#copy-trading"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Copy Trading
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#remote-bots"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Remote Bots
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-base font-medium">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-base font-medium">Subscribe to our newsletter</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest updates, trading tips, and exclusive offers delivered to your inbox.
              </p>
              <form className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
                <Button type="submit" className="flex items-center gap-1">
                  Subscribe <MailCheck className="h-4 w-4 ml-1" />
                </Button>
              </form>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Virgin Fund : GenEric TraDer AI. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  )
}
