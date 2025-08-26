import * as React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function renderWithProviders(ui: any, options?: any) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } })
  return render(React.createElement(QueryClientProvider, { client: qc }, ui), options)
}

export default renderWithProviders
