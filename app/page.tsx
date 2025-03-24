import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
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
import { PerformanceChart } from "@/components/performance-chart"
import { FearGreedWidget } from "@/components/fear-greed-widget"
import { ThemeToggle } from "@/components/theme-toggle"
import { CookieConsent } from "@/components/cookie-consent"
import { SignalsList } from "@/components/signals-list"
import { DashboardSection } from "./dashboard/example-section"

export const metadata: Metadata = {
  title: "GenEric TraDer | Self-Hosted Automated Trading Platform",
  description:
    "Bridge the gap between bot-based trading and copy trading with our self-hosted, isolated trading platform. Connect to Alpaca Markets and CoinGecko for real-time data and paper trading.",
  keywords:
    "trading bot, automated trading, copy trading, self-hosted, crypto trading, stock trading, Alpaca Markets, CoinGecko, paper trading, algorithmic trading, fear greed index, trading signals",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://generic-trader.app",
    title: "GenEric TraDer | Self-Hosted Automated Trading Platform",
    description:
      "Bridge the gap between bot-based trading and copy trading with our self-hosted, isolated trading platform.",
    siteName: "GenEric TraDer",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "GenEric TraDer Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GenEric TraDer | Self-Hosted Automated Trading Platform",
    description:
      "Bridge the gap between bot-based trading and copy trading with our self-hosted, isolated trading platform.",
    images: ["/images/og-image.png"],
    creator: "@generictrader",
  },
}

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Automated Trading Made Simple</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Build, test, and deploy trading strategies without writing code
        </p>
      </section>

      {/* Feature Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {["Strategy Builder", "Backtesting", "Portfolio Analytics", "Risk Management"].map((feature) => (
          <div key={feature} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">{feature}</h3>
            <p className="text-muted-foreground">
              Advanced {feature.toLowerCase()} tools for modern traders
            </p>
          </div>
        ))}
      </section>

      {/* Live Demo Section */}
      <DashboardSection />

      {/* Market Analysis Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Real-Time Market Analysis</h2>
          <p className="text-muted-foreground">
            Get instant insights with our advanced market analysis tools
          </p>
        </div>
        <div className="bg-muted rounded-lg p-6">
          {/* Placeholder for market data visualization */}
          <div className="h-64 flex items-center justify-center">
            Market Visualization Placeholder
          </div>
        </div>
      </section>
    </div>
  )
}

