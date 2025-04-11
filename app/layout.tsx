"use client"

import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import { Inter } from "next/font/google"
import { Providers } from "@/providers/providers"
import "./globals.css"
import { MockDataWarning } from '../components/mock-data-warning'
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { ContentProvider } from "@/providers/content-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Virgin Fund : GenEric TraDer AI",
//   description: "Self-hosted AI-powered automated trading platform",
//   keywords: "trading, finance, bot trading, copy trading, automated trading, signals, prediction markets, AI",
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://virgin-fund.com",
//     title: "Virgin Fund : GenEric TraDer AI",
//     description: "Self-hostable finance application bridging bot-based trading and copy trading",
//     siteName: "Virgin Fund : GenEric TraDer AI",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Virgin Fund : GenEric TraDer AI",
//     description: "Self-hostable finance application bridging bot-based trading and copy trading",
//   },
//     generator: 'v0.dev'
// }

/**
 * Root layout component that wraps all pages
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>GenEric TraDer - Automated Trading Platform</title>
        <meta name="description" content="AI-powered trading platform for automated portfolio management" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ContentProvider>
              {children}
              <Toaster />
              <MockDataWarning />
            </ContentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}