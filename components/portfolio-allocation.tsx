"use client"
import { useEffect, useRef } from "react"

export function PortfolioAllocation() {
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

    // Portfolio allocation data
    const data = [
      { name: "Large Cap", value: 40, color: "rgba(66, 133, 244, 0.8)" },
      { name: "Mid Cap", value: 20, color: "rgba(15, 157, 88, 0.8)" },
      { name: "Small Cap", value: 15, color: "rgba(244, 180, 0, 0.8)" },
      { name: "Bonds", value: 15, color: "rgba(219, 68, 55, 0.8)" },
      { name: "Crypto", value: 5, color: "rgba(145, 68, 219, 0.8)" },
      { name: "Cash", value: 5, color: "rgba(68, 178, 219, 0.8)" }
    ]

    // Calculate total value for percentage
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw the donut chart
    const drawDonutChart = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 2 - 10

      // Draw the legend
      const drawLegend = () => {
        const legendY = centerY + radius + 20
        const legendItemHeight = 20
        const legendItemWidth = width / data.length
        
        data.forEach((item, index) => {
          const x = (index * legendItemWidth) + 10
          const y = legendY
          
          // Draw color box
          ctx.fillStyle = item.color
          ctx.fillRect(x, y, 10, 10)
          
          // Draw text
          ctx.fillStyle = 'rgb(var(--foreground-rgb))'
          ctx.font = '10px sans-serif'
          ctx.textAlign = 'left'
          ctx.fillText(`${item.name} (${item.value}%)`, x + 15, y + 9)
        })
      }

      // Clear the canvas
      ctx.clearRect(0, 0, width, height)

      // Draw each segment
      let startAngle = 0
      data.forEach(item => {
        // Calculate the angle for this segment
        const segmentAngle = (item.value / total) * 2 * Math.PI
        
        // Draw the segment
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle)
        ctx.closePath()
        
        // Fill the segment
        ctx.fillStyle = item.color
        ctx.fill()
        
        // Add a white stroke between segments
        ctx.strokeStyle = 'rgb(var(--background-rgb))'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Calculate angle for text
        const textAngle = startAngle + segmentAngle / 2
        
        // Only draw text in segment if there's enough space (value > 5%)
        if (item.value > 5) {
          // Calculate text position
          const textRadius = radius * 0.7
          const textX = centerX + Math.cos(textAngle) * textRadius
          const textY = centerY + Math.sin(textAngle) * textRadius
          
          // Draw text
          ctx.fillStyle = 'rgb(var(--background-rgb))'
          ctx.font = 'bold 12px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(`${item.value}%`, textX, textY)
        }
        
        // Update start angle for next segment
        startAngle += segmentAngle
      })
      
      // Draw center circle to create donut
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgb(var(--background-rgb))'
      ctx.fill()
      
      // Draw center text
      ctx.fillStyle = 'rgb(var(--foreground-rgb))'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Portfolio', centerX, centerY - 10)
      ctx.font = '12px sans-serif'
      ctx.fillText('Allocation', centerX, centerY + 10)
    }

    // Initial draw
    drawDonutChart()

    // Redraw on window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      canvas.style.width = `${canvas.offsetWidth}px`
      canvas.style.height = `${canvas.offsetHeight}px`
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      drawDonutChart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

