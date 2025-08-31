"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"

type LayoutMode = "responsive" | "grid" | "desktop"
const STORAGE_KEY = "vf:layout"

const LayoutContext = createContext<{
  mode: LayoutMode
  setMode: (m: LayoutMode) => void
}>({ mode: "responsive", setMode: () => {} })

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LayoutMode>("responsive")
  useEffect(() => {
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) || "responsive") as LayoutMode
      setModeState(stored)
    } catch (e) {
      setModeState("responsive")
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as LayoutMode | undefined
      if (detail) setMode(detail)
    }
    window.addEventListener("vf:layout", handler as EventListener)
    return () => window.removeEventListener("vf:layout", handler as EventListener)
  }, [])

  const setMode = (m: LayoutMode) => {
    setModeState(m)
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch (e) {
      /* ignore */
    }
  }

  return <LayoutContext.Provider value={{ mode, setMode }}>{children}</LayoutContext.Provider>
}

export const useLayout = () => useContext(LayoutContext)
