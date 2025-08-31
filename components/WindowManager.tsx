"use client"

import React, { useState, useCallback, createContext, useContext } from 'react'
import { Window } from './Window'
import { Taskbar } from './Taskbar'

interface WindowState {
  id: string
  title: string
  component: React.ComponentType
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface WindowManagerContextType {
  openWindow: (id: string, title: string, component: React.ComponentType) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  windows: WindowState[]
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null)

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext)
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider')
  }
  return context
}

interface WindowManagerProps {
  children?: React.ReactNode
}

export const WindowManager: React.FC<WindowManagerProps> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [nextZIndex, setNextZIndex] = useState(1)

  const openWindow = useCallback((id: string, title: string, component: React.ComponentType) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        // If window exists, focus it
        const maxZ = Math.max(...prev.map(w => w.zIndex))
        return prev.map(w =>
          w.id === id
            ? { ...w, isMinimized: false, zIndex: maxZ + 1 }
            : w
        )
      } else {
        // Create new window
        const maxZ = Math.max(0, ...prev.map(w => w.zIndex))
        return [...prev, {
          id,
          title,
          component,
          isMinimized: false,
          isMaximized: false,
          zIndex: maxZ + 1,
          position: { x: 100 + prev.length * 20, y: 100 + prev.length * 20 },
          size: { width: 600, height: 400 }
        }]
      }
    })
    setNextZIndex(prev => prev + 1)
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex))
      return prev.map(w =>
        w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
      )
    })
  }, [])

  const minimizeAll = useCallback(() => {
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })))
  }, [])

  const contextValue: WindowManagerContextType = {
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    windows
  }

  const openWindows = windows.filter(w => !w.isMinimized)

  return (
    <WindowManagerContext.Provider value={contextValue}>
      <div className="relative w-full h-screen overflow-hidden">
        {children}
        {windows.map(window => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            isMinimized={window.isMinimized}
            isMaximized={window.isMaximized}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            zIndex={window.zIndex}
            initialPosition={window.position}
            initialSize={window.size}
          >
            <window.component />
          </Window>
        ))}
        <Taskbar
          openWindows={openWindows}
          onWindowClick={focusWindow}
          onMinimizeAll={minimizeAll}
          onCloseWindow={closeWindow}
        />
      </div>
    </WindowManagerContext.Provider>
  )
}
