"use client"

import { useEffect, useRef } from 'react'

interface VectorBackgroundProps {
  className?: string
  density?: number
  color?: string
  animate?: boolean
}

export function VectorBackground({
  className = "",
  density = 30,
  color = "currentColor",
  animate = true
}: VectorBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Make canvas full size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    // Create grid of points
    const points = []
    const spacing = Math.max(canvas.width, canvas.height) / density
    
    for (let x = 0; x < canvas.width / window.devicePixelRatio; x += spacing) {
      for (let y = 0; y < canvas.height / window.devicePixelRatio; y += spacing) {
        points.push({
          x: x + (Math.random() * spacing - spacing / 2),
          y: y + (Math.random() * spacing - spacing / 2),
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1
        })
      }
    }

    // Animation loop
    let animationId: number
    
    const drawLines = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
      
      ctx.strokeStyle = color
      ctx.lineWidth = 0.2
      ctx.globalAlpha = 0.15
      
      // Draw connections
      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        
        // Update point position if animation is enabled
        if (animate) {
          point.x += point.vx
          point.y += point.vy
          
          // Boundary check
          if (point.x < 0 || point.x > canvas.width / window.devicePixelRatio) point.vx *= -1
          if (point.y < 0 || point.y > canvas.height / window.devicePixelRatio) point.vy *= -1
        }
        
        // Connect to nearby points
        for (let j = i + 1; j < points.length; j++) {
          const nextPoint = points[j]
          
          const dx = point.x - nextPoint.x
          const dy = point.y - nextPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < spacing * 1.5) {
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(nextPoint.x, nextPoint.y)
            ctx.stroke()
          }
        }
      }
      
      animationId = requestAnimationFrame(drawLines)
    }
    
    drawLines()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [density, color, animate])

  return (
    <canvas 
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  )
}
