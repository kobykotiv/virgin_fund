import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"

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
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}

