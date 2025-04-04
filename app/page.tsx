import type { Metadata } from "next"
import ClientPage from "./clientpage"

export const metadata: Metadata = {
  title: "Virgin Fund : GenEric TraDer AI | Self-Hosted Automated Trading Platform",
  description:
    "Bridge the gap between bot-based trading and copy trading with our self-hosted, isolated trading platform. Connect to Alpaca Markets and CoinGecko for real-time data and paper trading.",
  keywords:
    "trading bot, automated trading, copy trading, self-hosted, crypto trading, stock trading, Alpaca Markets, CoinGecko, paper trading, algorithmic trading, fear greed index, trading signals, AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://virgin-fund.app",
    title: "Virgin Fund : GenEric TraDer AI | Self-Hosted Automated Trading Platform",
    description:
      "Bridge the gap between bot-based trading and copy trading with our self-hosted, isolated trading platform.",
    siteName: "Virgin Fund : GenEric TraDer AI",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Virgin Fund : GenEric TraDer AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virgin Fund : GenEric TraDer AI | Self-Hosted Automated Trading Platform",
    description:
      "Bridge the gap between bot-based trading and copy trading with our self-hosted, isolated trading platform.",
    images: ["/images/og-image.png"],
    creator: "@virginfund",
  },
}

export default function LandingPage() {
  return <ClientPage />
}

