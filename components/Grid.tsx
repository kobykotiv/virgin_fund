"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface GridProps {
  items: any[]
}

const Grid: React.FC<GridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <h3>{item.name}</h3>
          </CardHeader>
          <CardContent>
            <p>{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Grid
