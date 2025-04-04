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
import { AlertCircle, Loader2, DollarSign, Github, Signal, Grid, X } from "lucide-react"
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

const LOCAL_STORAGE_KEY = "generic-trader-login-dismissed"

type DemoType =
  | "middle-life"
  | "signals"
  | "grid"
  | "general"
  | "crypto"
  | "ai"
  | "tech-growth"
  | "dividend-income"
  | "balanced-allocation"
  | "conservative-income"
  | "aggressive-growth"
  | "crypto-pioneer"
  | "blue-chip"
  | "global-equity"
  | "emerging-markets"
  | "sustainable"
  | "hft"
  | "options"
  | "microcap"
  | "real-estate"
  | "biotech"
  | "fintech"
  | "retail"
  | "energy"
  | "utilities"
  | "defi"
  | "nft"
  | "commodities"
  | "international"
  | "value"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    | "login"
    | "signup"
    | "demos"
    | "calculators"
    | "news"
    | "education"
    | "forum"
    | "api"
    | "risk"
    | "calendar"
    | "performance"
    | "backtest"
    | "screener"
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
  const itemsPerPage = 9

  // Portfolio data
  const portfolios = [
    {
      id: "general",
      name: "$10M Portfolio",
      focus: "General trading with a large portfolio",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      tags: ["Stocks", "Balanced"],
      risk: "Moderate",
      value: "$10,245,320",
      return: "+8.2%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Stocks", value: 45, color: "#4f46e5" },
        { name: "Bonds", value: 30, color: "#10b981" },
        { name: "Cash", value: 15, color: "#f59e0b" },
        { name: "Crypto", value: 10, color: "#8b5cf6" },
      ],
    },
    {
      id: "crypto",
      name: "Crypto Trading",
      focus: "High volatility crypto portfolio",
      icon: <Bitcoin className="h-5 w-5 text-orange-500" />,
      tags: ["Crypto", "High Growth"],
      risk: "High",
      value: "$5,782,910",
      return: "+22.7%",
      returnClass: "text-green-500",
      chartVariant: "crypto",
      allocation: [
        { name: "Bitcoin", value: 40, color: "#f7931a" },
        { name: "Ethereum", value: 30, color: "#627eea" },
        { name: "Solana", value: 15, color: "#00ffbd" },
        { name: "Others", value: 15, color: "#8b5cf6" },
      ],
    },
    {
      id: "signals",
      name: "Signals Trading",
      focus: "Automated signal-based trading",
      icon: <Signal className="h-5 w-5 text-blue-500" />,
      tags: ["Stocks", "Automated"],
      risk: "Moderate",
      value: "$7,124,650",
      return: "+12.4%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Tech", value: 35, color: "#3b82f6" },
        { name: "Finance", value: 25, color: "#10b981" },
        { name: "Energy", value: 20, color: "#f59e0b" },
        { name: "Healthcare", value: 20, color: "#ec4899" },
      ],
    },
    {
      id: "grid",
      name: "1% Grid Trading",
      focus: "Automated grid-based trading strategy",
      icon: <Grid className="h-5 w-5 text-primary" />,
      tags: ["Crypto", "Automated"],
      risk: "Moderate",
      value: "$8,356,720",
      return: "+15.8%",
      returnClass: "text-green-500",
      chartVariant: "defi",
      allocation: [
        { name: "BTC/USD", value: 30, color: "#f7931a" },
        { name: "ETH/USD", value: 30, color: "#627eea" },
        { name: "EUR/USD", value: 20, color: "#0052b4" },
        { name: "Gold", value: 20, color: "#ffd700" },
      ],
    },
    {
      id: "middle-life",
      name: "Middle Life",
      focus: "Mid-career investment portfolio",
      icon: <BarChart2Icon className="h-5 w-5 text-green-500" />,
      tags: ["Stocks", "Bonds", "Balanced"],
      risk: "Low",
      value: "$1,245,780",
      return: "+6.5%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Stocks", value: 40, color: "#4f46e5" },
        { name: "Bonds", value: 35, color: "#10b981" },
        { name: "Real Estate", value: 15, color: "#f97316" },
        { name: "Cash", value: 10, color: "#f59e0b" },
      ],
    },
    {
      id: "ai",
      name: "AI-Powered Trading",
      focus: "Machine learning optimized portfolio",
      icon: <Cpu className="h-5 w-5 text-purple-500" />,
      tags: ["Stocks", "Crypto", "AI"],
      risk: "High",
      value: "$9,876,540",
      return: "+18.3%",
      returnClass: "text-green-500",
      chartVariant: "defi",
      allocation: [
        { name: "Tech", value: 45, color: "#3b82f6" },
        { name: "AI Stocks", value: 25, color: "#8b5cf6" },
        { name: "Crypto", value: 20, color: "#f7931a" },
        { name: "Commodities", value: 10, color: "#f59e0b" },
      ],
    },
    // New portfolios
    {
      id: "tech-growth",
      name: "Tech Growth",
      focus: "High-growth technology companies",
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      tags: ["Stocks", "Tech"],
      risk: "High",
      value: "$4,875,230",
      return: "+19.7%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Software", value: 40, color: "#3b82f6" },
        { name: "Hardware", value: 25, color: "#8b5cf6" },
        { name: "Cloud", value: 20, color: "#06b6d4" },
        { name: "AI", value: 15, color: "#ec4899" },
      ],
    },
    {
      id: "dividend-income",
      name: "Dividend Income",
      focus: "Stocks with consistent and high dividend yields",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      tags: ["Stocks", "Income"],
      risk: "Moderate",
      value: "$3,456,780",
      return: "+5.8%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Utilities", value: 30, color: "#10b981" },
        { name: "REITs", value: 25, color: "#f97316" },
        { name: "Consumer", value: 25, color: "#3b82f6" },
        { name: "Energy", value: 20, color: "#f59e0b" },
      ],
    },
    {
      id: "balanced-allocation",
      name: "Balanced Allocation",
      focus: "Even distribution between stocks and cryptocurrencies",
      icon: <Scale className="h-5 w-5 text-blue-500" />,
      tags: ["Stocks", "Crypto"],
      risk: "Moderate",
      value: "$5,678,900",
      return: "+11.3%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Stocks", value: 50, color: "#3b82f6" },
        { name: "Crypto", value: 50, color: "#f7931a" },
      ],
    },
    {
      id: "conservative-income",
      name: "Conservative Income",
      focus: "Low-risk assets with steady income",
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      tags: ["Stocks", "Bonds", "Income"],
      risk: "Low",
      value: "$2,345,670",
      return: "+4.2%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Bonds", value: 60, color: "#10b981" },
        { name: "Dividend", value: 25, color: "#3b82f6" },
        { name: "Cash", value: 10, color: "#f59e0b" },
        { name: "REITs", value: 5, color: "#f97316" },
      ],
    },
    {
      id: "aggressive-growth",
      name: "Aggressive Growth",
      focus: "High volatility assets aiming for rapid capital appreciation",
      icon: <Rocket className="h-5 w-5 text-red-500" />,
      tags: ["Stocks", "Crypto", "High Growth"],
      risk: "High",
      value: "$7,890,120",
      return: "+27.5%",
      returnClass: "text-green-500",
      chartVariant: "crypto",
      allocation: [
        { name: "Growth", value: 45, color: "#3b82f6" },
        { name: "Crypto", value: 35, color: "#f7931a" },
        { name: "Small Cap", value: 15, color: "#ec4899" },
        { name: "Options", value: 5, color: "#8b5cf6" },
      ],
    },
    {
      id: "crypto-pioneer",
      name: "Crypto Pioneer",
      focus: "Major and emerging cryptocurrencies",
      icon: <Bitcoin className="h-5 w-5 text-orange-500" />,
      tags: ["Crypto", "Emerging"],
      risk: "High",
      value: "$4,567,890",
      return: "+31.2%",
      returnClass: "text-green-500",
      chartVariant: "crypto",
      allocation: [
        { name: "Bitcoin", value: 30, color: "#f7931a" },
        { name: "Ethereum", value: 25, color: "#627eea" },
        { name: "Altcoins", value: 25, color: "#8b5cf6" },
        { name: "DeFi", value: 20, color: "#ec4899" },
      ],
    },
    {
      id: "blue-chip",
      name: "Blue Chip Stocks",
      focus: "Established, financially sound companies",
      icon: <Building className="h-5 w-5 text-blue-700" />,
      tags: ["Stocks", "Blue Chip"],
      risk: "Low",
      value: "$6,789,120",
      return: "+7.8%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Tech", value: 30, color: "#3b82f6" },
        { name: "Finance", value: 25, color: "#10b981" },
        { name: "Healthcare", value: 25, color: "#ec4899" },
        { name: "Consumer", value: 20, color: "#f59e0b" },
      ],
    },
    {
      id: "global-equity",
      name: "Global Equity",
      focus: "Diversified international stock markets",
      icon: <Globe className="h-5 w-5 text-blue-500" />,
      tags: ["Stocks", "Global"],
      risk: "Moderate",
      value: "$5,432,100",
      return: "+9.5%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "US", value: 40, color: "#3b82f6" },
        { name: "Europe", value: 25, color: "#10b981" },
        { name: "Asia", value: 25, color: "#f59e0b" },
        { name: "Emerging", value: 10, color: "#ec4899" },
      ],
    },
    {
      id: "emerging-markets",
      name: "Emerging Markets",
      focus: "Stocks from emerging economies",
      icon: <Sprout className="h-5 w-5 text-green-500" />,
      tags: ["Stocks", "Emerging Markets"],
      risk: "High",
      value: "$3,210,980",
      return: "+15.7%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "China", value: 30, color: "#ef4444" },
        { name: "India", value: 25, color: "#10b981" },
        { name: "Brazil", value: 25, color: "#f59e0b" },
        { name: "Others", value: 20, color: "#8b5cf6" },
      ],
    },
    {
      id: "sustainable",
      name: "Sustainable Investing",
      focus: "ESG (Environmental, Social, Governance) compliant companies",
      icon: <Sprout className="h-5 w-5 text-green-600" />,
      tags: ["Stocks", "ESG"],
      risk: "Moderate",
      value: "$4,321,090",
      return: "+8.9%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Clean Energy", value: 35, color: "#10b981" },
        { name: "Sustainable", value: 30, color: "#3b82f6" },
        { name: "Social", value: 20, color: "#ec4899" },
        { name: "Green Bonds", value: 15, color: "#f59e0b" },
      ],
    },
    {
      id: "hft",
      name: "High Frequency Trading",
      focus: "Short-term trading patterns",
      icon: <Repeat className="h-5 w-5 text-purple-500" />,
      tags: ["Stocks", "Crypto", "HFT"],
      risk: "High",
      value: "$8,765,430",
      return: "+24.3%",
      returnClass: "text-green-500",
      chartVariant: "crypto",
      allocation: [
        { name: "Equities", value: 45, color: "#3b82f6" },
        { name: "Crypto", value: 30, color: "#f7931a" },
        { name: "Forex", value: 15, color: "#10b981" },
        { name: "Futures", value: 10, color: "#f59e0b" },
      ],
    },
    {
      id: "options",
      name: "Options & Derivatives",
      focus: "Incorporates options positions for hedging and speculation",
      icon: <LineChart className="h-5 w-5 text-yellow-600" />,
      tags: ["Derivatives", "Options"],
      risk: "High",
      value: "$6,543,210",
      return: "+21.5%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Call Options", value: 40, color: "#3b82f6" },
        { name: "Put Options", value: 30, color: "#ef4444" },
        { name: "Futures", value: 20, color: "#f59e0b" },
        { name: "Stocks", value: 10, color: "#10b981" },
      ],
    },
    {
      id: "microcap",
      name: "Microcap Opportunities",
      focus: "Smaller companies with high growth potential",
      icon: <Microscope className="h-5 w-5 text-purple-600" />,
      tags: ["Stocks", "Microcap"],
      risk: "High",
      value: "$2,109,870",
      return: "+29.8%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Tech", value: 35, color: "#3b82f6" },
        { name: "Healthcare", value: 25, color: "#ec4899" },
        { name: "Consumer", value: 25, color: "#f59e0b" },
        { name: "Industrial", value: 15, color: "#10b981" },
      ],
    },
    {
      id: "real-estate",
      name: "Real Estate Fund",
      focus: "REITs and real estate-related securities",
      icon: <Building2 className="h-5 w-5 text-orange-600" />,
      tags: ["REITs", "Real Estate"],
      risk: "Moderate",
      value: "$3,987,650",
      return: "+7.2%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Residential", value: 35, color: "#3b82f6" },
        { name: "Commercial", value: 30, color: "#10b981" },
        { name: "Industrial", value: 20, color: "#f59e0b" },
        { name: "Mortgage", value: 15, color: "#ec4899" },
      ],
    },
    {
      id: "biotech",
      name: "Biotech Innovation",
      focus: "Biotechnology and pharmaceutical stocks",
      icon: <Microscope className="h-5 w-5 text-green-500" />,
      tags: ["Stocks", "Biotech"],
      risk: "High",
      value: "$4,876,540",
      return: "+18.9%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Pharma", value: 40, color: "#3b82f6" },
        { name: "Biotech", value: 35, color: "#ec4899" },
        { name: "Medical", value: 15, color: "#10b981" },
        { name: "Research", value: 10, color: "#f59e0b" },
      ],
    },
    {
      id: "fintech",
      name: "Fintech Focus",
      focus: "Financial technology companies and startups",
      icon: <Cpu className="h-5 w-5 text-blue-500" />,
      tags: ["Stocks", "Fintech"],
      risk: "Moderate",
      value: "$5,432,180",
      return: "+14.7%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Payments", value: 35, color: "#3b82f6" },
        { name: "Banking", value: 25, color: "#10b981" },
        { name: "Blockchain", value: 25, color: "#f7931a" },
        { name: "Insurance", value: 15, color: "#ec4899" },
      ],
    },
    {
      id: "retail",
      name: "Retail Sector",
      focus: "Consumer and retail companies",
      icon: <Store className="h-5 w-5 text-red-500" />,
      tags: ["Stocks", "Retail"],
      risk: "Moderate",
      value: "$3,765,420",
      return: "+9.8%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "E-commerce", value: 40, color: "#3b82f6" },
        { name: "Brick & Mortar", value: 25, color: "#f59e0b" },
        { name: "Luxury", value: 20, color: "#ec4899" },
        { name: "Consumer", value: 15, color: "#10b981" },
      ],
    },
    {
      id: "energy",
      name: "Energy & Resources",
      focus: "Energy, utilities, and natural resources",
      icon: <Droplet className="h-5 w-5 text-blue-600" />,
      tags: ["Stocks", "Energy"],
      risk: "Moderate",
      value: "$4,321,980",
      return: "+8.5%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Oil & Gas", value: 35, color: "#f59e0b" },
        { name: "Renewables", value: 30, color: "#10b981" },
        { name: "Utilities", value: 25, color: "#3b82f6" },
        { name: "Mining", value: 10, color: "#8b5cf6" },
      ],
    },
    {
      id: "utilities",
      name: "Utility Providers",
      focus: "Stable utility companies",
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
      tags: ["Stocks", "Utilities"],
      risk: "Low",
      value: "$3,210,870",
      return: "+5.3%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Electric", value: 40, color: "#f59e0b" },
        { name: "Water", value: 25, color: "#3b82f6" },
        { name: "Gas", value: 25, color: "#10b981" },
        { name: "Telecom", value: 10, color: "#8b5cf6" },
      ],
    },
    {
      id: "defi",
      name: "Crypto DeFi",
      focus: "Decentralized finance projects and tokens",
      icon: <Wallet className="h-5 w-5 text-purple-600" />,
      tags: ["Crypto", "DeFi"],
      risk: "High",
      value: "$3,876,540",
      return: "+34.2%",
      returnClass: "text-green-500",
      chartVariant: "crypto",
      allocation: [
        { name: "Lending", value: 35, color: "#3b82f6" },
        { name: "DEX", value: 30, color: "#f7931a" },
        { name: "Yield", value: 25, color: "#10b981" },
        { name: "Insurance", value: 10, color: "#ec4899" },
      ],
    },
    {
      id: "nft",
      name: "NFT & Metaverse",
      focus: "Emerging investments in NFTs and metaverse-related stocks",
      icon: <Layers className="h-5 w-5 text-indigo-500" />,
      tags: ["Stocks", "Crypto", "NFT", "Metaverse"],
      risk: "High",
      value: "$2,987,650",
      return: "+26.8%",
      returnClass: "text-green-500",
      chartVariant: "crypto",
      allocation: [
        { name: "Gaming", value: 35, color: "#8b5cf6" },
        { name: "NFT", value: 30, color: "#f7931a" },
        { name: "Metaverse", value: 25, color: "#3b82f6" },
        { name: "AR/VR", value: 10, color: "#ec4899" },
      ],
    },
    {
      id: "commodities",
      name: "Commodities & Resources",
      focus: "Investments in commodities such as gold, oil, etc.",
      icon: <Gold className="h-5 w-5 text-yellow-600" />,
      tags: ["Commodities", "Resources"],
      risk: "Moderate",
      value: "$4,123,870",
      return: "+7.9%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Gold", value: 35, color: "#f59e0b" },
        { name: "Oil", value: 25, color: "#3b82f6" },
        { name: "Metals", value: 25, color: "#8b5cf6" },
        { name: "Agriculture", value: 15, color: "#10b981" },
      ],
    },
    {
      id: "international",
      name: "International Diversified",
      focus: "Broad mix of global stocks, bonds, and crypto assets",
      icon: <Globe className="h-5 w-5 text-blue-600" />,
      tags: ["Stocks", "Bonds", "Crypto", "Global"],
      risk: "Moderate",
      value: "$6,543,210",
      return: "+10.5%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Global Stocks", value: 40, color: "#3b82f6" },
        { name: "Bonds", value: 30, color: "#10b981" },
        { name: "Crypto", value: 20, color: "#f7931a" },
        { name: "Cash", value: 10, color: "#f59e0b" },
      ],
    },
    {
      id: "value",
      name: "Value Investing",
      focus: "Undervalued companies with strong fundamentals",
      icon: <Landmark className="h-5 w-5 text-blue-700" />,
      tags: ["Stocks", "Value"],
      risk: "Moderate",
      value: "$5,678,910",
      return: "+8.7%",
      returnClass: "text-green-500",
      chartVariant: "default",
      allocation: [
        { name: "Finance", value: 35, color: "#3b82f6" },
        { name: "Industrial", value: 25, color: "#10b981" },
        { name: "Energy", value: 25, color: "#f59e0b" },
        { name: "Consumer", value: 15, color: "#ec4899" },
      ],
    },
  ]

  // Filter portfolios based on active filter and search query
  const filteredPortfolios = portfolios.filter((portfolio) => {
    // Filter by category
    if (activeFilter !== "all") {
      const filterMap = {
        stocks: ["Stocks"],
        crypto: ["Crypto"],
        income: ["Income"],
        global: ["Global"],
        "low-risk": ["Low"],
        "high-risk": ["High"],
      }

      const filterTerms = filterMap[activeFilter] || []

      // Check if portfolio matches the filter
      const matchesFilter = filterTerms.some((term) => {
        if (term === "Low" || term === "High") {
          return portfolio.risk.includes(term)
        }
        return portfolio.tags.includes(term)
      })

      if (!matchesFilter) return false
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
    <div id="login-modal" className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay */}
      <div
        id="login-modal-overlay"
        className="absolute inset-0 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      />

      {/* Replace the main container div with a full-screen tabbed interface */}
      {/* Replace the main container div with a full-screen tabbed interface */}
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
        <div className="relative z-10 flex border-b border-border/40 bg-background/60 backdrop-blur-md overflow-x-auto">
          {/* Main tabs */}
          <div className="flex">
            <button
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
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "signup"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
            <button
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
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "calculators"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("calculators")}
            >
              Calculators
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "news"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("news")}
            >
              Market News
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "education"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("education")}
            >
              Educational Resources
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "forum"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("forum")}
            >
              Community Forum
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "api"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("api")}
            >
              API Documentation
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "risk"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("risk")}
            >
              Risk Management
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "calendar"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              Economic Calendar
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "performance"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("performance")}
            >
              Performance Metrics
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "backtest"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("backtest")}
            >
              Backtesting
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "screener"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("screener")}
            >
              Asset Screener
            </button>
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
        <div className="flex-1 overflow-y-auto p-6 relative z-10">
          {activeTab === "login" && (
            <div className="max-w-md mx-auto">
              <Card>
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
            <div className="max-w-md mx-auto">
              <Card>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPortfolios
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((portfolio) => (
                      <Card key={portfolio.id} className="overflow-hidden h-full flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="flex items-center gap-2 text-base">
                                {portfolio.icon}
                                {portfolio.name}
                              </CardTitle>
                              <CardDescription className="line-clamp-2">{portfolio.focus}</CardDescription>
                            </div>
                            <Badge variant={getRiskVariant(portfolio.risk)}>{portfolio.risk}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 flex-grow">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="h-24">
                              <PerformanceChart days={30} variant={portfolio.chartVariant} className="h-full w-full" />
                            </div>
                            <div className="h-24 flex items-center justify-center">
                              <PieChart data={portfolio.allocation} height={90} width={90} />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {portfolio.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">Value</p>
                              <p className="text-lg font-bold">{portfolio.value}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Return</p>
                              <p className={`text-base font-semibold ${portfolio.returnClass}`}>{portfolio.return}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button
                            className="w-full"
                            onClick={() => startDemoAnimation(portfolio.id as DemoType)}
                            disabled={isLoading || demoAnimation}
                          >
                            {isLoading && activeDemo === portfolio.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Try This Demo
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>

                {/* Pagination */}
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

                <TabsContent value="forum" className="mt-4">
                  <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Community Forum</h2>
                    <p className="text-center text-muted-foreground mb-6">
                      Connect with other traders and discuss strategies
                    </p>
                    <div className="flex items-center justify-center">
                      <Button asChild>
                        <Link href="https://example.com/forum" target="_blank" rel="noopener noreferrer">
                          Visit the Forum
                        </Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="api" className="mt-4">
                  <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">API Documentation</h2>
                    <p className="text-center text-muted-foreground mb-6">
                      Learn how to integrate with our platform using our API
                    </p>
                    <div className="flex items-center justify-center">
                      <Button asChild>
                        <Link href="https://example.com/api" target="_blank" rel="noopener noreferrer">
                          View API Documentation
                        </Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="mt-4">
                  <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Risk Management</h2>
                    <p className="text-center text-muted-foreground mb-6">Learn about risk management strategies</p>
                    <div className="flex items-center justify-center">
                      <Button asChild>
                        <Link href="https://example.com/risk" target="_blank" rel="noopener noreferrer">
                          View Risk Management
                        </Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="calendar" className="mt-4">
                  <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Economic Calendar</h2>
                    <p className="text-center text-muted-foreground mb-6">Stay up-to-date with economic events</p>
                    <div className="flex items-center justify-center">
                      <Button asChild>
                        <Link href="https://example.com/calendar" target="_blank" rel="noopener noreferrer">
                          View Economic Calendar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="mt-4">
                  <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Performance Metrics</h2>
                    <p className="text-center text-muted-foreground mb-6">View performance metrics</p>
                    <div className="flex items-center justify-center">
                      <Button asChild>
                        <Link href="https://example.com/performance" target="_blank" rel="noopener noreferrer">
                          View Performance Metrics
                        </Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="backtest" className="mt-4">
                  <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Backtesting</h2>
                    <p className="text-center text-muted-foreground mb-6">Backtest your strategies</p>
                    <div className="flex items-center justify-center">
                      <Button asChild>
                        <Link href="https://example.com/backtest" target="_blank" rel="noopener noreferrer">
                          View Backtesting
                        </Link>
                      </Button>
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

      <CookieBanner />
    </div>
  )
}

