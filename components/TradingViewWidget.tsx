import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  theme?: 'light' | 'dark';
  interval?: string;
}

function TradingViewWidget({ symbol = 'NASDAQ:AAPL', theme = 'dark', interval = 'D' }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      
      // Format symbol for TradingView if it contains '/'
      const formattedSymbol = symbol.includes('/') 
        ? `CRYPTO:${symbol.replace('/', '')}`
        : `NASDAQ:${symbol}`;
      
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": formattedSymbol,
        "interval": interval,
        "timezone": "Etc/UTC",
        "theme": theme,
        "style": "1",
        "locale": "en",
        "hide_top_toolbar": true,
        "allow_symbol_change": true,
        "support_host": "https://www.tradingview.com"
      });
      
      container.current.appendChild(script);
    }
    
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, theme, interval]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
