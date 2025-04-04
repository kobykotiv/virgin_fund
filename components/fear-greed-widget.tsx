"use client"

import { useEffect, useState } from "react"

export function FearGreedWidget() {
  const [fearGreedValue, setFearGreedValue] = useState(50)
  const [fearGreedLabel, setFearGreedLabel] = useState("Neutral")

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // For demo purposes, we're using a random value
    const fetchFearGreedIndex = () => {
      // Random value between 0 and 100
      const randomValue = Math.floor(Math.random() * 100)
      setFearGreedValue(randomValue)
      
      // Set the label based on the value
      if (randomValue <= 25) setFearGreedLabel("Extreme Fear")
      else if (randomValue <= 40) setFearGreedLabel("Fear")
      else if (randomValue <= 60) setFearGreedLabel("Neutral")
      else if (randomValue <= 80) setFearGreedLabel("Greed")
      else setFearGreedLabel("Extreme Greed")
    }

    fetchFearGreedIndex()
    
    // Simulate data updates
    const interval = setInterval(fetchFearGreedIndex, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Calculate the gauge position and color
  const gaugeRotation = (fearGreedValue / 100) * 180 - 90
  const gaugeColor = getColorForValue(fearGreedValue)
  
  function getColorForValue(value: number) {
    if (value <= 25) return "#FF4136" // Red for Extreme Fear
    if (value <= 40) return "#FF851B" // Orange for Fear
    if (value <= 60) return "#FFDC00" // Yellow for Neutral
    if (value <= 80) return "#2ECC40" // Green for Greed
    return "#3D9970" // Dark Green for Extreme Greed
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-xl font-bold mb-2">Crypto Fear & Greed Index</h3>
      
      <div className="relative w-48 h-24 mb-6">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Gauge background */}
          <div className="absolute top-0 left-0 w-full h-full bg-muted rounded-t-full"></div>
          
          {/* Gauge levels */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-1/5 h-full bg-red-500 opacity-20 rounded-tl-full"></div>
            <div className="absolute top-0 left-1/5 w-1/5 h-full bg-orange-400 opacity-20"></div>
            <div className="absolute top-0 left-2/5 w-1/5 h-full bg-yellow-400 opacity-20"></div>
            <div className="absolute top-0 left-3/5 w-1/5 h-full bg-green-400 opacity-20"></div>
            <div className="absolute top-0 left-4/5 w-1/5 h-full bg-green-600 opacity-20 rounded-tr-full"></div>
          </div>
          
          {/* Gauge needle */}
          <div 
            className="absolute bottom-0 left-1/2 w-1 h-24 bg-foreground origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${gaugeRotation}deg)` }}
          ></div>
          
          {/* Gauge center point */}
          <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-foreground transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold mb-1">{fearGreedValue}</div>
        <div className="text-lg font-medium" style={{ color: gaugeColor }}>{fearGreedLabel}</div>
      </div>
      
      <div className="w-full mt-6 grid grid-cols-5 text-xs text-center">
        <div className="text-red-500">Extreme<br/>Fear</div>
        <div className="text-orange-400">Fear</div>
        <div className="text-yellow-400">Neutral</div>
        <div className="text-green-400">Greed</div>
        <div className="text-green-600">Extreme<br/>Greed</div>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  )
}

