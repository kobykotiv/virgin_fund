/**
 * hooks/use-signals.ts
 *
 * Lightweight React hook for managing Signal objects with localStorage persistence,
 * optimistic updates, CSV export and simple history generation.
 *
 * This is intentionally self-contained so it can be used from pages/signal-builder.tsx
 * without requiring remote APIs. Swap persistence functions to call your backend when
 * you decide to enable server-sync.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Signal,
  SignalFormValues,
  SignalHistoryRow,
  SignalStatus,
} from '../types/signal'

const STORAGE_KEY = 'vf:signals:v1'
const HISTORY_KEY = 'vf:signals:history:v1'

function readSignalsFromStorage(): Signal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Signal[]
  } catch {
    return []
  }
}

function writeSignalsToStorage(signals: Signal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals))
}

function readHistoryFromStorage(): SignalHistoryRow[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SignalHistoryRow[]
  } catch {
    return []
  }
}

function writeHistoryToStorage(rows: SignalHistoryRow[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(rows))
}

/** Simple CSV escaping */
function escapeCsv(value: unknown) {
  if (value == null) return ''
  const s = String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/**
 * useSignals hook
 *
 * Returns signals plus CRUD helpers, export and history helpers.
 */
export function useSignals() {
  const [signals, setSignals] = useState<Signal[]>(() =>
    typeof window === 'undefined' ? [] : readSignalsFromStorage()
  )
  const [history, setHistory] = useState<SignalHistoryRow[]>(() =>
    typeof window === 'undefined' ? [] : readHistoryFromStorage()
  )
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // initialize from storage on mount
    try {
      setSignals(readSignalsFromStorage())
      setHistory(readHistoryFromStorage())
    } catch {
      setError('Failed to load signals from storage')
    } finally {
      setLoading(false)
    }
  }, [])

  const persist = useCallback((next: Signal[]) => {
    try {
      writeSignalsToStorage(next)
    } catch (err) {
      console.error('Failed to persist signals', err)
      setError('Failed to persist signals')
    }
  }, [])

  const createSignal = useCallback(
    (values: SignalFormValues) => {
      const id =
        typeof globalThis !== 'undefined' && typeof (globalThis.crypto as unknown as { randomUUID?: () => string }).randomUUID === 'function'
          ? (globalThis.crypto as unknown as { randomUUID: () => string }).randomUUID()
          : `${Date.now()}`
      const now = new Date().toISOString()
      const s: Signal = {
        id,
        name: values.name.trim(),
        symbol: values.symbol.trim().toUpperCase(),
        conditionType: values.conditionType,
        operator: values.operator,
        threshold: Number(values.threshold) || 0,
        timeWindow: Number(values.timeWindow) || 1,
        description: values.description?.trim(),
        status: 'active',
        createdAt: now,
        updatedAt: now,
      }
      // optimistic update
      setSignals((prev) => {
        const next = [s, ...prev]
        persist(next)
        return next
      })
      return s
    },
    [persist]
  )

  const updateSignal = useCallback(
    (id: string, patch: Partial<SignalFormValues & Partial<Signal>>) => {
      setSignals((prev) => {
        const next = prev.map((s) =>
          s.id === id
            ? {
                ...s,
                name: patch.name !== undefined ? String(patch.name).trim() : s.name,
                symbol: patch.symbol !== undefined ? String(patch.symbol).trim().toUpperCase() : s.symbol,
                conditionType: patch.conditionType ?? s.conditionType,
                operator: patch.operator ?? s.operator,
                threshold: patch.threshold !== undefined ? Number(patch.threshold) : s.threshold,
                timeWindow: patch.timeWindow !== undefined ? Number(patch.timeWindow) : s.timeWindow,
                description: patch.description !== undefined ? String(patch.description) : s.description,
                updatedAt: new Date().toISOString(),
              }
            : s
        )
        persist(next)
        return next
      })
    },
    [persist]
  )

  const deleteSignal = useCallback(
    (id: string) => {
      setSignals((prev) => {
        const next = prev.filter((s) => s.id !== id)
        persist(next)
        return next
      })
      // remove associated history rows as well
      setHistory((prev) => {
        const next = prev.filter((r) => r.signalId !== id)
        writeHistoryToStorage(next)
        return next
      })
    },
    [persist]
  )

