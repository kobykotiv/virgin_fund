import type { ReactNode } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardFooter } from "@/components/dashboard-footer"
import TickerTapeWidget from "@/components/tradingview/TickerTapeWidget" // Import the widget

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
      {/* Add Ticker Tape below header */}
      <div className="w-full">
        <TickerTapeWidget colorTheme="dark" /> {/* Use default props or customize */}
      </div>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <DashboardNav items={dashboardNavItems} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">{children}</main>
      </div>
      
      {/* Add the new dashboard footer */}
      <DashboardFooter />
    </div>
  )
}
