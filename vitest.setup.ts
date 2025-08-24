// Vitest setup file: configure common test environment shims and helpers.
//
// - Registers jest-dom matchers
// - Exposes React globally (some components rely on JSX runtime/global React refs in tests)
// - Stubs ResizeObserver used by charting/layout libs
// - Mocks next/navigation with a simple useRouter
// - Adds a renderWithProviders helper that wraps UI with QueryClientProvider
//
// This file is wired into vitest.config.cjs via `setupFiles` so it's run before tests.
import '@testing-library/jest-dom'
import * as React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Expose React globally so older test code that expects `React` to be available works.
;(globalThis as any).React = React

// Simple ResizeObserver stub for libraries that use it (e.g., ResponsiveContainer).
class VitestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
;(globalThis as any).ResizeObserver = VitestResizeObserver

// Mock next/navigation's useRouter to avoid App Router mounting issues in tests.
// Tests may override this mock with vi.mock(...) if they need different behavior.
import { vi } from 'vitest'
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
    }),
  }
})

// Helper to render components with common providers (React Query).
export function renderWithProviders(ui: any, options?: any) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  })
  // Avoid JSX in a .ts file: use React.createElement so this file remains a TypeScript module
  const element = React.createElement(QueryClientProvider, { client: qc }, ui)
  return render(element, options)
}

// Make the helper available globally to simplify tests.
;(globalThis as any).renderWithProviders = renderWithProviders

// Optional: export nothing by default; file is executed for side-effects.
