import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/providers/auth-provider"
import { PerformanceProvider } from "@/providers/performance-provider"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Virgin Fund : GenEric TraDer AI",
  description:
    "Self-hostable finance application bridging bot-based trading and copy trading in an isolated environment",
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <AuthProvider>
          <PerformanceProvider>
            {children}
          </PerformanceProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

