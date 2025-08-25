"use client"
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function useGlobalShortcuts(openShortcuts: () => void) {
  const router = useRouter()
  const seq = useRef<string[]>([])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '?') {
        e.preventDefault()
        openShortcuts()
        return
      }

      // simple 'g' + letter sequences
      if (seq.current.length === 0 && e.key === 'g') {
        seq.current = ['g']
        setTimeout(() => (seq.current = []), 1200)
        return
      }

      if (seq.current[0] === 'g') {
        const k = e.key.toLowerCase()
        if (k === 'd') return router.push('/dashboard')
        if (k === 's') return router.push('/signals')
        if (k === 'p') return router.push('/bots/pipeline')
        if (k === 'b') return router.push('/bots')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openShortcuts, router])
}
