import React from 'react'

export type NavItem = {
  name: string
  href: string
  icon: React.ReactNode
}

export const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>) },
  { name: 'Bots', href: '/bots', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8a4 4 0 1 0 0 8"/><path d="M10 2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M14 22a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2"/><path d="M2 10a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/></svg>) },
  { name: 'Portfolio', href: '/portfolio', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M5 21a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"/></svg>) },
  { name: 'Backtest', href: '/backtest', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>) },
  { name: 'Calculators', href: '/calculators', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/></svg>) },
  { name: 'Strategy Builder', href: '/strategy-builder', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8 8-4-4 8-8 4 4z"/></svg>) },
  { name: 'Marketplace', href: '/marketplace', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>) },
  { name: 'Settings', href: '/settings', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44c-1.12 0-2 .9-2 2-2.1 0-3.95 1.4-4.5 3.5.7.5 1.5 1 2.5 1 1.6 0 3-1.4 3-3-2 0-3.5 1.4-3.5 3.5a1.5 1.5 0 0 1-1.5 1.5H3.2c-.6 0-1.1.4-1.2 1-.2.8-.2 1.6-.2 2.4s0 1.6.2 2.4c.1.6.6 1 1.2 1h1.5a1.5 1.5 0 0 1 1.5 1.5c0 2.1-1.4 3.9-3.5 4.5-.5.7-1 1.5-1 2.5s.9 2 2 2h.44c1.12 0 2-.9 2-2 2.1 0 3.95-1.4 4.5-3.5-.7-.5-1.5-1-2.5-1-1.6 0-3 1.4-3 3 2 0 3.5-1.4 3.5-3.5a1.5 1.5 0 0 1 1.5-1.5h1.5c.6 0 1.1-.4 1.2-1 .2-.8.2-1.6.2-2.4s0-1.6-.2-2.4c-.1-.6-.6-1-1.2-1h-1.5a1.5 1.5 0 0 1-1.5-1.5z"/></svg>) },
]

export default navItems
