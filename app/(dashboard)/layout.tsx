import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import TradingPanel from "@/components/trading-panel"
import { MockDataWarning } from "@/components/mock-data-warning"

export const metadata: Metadata = {
  title: "OctoBot Dashboard",
  description: "Manage your automated trading bots and monitor performance",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <div className="dashboard-layout flex flex-col min-h-screen">
          <DashboardNav
            items={[
              { href: "/dashboard", title: "Overview" },
              { href: "/dashboard/portfolio", title: "Portfolio" },
              { href: "/dashboard/bots", title: "Bots" },
              { href: "/dashboard/settings", title: "Settings" }
            ]}
          />
          <main className="flex-1">{children}</main>
          <MockDataWarning />
          <TradingPanel />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
