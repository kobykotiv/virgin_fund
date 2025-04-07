"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface PortfolioLineChartProps {
  data: { timestamp: string; value: number }[]
  className?: string
  variant?: "up" | "volatile" | "down"
  showTooltip?: boolean
}

export function PortfolioLineChart({ 
  data, 
  className = "", 
  variant = "up",
  showTooltip = false,
}: PortfolioLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  
  // Calculate color gradient based on variant
  const getGradient = () => {
    switch (variant) {
      case "up":
        return ["rgba(34, 197, 94, 0.8)", "rgba(34, 197, 94, 0.2)"]
      case "down":
        return ["rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.2)"]
      case "volatile":
        return ["rgba(249, 115, 22, 0.8)", "rgba(249, 115, 22, 0.2)"]
      default:
        return ["rgba(34, 197, 94, 0.8)", "rgba(34, 197, 94, 0.2)"]
    }
  }

  const getLineColor = () => {
    switch (variant) {
      case "up":
        return "#22c55e" // green-500
      case "down":
        return "#ef4444" // red-500
      case "volatile":
        return "#f97316" // orange-500
      default:
        return "#22c55e" // green-500
    }
  }

  useEffect(() => {
    if (!svgRef.current || !data || data.length < 2) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Set dimensions
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Parse data
    const parseDate = d3.isoParse
    const parsedData = data.map(d => ({
      date: parseDate(d.timestamp) || new Date(),
      value: d.value
    }))

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(parsedData, d => d.value) as number * 0.95, 
        d3.max(parsedData, d => d.value) as number * 1.05
      ])
      .range([innerHeight, 0])

    // Create the chart group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Add gradient
    const gradientColors = getGradient()
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", `line-gradient-${variant}`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", gradientColors[0])

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", gradientColors[1])

    // Create line
    const line = d3.line<{ date: Date, value: number }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX)

    // Create area
    const area = d3.area<{ date: Date, value: number }>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX)

    // Add area path
    g.append("path")
      .datum(parsedData)
      .attr("fill", `url(#line-gradient-${variant})`)
      .attr("d", area)

    // Add line path
    const path = g.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", getLineColor())
      .attr("stroke-width", 2)
      .attr("d", line)

    // Add axes only if chart is large enough and showTooltip is true
    if (showTooltip && innerWidth > 200 && innerHeight > 100) {
      // Add x-axis
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => {
          const date = new Date(d as Date)
          return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
        }))
        .attr("font-size", "10px")
        .attr("color", "var(--muted-foreground)")

      // Add y-axis
      g.append("g")
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `$${(+d).toLocaleString(undefined, { maximumFractionDigits: 0 })}`))
        .attr("font-size", "10px")
        .attr("color", "var(--muted-foreground)")

      // Add tooltip
      const tooltip = d3.select("body").append("div")
        .attr("class", "chart-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "var(--background)")
        .style("border", "1px solid var(--border)")
        .style("border-radius", "4px")
        .style("padding", "8px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "100")

      // Create overlay for tooltip
      g.append("rect")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mousemove", function(event) {
          const [mouseX] = d3.pointer(event)
          const date = xScale.invert(mouseX)
          
          // Find the closest data point
          const bisect = d3.bisector((d: { date: Date }) => d.date).left
          const index = bisect(parsedData, date, 1)
          const a = parsedData[index - 1]
          const b = parsedData[index] || a
          const point = date.getTime() - a.date.getTime() > b.date.getTime() - date.getTime() ? b : a
          
          // Calculate position
          const x = xScale(point.date)
          const y = yScale(point.value)
          
          // Update tooltip
          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .html(`
              <div>
                <div><strong>Date:</strong> ${point.date.toLocaleDateString()}</div>
                <div><strong>Value:</strong> $${point.value.toLocaleString()}</div>
              </div>
            `)
          
          // Add vertical line at data point
          g.selectAll(".tooltip-line").remove()
          g.append("line")
            .attr("class", "tooltip-line")
            .attr("x1", x)
            .attr("y1", 0)
            .attr("x2", x)
            .attr("y2", innerHeight)
            .attr("stroke", "var(--muted)")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "3,3")
          
          // Add point at data location
          g.selectAll(".tooltip-point").remove()
          g.append("circle")
            .attr("class", "tooltip-point")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 4)
            .attr("fill", getLineColor())
            .attr("stroke", "white")
            .attr("stroke-width", 2)
        })
        .on("mouseout", function() {
          tooltip.style("visibility", "hidden")
          g.selectAll(".tooltip-line").remove()
          g.selectAll(".tooltip-point").remove()
        })
    }

    // Cleanup
    return () => {
      d3.select("body").selectAll(".chart-tooltip").remove()
    }
  }, [data, variant, showTooltip])

  return (
    <div className={`w-full h-full ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  )
}
