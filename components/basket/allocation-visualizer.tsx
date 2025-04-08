"use client"

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BasketAllocation } from '@/lib/basket-trading'
import { Position } from '@/types/bot'
import * as d3 from 'd3'

interface AllocationVisualizerProps {
  positions: Position[]
  allocations: BasketAllocation[]
  correlationMatrix?: number[][]
}

export function AllocationVisualizer({ 
  positions, 
  allocations,
  correlationMatrix 
}: AllocationVisualizerProps) {
  const treemapRef = useRef<SVGSVGElement>(null)
  const heatmapRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!treemapRef.current) return

    // Clear previous visualization
    d3.select(treemapRef.current).selectAll('*').remove()

    const width = 600
    const height = 400

    const treemapData = {
      name: 'portfolio',
      children: allocations.map(a => ({
        name: a.symbol,
        value: a.targetWeight * 100,
        current: a.currentWeight * 100,
        deviation: Math.abs(a.targetWeight - a.currentWeight) * 100
      }))
    }

    const treemap = d3.treemap()
      .size([width, height])
      .padding(1)
      .round(true)

    const root = d3.hierarchy(treemapData)
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    treemap(root)

    const svg = d3.select(treemapRef.current)
      .attr('width', width)
      .attr('height', height)

    const cell = svg.selectAll('g')
      .data(root.leaves())
      .enter().append('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)

    cell.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => d3.interpolateRdYlBu(1 - d.data.deviation / 10))

    cell.append('text')
      .attr('x', 5)
      .attr('y', 15)
      .text(d => `${d.data.name}\n${d.data.value.toFixed(1)}%`)
      .attr('font-size', '12px')
      .attr('fill', 'white')
  }, [positions, allocations])

  useEffect(() => {
    if (!heatmapRef.current || !correlationMatrix) return

    const width = 400
    const height = 400
    const margin = 40

    const svg = d3.select(heatmapRef.current)
      .attr('width', width + margin * 2)
      .attr('height', height + margin * 2)
      .append('g')
      .attr('transform', `translate(${margin},${margin})`)

    const x = d3.scaleBand()
      .range([0, width])
      .domain(allocations.map(a => a.symbol))
      .padding(0.05)

    const y = d3.scaleBand()
      .range([height, 0])
      .domain(allocations.map(a => a.symbol))
      .padding(0.05)

    const color = d3.scaleSequential()
      .interpolator(d3.interpolateRdBu)
      .domain([-1, 1])

    // Add X axis
    svg.append('g')
      .style('font-size', 15)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')

    // Add Y axis
    svg.append('g')
      .style('font-size', 15)
      .call(d3.axisLeft(y))

    // Add correlation cells
    correlationMatrix.forEach((row, i) => {
      row.forEach((correlation, j) => {
        svg.append('rect')
          .attr('x', x(allocations[j].symbol))
          .attr('y', y(allocations[i].symbol))
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .style('fill', color(correlation))
      })
    })
  }, [correlationMatrix])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <svg ref={treemapRef} />
        </CardContent>
      </Card>

      {correlationMatrix && (
        <Card>
          <CardHeader>
            <CardTitle>Correlation Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <svg ref={heatmapRef} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
