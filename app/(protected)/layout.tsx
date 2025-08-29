import type { ReactNode } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav" 
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardFooter } from "@/components/dashboard-footer"
import { redirect } from "next/navigation"

// Extract navigation items to server component
const navigationItems = [
  {
    href: "/home",
    title: "Dashboard",
  },
  {
    href: "/my-bots",
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

interface ProtectedLayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const isAuthenticated = true // This would be a real auth check

  if (!isAuthenticated) {
    redirect("/home")
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">Virgin Fund</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserAccountNav />
          </div>
        </div>
      </header>

      <div className="flex-1 container flex-grow py-6">
        <div className="grid gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
            <DashboardNav items={navigationItems} />
          </aside>
          <main className="flex w-full flex-col">
            <div className="magazine-grid">
              {children}
            </div>
          </main>
        </div>
      </div>

      <DashboardFooter />
    </div>
  )
}

