import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "./ClientLayout"
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Virgin Fund",
  description: "Your investment platform",
  keywords: "trading, finance, bot trading, copy trading, automated trading, signals, prediction markets, AI",
  authors: [{ name: "Virgin Fund Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://virgin-fund.vercel.app",
    title: "Virgin Fund : GenEric TraDer AI",
    description: "Self-hostable finance application bridging bot-based trading and copy trading",
    siteName: "Virgin Fund : GenEric TraDer AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virgin Fund : GenEric TraDer AI",
    description: "Self-hostable finance application bridging bot-based trading and copy trading",
  },
    // generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}