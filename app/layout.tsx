import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import { Inter } from "next/font/google"
import { Providers } from "@/providers/providers"
import "./globals.css"
import { MockDataWarning } from '../components/mock-data-warning'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Virgin Fund : GenEric TraDer AI",
  description: "Self-hosted finance application",
  keywords: "trading, finance, bot trading, copy trading, automated trading, signals, prediction markets, AI",
  authors: [{ name: "Virgin Fund Team" }],
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
          {children}
          <MockDataWarning />
        </Providers>
      </body>
    </html>
  )
}