import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import { AlpacaProvider } from "@/context/alpaca-context";

export const metadata: Metadata = {
  title: "GenEric TraDer - Advanced Trading Platform",
  description:
    "Self-hostable finance application bridging bot-based trading and copy trading in an isolated environment",
  keywords: "trading, finance, bot trading, copy trading, automated trading, signals, prediction markets",
  authors: [{ name: "GenEric TraDer Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://generic-trader.com",
    title: "GenEric TraDer - Advanced Trading Platform",
    description: "Self-hostable finance application bridging bot-based trading and copy trading",
    siteName: "GenEric TraDer",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenEric TraDer - Advanced Trading Platform",
    description: "Self-hostable finance application bridging bot-based trading and copy trading",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AlpacaProvider>
          <ClientLayout>{children}</ClientLayout>
        </AlpacaProvider>
      </body>
    </html>
  );
}

import './globals.css'