const toggleSignalStatus = useCallback(
    (id: string) => {
      setSignals((prev) => {
        const next = prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: (s.status === 'active' ? 'paused' : 'active') as SignalStatus,
                updatedAt: new Date().toISOString(),
              }
            : s
        )
        persist(next)
        return next
      })
    },
    [persist]
  )

  const exportCSV = useCallback(
    (list?: Signal[], filename = 'signals.csv') => {
      const rows = (list ?? signals).map((s) => [
        s.id,
        s.name,
        s.symbol,
        s.conditionType,
        s.operator,
        s.threshold,
        s.timeWindow,
        s.status,
        s.createdAt,
        s.updatedAt ?? '',
      ])
      const header = ['id', 'name', 'symbol', 'conditionType', 'operator', 'threshold', 'timeWindow', 'status', 'createdAt', 'updatedAt']
      const csv = [header, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n')
      try {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        // auto-trigger download in browser environment
        if (typeof document !== 'undefined') {
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
        }
        return url
      } catch {
        setError('Failed to export CSV')
        return null
      }
    },
    [signals]
  )

  const addHistoryRow = useCallback((row: SignalHistoryRow) => {
    setHistory((prev) => {
      const next = [row, ...prev].slice(0, 1000) // cap history
      writeHistoryToStorage(next)
      return next
    })
  }, [])

  const generateMockHistory = useCallback((count = 20) => {
    // simple mock: pick random signals and generate rows
    const now = Date.now()
    const rows: SignalHistoryRow[] = []
    const s = readSignalsFromStorage()
    for (let i = 0; i < Math.min(count, Math.max(1, s.length)); i++) {
      const sig = s[Math.floor(Math.random() * s.length)]
      if (!sig) continue
      const val = sig.threshold + (Math.random() - 0.5) * 10
      rows.push({
        id: `${Date.now()}-${i}`,
        signalId: sig.id,
        signalName: sig.name,
        symbol: sig.symbol,
        triggeredAt: new Date(now - i * 1000 * 60 * 60).toISOString(),
        triggeredValue: Number(val.toFixed(4)),
        actionTaken: 'Mock alert',
      })
    }
    const combined = [...rows, ...readHistoryFromStorage()]
    writeHistoryToStorage(combined.slice(0, 1000))
    setHistory(combined.slice(0, 1000))
    return rows
  }, [])

  const testSignal = useCallback(
    async (values: SignalFormValues) => {
      // attempt server test route, fallback to local evaluation
      try {
        if (typeof fetch !== 'undefined') {
          const res = await fetch('/api/signals/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
          if (res.ok) return await res.json()
        }
      } catch {
        // ignore and fallback
      }
      // local fallback: return a fake evaluation
      const simulated = {
        symbol: values.symbol.toUpperCase(),
        evaluatedAt: new Date().toISOString(),
        value: Number(values.threshold) + (Math.random() - 0.5) * 5,
        triggered: Math.random() > 0.5,
      }
      return simulated
    },
    []
  )

  const clearAll = useCallback(() => {
    setSignals([])
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      // ignore
    }
  }, [])

  const signalsByStatus = useMemo(() => {
    return {
      active: signals.filter((s) => s.status === 'active'),
      paused: signals.filter((s) => s.status === 'paused'),
      inactive: signals.filter((s) => s.status === 'inactive'),
      all: signals,
    }
  }, [signals])

  return {
    signals,
    history,
    signalsByStatus,
    loading,
    error,
    createSignal,
    updateSignal,
    deleteSignal,
    toggleSignalStatus,
    exportCSV,
    addHistoryRow,
    generateMockHistory,
    testSignal,
    clearAll,
  }
}
