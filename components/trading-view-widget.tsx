"use client";

import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
}

function TradingViewWidget({ 
  symbol, 
  theme = 'light', 
  width = '100%', 
  height = 400 
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Format symbol for TradingView if it contains '/'
    const formattedSymbol = symbol.includes('/') 
      ? symbol.replace('/', '') // Convert BTC/USD to BTCUSD
      : symbol;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          autosize: true,
          symbol: formattedSymbol,
          interval: "D",
          timezone: "exchange",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current?.id,
        });
      }
    };
    
    containerRef.current.appendChild(script);
    
    return () => {
      if (containerRef.current) {
        const container = containerRef.current;
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, [symbol, theme]);

  return <div ref={containerRef} id={`tradingview_${symbol.replace('/', '')}`} style={{ width, height }} />;
}

// Use memo to prevent unnecessary re-renders
export default memo(TradingViewWidget);
