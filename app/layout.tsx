import React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import { Inter } from "next/font/google"
import { Providers } from "@/providers/providers"
import { LayoutProvider } from '@/components/layout/LayoutContext'
import "./globals.css"
import { MockDataWarning } from '../components/mock-data-warning'
import { ThemeProvider } from "@/providers/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Virgin Fund : GenEric TraDer AI",
  description: "Self-hosted AI-powered automated trading platform",
  keywords: "trading, finance, bot trading, copy trading, automated trading, signals, prediction markets, AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://virgin-fund.com",
    title: "Virgin Fund : GenEric TraDer AI",
    description: "Self-hostable finance application bridging bot-based trading and copy trading",
    siteName: "Virgin Fund : GenEric TraDer AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virgin Fund : GenEric TraDer AI",
    description: "Self-hostable finance application bridging bot-based trading and copy trading",
  },
    generator: 'v0.dev'
}

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
      <body className={inter.className}>
        <Providers>
          <LayoutProvider>
            {children}
            <MockDataWarning />
          </LayoutProvider>
        </Providers>
      </body>
    </html>
  )
}