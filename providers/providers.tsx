"use client"

import { ThemeProvider } from "next-themes"
import { AuthProvider } from "./auth-provider"
import { SubscriptionProvider } from "./subscription-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <SubscriptionProvider>
          {children}
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
