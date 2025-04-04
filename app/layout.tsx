import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}



import './globals.css'