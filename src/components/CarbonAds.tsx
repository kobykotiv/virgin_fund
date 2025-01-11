import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    _carbonads?: {
      refresh: () => void;
    };
  }
}

export function CarbonAds() {
  const location = useLocation();

  useEffect(() => {
    const isCarbonExist = document.querySelector("#carbonads");

    if (isCarbonExist && window._carbonads) {
      window._carbonads.refresh();
      return;
    }

    const script = document.createElement("script");
    script.src = "//cdn.carbonads.com/carbon.js?serve=CVAIKKQM&placement=carbonadsnet";
    script.id = "_carbonads_js";
    script.async = true;

    const container = document.getElementById("carbon-container");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, [location.pathname]);

  return (
    <div 
      id="carbon-container" 
      className="fixed bottom-4 right-4 z-50 bg-card rounded-lg shadow-lg overflow-hidden"
    />
  );
}
