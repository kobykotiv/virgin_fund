"use client"

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewWidgetProps {
  symbol: string
  theme?: "light" | "dark"
  width?: string | number
  height?: string | number
  interval?: string
  timezone?: string
}

export function TradingViewWidget({
  symbol = "NASDAQ:AAPL",
  theme = "dark",
  width = "100%",
  height = 500,
  interval = "D",
  timezone = "Etc/UTC"
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: container.current?.id,
          symbol,
          interval,
          timezone,
          theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          width,
          height
        })
      }
    }
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [symbol, theme, width, height, interval, timezone])

  return <div id="tradingview_widget" ref={container} />
}
