import type { ReactNode } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav" 
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardFooter } from "@/components/dashboard-footer"
import { redirect } from "next/navigation"

interface ProtectedLayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const isAuthenticated = true // This would be a real auth check

  if (!isAuthenticated) {
    redirect("/home")
  }

  const navItems = [
    {
      href: "/home",
      title: "Dashboard",
    },
    {
      href: "/bots",
      title: "Trading Bots",
    },
    {
      href: "/orders",
      title: "Orders",
    },
    {
      href: "/news",
      title: "Market News",
    },
    {
      href: "/backtest",
      title: "Backtest",
    },
    {
      href: "/settings",
      title: "Settings",
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
          <DashboardNav items={navItems} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {/* Magazine Layout for Blog/Education Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </main>
      </div>
      
      <DashboardFooter className="mt-auto py-6 border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <p>Using Demo Data - Connect Alpaca API for live trading</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm hover:underline">
              Documentation
            </Link>
            <Link href="/support" className="text-sm hover:underline">
              Support
            </Link>
          </div>
        </div>
      </DashboardFooter>
    </div>
  )
}

