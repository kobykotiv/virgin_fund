"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Narrow to non-null local aliases so class methods don't see these as possibly null
  const canvasEl = canvas as HTMLCanvasElement
  const ctxEl = ctx as CanvasRenderingContext2D

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles
    const particlesArray: Particle[] = []
    const numberOfParticles = 100
    const colors = ["rgba(66, 133, 244, 0.3)", "rgba(219, 68, 55, 0.3)", "rgba(244, 180, 0, 0.3)", "rgba(15, 157, 88, 0.3)"]

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
  this.x = Math.random() * canvasEl.width
  this.y = Math.random() * canvasEl.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

  if (this.x > canvasEl.width) this.x = 0
  else if (this.x < 0) this.x = canvasEl.width
  if (this.y > canvasEl.height) this.y = 0
  else if (this.y < 0) this.y = canvasEl.height
      }

      draw() {
  ctxEl.fillStyle = this.color
  ctxEl.beginPath()
  ctxEl.arc(this.x, this.y, this.size, 0, Math.PI * 2)
  ctxEl.fill()
      }
    }

    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }

    function animate() {
  ctxEl.clearRect(0, 0, canvasEl.width, canvasEl.height)
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }
      connectParticles()
      requestAnimationFrame(animate)
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            // Use a static color instead of CSS variables
            const opacity = 0.1 - distance / 1000
            ctxEl.strokeStyle = `rgba(59, 130, 246, ${opacity})` // Use a default blue color
            ctxEl.lineWidth = 1
            ctxEl.beginPath()
            ctxEl.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctxEl.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctxEl.stroke()
          }
        }
      }
    }

    init()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}


    // Create grid-like pattern representing trading charts
    class GridLine {
      x1: number
      y1: number
      x2: number
      y2: number
      color: string
      opacity: number
      
      canvas: HTMLCanvasElement;

      constructor(horizontal: boolean, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        if (horizontal) {
          this.x1 = 0
          this.x2 = this.canvas.width
          this.y1 = Math.random() * this.canvas.height
          this.y2 = this.y1
        } else {
          this.y1 = 0
          this.y2 = this.canvas.height
          this.x1 = Math.random() * this.canvas.width
          this.x2 = this.x1
        }
        this.color = "rgba(200, 200, 200, 0.2)" // Light gray color
        this.opacity = Math.random() * 0.5 + 0.1 // Random opacity between 0.1 and 0.6
      }

          draw(ctx: CanvasRenderingContext2D) {
          ctx.strokeStyle = this.color
          ctx.globalAlpha = this.opacity
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(this.x1, this.y1)
          ctx.lineTo(this.x2, this.y2)
          ctx.stroke()
          ctx.globalAlpha = 1 // Reset alpha
          }
        }