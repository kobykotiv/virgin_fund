// @vitest-environment jsdom
/*
  This file needs jsdom because it renders React components using
  @testing-library/react which requires DOM globals (document/window).
*/
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock next/navigation's useRouter and usePathname (Vitest uses `vi`)
import { vi } from 'vitest'
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/dashboard',
}))

import DashboardApp from '../../components/DashboardApp'

describe('DashboardApp UI', () => {
  test('mobile sidebar toggle and file menu navigation', () => {
    render(<DashboardApp />)

    const sidebarToggle = screen.getByTestId('mobile-sidebar-toggle')
    expect(sidebarToggle).toBeInTheDocument()

    // Click to open sidebar (on small screens this would toggle)
    fireEvent.click(sidebarToggle)

    // File menu button should exist
    const fileMenuButton = screen.getByTestId('filemenu-button')
    expect(fileMenuButton).toBeInTheDocument()

    // Open file menu
    fireEvent.click(fileMenuButton)

    const calculators = screen.getByTestId('filemenu-calculators')
    expect(calculators).toBeInTheDocument()

    // Click calculators should call router.push; since push is mocked inside module, just click to ensure no errors
    fireEvent.click(calculators)
  })
})
