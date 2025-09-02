"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface PerformanceChartProps {
  days: number
  variant?: "default" | "Bitcoin" | "crypto" | "defi"
  className?: string
}

export function PerformanceChart({ days, variant = "default", className }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    canvas.style.width = `${canvas.offsetWidth}px`
    canvas.style.height = `${canvas.offsetHeight}px`
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Generate data based on the variant
    const generateData = () => {
      const data = []
      const trend = variant === "crypto" ? 0.6 : variant === "defi" ? 0.4 : 0.2
      const volatility = variant === "crypto" ? 4 : variant === "defi" ? 3 : 2
      
      let value = 100
      for (let i = 0; i < days; i++) {
        // Random walk with trend
        const change = (Math.random() - 0.5 + trend / 10) * volatility
        value = Math.max(50, value + change)
        data.push(value)
      }
      return data
    }

    const data = generateData()
    
    // Function to determine primary color - using fixed colors instead of CSS vars
    const getPrimaryColor = () => {
      // Check for dark mode by looking at the background color
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // Fixed fallback colors
      return isDarkMode ? "#3b82f6" : "#2563eb" // Blue shades for light/dark
    }
    
    // Draw chart
    const drawChart = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const padding = 30

      ctx.clearRect(0, 0, width, height)

      // Calculate min and max values
      const max = Math.max(...data) * 1.1
      const min = Math.min(...data) * 0.9

      // Draw grid lines
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)' // Fixed color for grid
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (height - 2 * padding) * (1 - i / 5)
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }

      // Vertical grid lines
      for (let i = 0; i <= 6; i++) {
        const x = padding + (width - 2 * padding) * (i / 6)
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, height - padding)
        ctx.stroke()
      }

      // Draw the chart line
      const primaryColor = getPrimaryColor()
      ctx.strokeStyle = primaryColor
      ctx.lineWidth = 2
      ctx.beginPath()

      // Create gradient for area under the line
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
      gradient.addColorStop(0, `${primaryColor}33`) // Add transparency in hex
      gradient.addColorStop(1, `${primaryColor}00`) // Fully transparent

      // Draw each data point
      data.forEach((value, index) => {
        const x = padding + (width - 2 * padding) * (index / (data.length - 1))
        const y = padding + (height - 2 * padding) * (1 - (value - min) / (max - min))
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()

      // Fill area under the line
      ctx.lineTo(width - padding, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw data points
      ctx.fillStyle = primaryColor
      data.forEach((value, index) => {
        // Only draw some points for better visual
        if (index % Math.ceil(data.length / 10) === 0 || index === data.length - 1) {
          const x = padding + (width - 2 * padding) * (index / (data.length - 1))
          const y = padding + (height - 2 * padding) * (1 - (value - min) / (max - min))
          
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    // Initial draw
    drawChart()

    // Redraw on window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      canvas.style.width = `${canvas.offsetWidth}px`
      canvas.style.height = `${canvas.offsetHeight}px`
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      drawChart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [days, variant])

  return <canvas ref={canvasRef} className={cn("w-full h-full", className)} />
}

