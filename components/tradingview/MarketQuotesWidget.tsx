"use client";

import React, { useEffect, useRef, memo } from 'react';

// Define the structure for symbolsGroups based on the provided snippet
interface SymbolInfo {
  name: string;
  displayName: string;
}

interface SymbolsGroup {
  name: string;
  originalName: string;
  symbols: SymbolInfo[];
}

interface MarketQuotesWidgetProps {
  width?: number | string; // Allow string for percentages like "100%"
  height?: number | string;
  symbolsGroups?: SymbolsGroup[];
  showSymbolLogo?: boolean;
  colorTheme?: "light" | "dark";
  isTransparent?: boolean;
  locale?: string;
  // backgroundColor is part of the script config, not a direct prop here
}

// Default symbols groups from the user's snippet
const defaultSymbolsGroups: SymbolsGroup[] = [
    {
      "name": "Indices",
      "originalName": "Indices",
      "symbols": [
        { "name": "FOREXCOM:SPXUSD", "displayName": "S&P 500 Index" },
        { "name": "FOREXCOM:NSXUSD", "displayName": "US 100 Cash CFD" },
        { "name": "FOREXCOM:DJI", "displayName": "Dow Jones Industrial Average Index" },
        { "name": "INDEX:NKY", "displayName": "Japan 225" },
        { "name": "INDEX:DEU40", "displayName": "DAX Index" },
        { "name": "FOREXCOM:UKXGBP", "displayName": "FTSE 100 Index" }
      ]
    },
    {
      "name": "Forex",
      "originalName": "Forex",
      "symbols": [
        { "name": "FX:EURUSD", "displayName": "EUR to USD" },
        { "name": "FX:GBPUSD", "displayName": "GBP to USD" },
        { "name": "FX:USDJPY", "displayName": "USD to JPY" },
        { "name": "FX:USDCHF", "displayName": "USD to CHF" },
        { "name": "FX:AUDUSD", "displayName": "AUD to USD" },
        { "name": "FX:USDCAD", "displayName": "USD to CAD" }
      ]
    },
    // Add other default groups if needed (Futures, Bonds)
];


const MarketQuotesWidget: React.FC<MarketQuotesWidgetProps> = memo(({
  width = "100%", // Default to 100% width
  height = 550,
  symbolsGroups = defaultSymbolsGroups,
  showSymbolLogo = true,
  colorTheme = "dark",
  isTransparent = false,
  locale = "en",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Use a stable ID for the script based on component instance or a fixed string if only one instance expected
  const scriptId = `tradingview-market-quotes-widget-script`; 

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Check if the script already exists
    if (document.getElementById(scriptId)) {
        // Optional: Update existing script if props change significantly, 
        // but TradingView widgets often handle this internally or require re-initialization.
        // For simplicity, we'll assume it doesn't need updates or the component remounts on major changes.
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';

    const config = {
      width,
      height,
      symbolsGroups,
      showSymbolLogo,
      isTransparent,
      colorTheme,
      locale,
      // Determine backgroundColor based on theme if not transparent
      backgroundColor: isTransparent ? undefined : (colorTheme === 'dark' ? "#131722" : "#ffffff"), 
    };
    script.innerHTML = JSON.stringify(config);

    // Clear previous widget content before appending new script
    containerRef.current.innerHTML = ''; 
    containerRef.current.appendChild(script);

    // Cleanup function: Remove the script when the component unmounts
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        // Check if parentNode exists before trying to remove
        existingScript.parentNode?.removeChild(existingScript);
      }
       // Also clear the container's content
       if (containerRef.current) {
          containerRef.current.innerHTML = '';
       }
    };
    // Add all props to dependency array to re-run effect if they change
  }, [width, height, symbolsGroups, showSymbolLogo, colorTheme, isTransparent, locale, scriptId]); 

  return (
    <div className="tradingview-widget-container" style={{ height: height, width: width }}>
      {/* The ref is now on the inner div where the script should inject the widget */}
      <div ref={containerRef} className="tradingview-widget-container__widget" style={{ height: `calc(${typeof height === 'number' ? `${height}px` : height} - 32px)`, width: '100%' }}></div>
      <div className="tradingview-widget-copyright" style={{ height: '32px', lineHeight: '32px', width: '100%', textAlign: 'center', verticalAlign: 'middle' }}>
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" style={{ textDecoration: 'none', color: 'rgba(173, 181, 189, 1)' }}>
          <span style={{ color: '#2962FF' }}>Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
});

MarketQuotesWidget.displayName = 'MarketQuotesWidget';

export default MarketQuotesWidget;
