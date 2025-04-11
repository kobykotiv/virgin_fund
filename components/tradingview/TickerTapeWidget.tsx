"use client";

import React, { useEffect, useRef, memo } from 'react';

interface TickerSymbol {
  proName: string;
  title: string;
}

interface TickerTapeWidgetProps {
  symbols?: TickerSymbol[];
  showSymbolLogo?: boolean;
  colorTheme?: "light" | "dark";
  isTransparent?: boolean;
  displayMode?: "adaptive" | "regular" | "compact";
  locale?: string;
}

// Default symbols from the user's snippet
const defaultSymbols: TickerSymbol[] = [
  { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500 Index" },
  { "proName": "FOREXCOM:NSXUSD", "title": "US 100 Cash CFD" },
  { "proName": "FX_IDC:EURUSD", "title": "EUR to USD" },
  { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
  { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" }
];

const TickerTapeWidget: React.FC<TickerTapeWidgetProps> = memo(({
  symbols = defaultSymbols,
  showSymbolLogo = true,
  colorTheme = "dark",
  isTransparent = false,
  displayMode = "adaptive",
  locale = "en",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Use a stable ID for the script
  const scriptId = `tradingview-ticker-tape-widget-script`; 

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    // Check if the script already exists
    if (document.getElementById(scriptId)) {
      // Optional: Update logic if needed, similar to MarketQuotesWidget
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';

    const config = {
      symbols,
      showSymbolLogo,
      isTransparent,
      displayMode,
      colorTheme,
      locale,
    };
    script.innerHTML = JSON.stringify(config);

    // Clear previous content and append script
    containerRef.current.innerHTML = ''; 
    containerRef.current.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
         existingScript.parentNode?.removeChild(existingScript);
      }
       if (containerRef.current) {
          containerRef.current.innerHTML = '';
       }
    };
    // Add props to dependency array
  }, [symbols, showSymbolLogo, colorTheme, isTransparent, displayMode, locale, scriptId]);

  return (
    // The outer div is provided by TradingView's embed code structure
    <div className="tradingview-widget-container">
      {/* The ref points to the inner div where the script injects the widget */}
      <div ref={containerRef} className="tradingview-widget-container__widget"></div>
      {/* Optional: Copyright can be added if needed, though Ticker Tape might not require it */}
      {/* <div className="tradingview-widget-copyright">...</div> */}
    </div>
  );
});

TickerTapeWidget.displayName = 'TickerTapeWidget';

export default TickerTapeWidget;
