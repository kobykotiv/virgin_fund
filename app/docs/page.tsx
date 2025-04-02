import { Metadata } from "next"
import { DocContent } from "@/components/docs/doc-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Book, Code, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation - Virgin Fund",
  description: "Documentation for the Virgin Fund automated trading platform",
}

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Documentation
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Welcome to the Virgin Fund documentation. Learn how to use our automated trading platform.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Getting Started</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>Learn the basics and set up your account</CardDescription>
            <Link 
              href="/docs/getting-started" 
              className="mt-3 inline-flex items-center text-sm font-medium text-primary"
            >
              Read guide <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Reference</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>Explore our API endpoints and integration options</CardDescription>
            <Link 
              href="/docs/api-routes" 
              className="mt-3 inline-flex items-center text-sm font-medium text-primary"
            >
              View API docs <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Management</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>Learn how to manage your portfolios effectively</CardDescription>
            <Link 
              href="/docs/portfolio-management" 
              className="mt-3 inline-flex items-center text-sm font-medium text-primary"
            >
              Explore guides <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Platform Overview
        </h2>
        <p className="mt-4 text-muted-foreground">
          Virgin Fund is a professional-grade algorithmic trading platform designed for the modern investor. 
          Our platform allows you to build, test, and automate sophisticated trading strategies with ease.
        </p>
        
        <div className="mt-6 space-y-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Key Features</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>Create and manage multiple portfolios with different strategies</li>
            <li>Build custom trading bots with our visual strategy builder</li>
            <li>Backtest your strategies against historical market data</li>
            <li>Set comprehensive risk controls to protect your investments</li>
            <li>Track performance with detailed analytics and reporting</li>
            <li>Connect to multiple exchanges and data providers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
