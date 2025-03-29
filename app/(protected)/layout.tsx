import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { ThemeProvider } from "@/components/theme-provider"
import { redirect } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect("/login")
  }

  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0">
          <DashboardNav />
        </aside>

        {/* Main content */}
        <div className="md:pl-64 flex-1">
          <DashboardHeader />
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

