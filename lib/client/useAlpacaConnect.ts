"use client"

import { useCallback, useEffect, useRef, useState } from 'react'

type ConnectFn = (redirectTo?: string) => Promise<void>

export function useAlpacaConnect(): { connect: ConnectFn; connecting: boolean } {
  const [connecting, setConnecting] = useState(false)
  const popupRef = useRef<Window | null>(null)

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.source === 'alpaca-oauth') {
        setConnecting(false)
      }
    }

    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  const connect = useCallback<ConnectFn>((redirectTo = '/') => {
    setConnecting(true)

    const state = Math.random().toString(36).slice(2)
    const url = `/api/alpaca/authorize?state=${encodeURIComponent(state)}&redirect=${encodeURIComponent(redirectTo)}`
    const popup = window.open(url, 'alpaca_connect', 'width=600,height=800')
    popupRef.current = popup

    return new Promise<void>((resolve, reject) => {
      if (!popupRef.current) {
        setConnecting(false)
        return reject(new Error('Popup blocked'))
      }

      function onMessage(e: MessageEvent) {
        if (e.origin !== window.location.origin) return
        const data = e.data || {}
        if (data.source === 'alpaca-oauth' && data.state === state) {
          window.removeEventListener('message', onMessage)
          clearInterval(check)
          setConnecting(false)
          try { popupRef.current?.close() } catch {}
          if (data.success) resolve()
          else reject(new Error(data.error || 'Alpaca authentication failed'))
        }
      }

      window.addEventListener('message', onMessage)

      const check = setInterval(() => {
        if (!popupRef.current || popupRef.current.closed) {
          clearInterval(check)
          window.removeEventListener('message', onMessage)
          setConnecting(false)
          reject(new Error('Popup closed'))
        }
      }, 500)
    })
  }, [])

  return { connect, connecting }
}
