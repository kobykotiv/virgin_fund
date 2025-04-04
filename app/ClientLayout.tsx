"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { SubscriptionProvider } from "@/providers/subscription-provider"
import { Toaster } from "@/components/ui/toaster"
import { CookieBanner } from "@/components/cookie-banner"

import './globals.css' //add import here

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <SubscriptionProvider>
          {children}
          <Toaster />
          <CookieBanner />
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

