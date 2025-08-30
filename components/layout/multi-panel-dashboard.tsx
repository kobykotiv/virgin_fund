"use client"

import { useState, useRef } from "react"
import { motion, PanInfo } from "framer-motion"
import { GripVertical, X, Maximize2, Minimize2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Panel {
  id: string
  title: string
  component: React.ReactNode
  width: number
  minWidth: number
  maxWidth: number
  visible: boolean
  defaultWidth?: number
}

interface MultiPanelDashboardProps {
  panels: Panel[]
  onPanelResize?: (panelId: string, newWidth: number) => void
  onPanelToggle?: (panelId: string) => void
  onResetLayout?: () => void
  className?: string
}

export function MultiPanelDashboard({
  panels,
  onPanelResize,
  onPanelToggle,
  onResetLayout,
  className
}: MultiPanelDashboardProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [localPanels, setLocalPanels] = useState<Panel[]>(panels)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (panelId: string) => {
    setDragging(panelId)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (dragging) {
      const container = containerRef.current
      if (container) {
        const containerRect = container.getBoundingClientRect()
        const panel = localPanels.find(p => p.id === dragging)
        if (panel) {
          const newWidth = Math.max(
            panel.minWidth,
            Math.min(
              panel.maxWidth,
              panel.width + info.delta.x
            )
          )

          const updatedPanels = localPanels.map(p =>
            p.id === dragging ? { ...p, width: newWidth } : p
          )
          setLocalPanels(updatedPanels)
          onPanelResize?.(dragging, newWidth)
        }
      }
      setDragging(null)
    }
  }

  const handlePanelToggle = (panelId: string) => {
    const updatedPanels = localPanels.map(p =>
      p.id === panelId ? { ...p, visible: !p.visible } : p
    )
    setLocalPanels(updatedPanels)
    onPanelToggle?.(panelId)
  }

  const handleResetLayout = () => {
    const resetPanels = localPanels.map(p => ({
      ...p,
      width: p.defaultWidth || p.width,
      visible: true
    }))
    setLocalPanels(resetPanels)
    onResetLayout?.()
  }

  const visiblePanels = localPanels.filter(panel => panel.visible)

  if (visiblePanels.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <GripVertical className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">No Panels Visible</h3>
                <p className="text-sm text-muted-foreground">
                  Enable panels from the View menu or reset the layout
                </p>
              </div>
              <Button onClick={handleResetLayout} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Layout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("flex h-full bg-background", className)}>
      {visiblePanels.map((panel, index) => (
        <motion.div
          key={panel.id}
          className="flex"
          style={{ width: panel.width }}
          drag="x"
          dragConstraints={{
            left: panel.minWidth - panel.width,
            right: panel.maxWidth - panel.width
          }}
          dragElastic={0}
          onDragStart={() => handleDragStart(panel.id)}
          onDragEnd={handleDragEnd}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="flex-1 m-2 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3">
              <CardTitle className="text-sm font-medium truncate">
                {panel.title}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePanelToggle(panel.id)}
                  className="h-6 w-6 p-0 hover:bg-accent"
                  title="Minimize Panel"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4 h-full overflow-auto">
              <div className="h-full">
                {panel.component}
              </div>
            </CardContent>
          </Card>

          {index < visiblePanels.length - 1 && (
            <div
              className="flex items-center justify-center w-2 bg-border hover:bg-accent cursor-col-resize transition-colors"
              title="Drag to resize"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </motion.div>
      ))}

      {/* Layout Controls */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetLayout}
          className="h-8 px-3 text-xs shadow-lg"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset Layout
        </Button>
      </div>
    </div>
  )
}
