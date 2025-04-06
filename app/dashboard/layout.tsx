import type { ReactNode } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const dashboardNavItems = [
    {
      href: "/dashboard",
      title: "Overview",
    },
    {
      href: "/dashboard/custom-signals",
      title: "Custom Signals",
    },
    {
      href: "/dashboard/custom-signals/builder",
      title: "Signal Builder",
    },
    {
      href: "/dashboard/custom-signals/backtest",
      title: "Backtest",
    },
    {
      href: "/dashboard/calculators/savings",
      title: "Savings Calculator",
    },
    {
      href: "/dashboard/calculators/compound-interest",
      title: "Compound Interest",
    },
    {
      href: "/dashboard/calculators/inflation",
      title: "Inflation Calculator",
    },
    {
      href: "/dashboard/calculators/retirement",
      title: "Retirement Calculator",
    },
    {
      href: "/dashboard/portfolio",
      title: "Portfolio",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <h1 className="text-xl font-bold">Virgin Fund</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserAccountNav />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <DashboardNav items={dashboardNavItems} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">{children}</main>
      </div>
      
      {/* Dashboard Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col md:flex-row items-center justify-between py-4 text-sm">
          <div className="flex items-center space-x-4">
            <Link href="/" className="font-medium hover:underline">
              Home
            </Link>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/docs" className="hover:underline">
              Documentation
            </Link>
            <Link href="/support" className="hover:underline">
              Support
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <p className="text-muted-foreground">
              Market data provided by <span className="font-medium">Alpaca</span>
            </p>
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} Virgin Fund. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

