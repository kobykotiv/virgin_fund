import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Zap, Bot, Globe, User } from 'lucide-react'

const ITEMS = [
  { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: Home },
  { id: 'signals', href: '/signals', label: 'Signals', icon: Zap },
  { id: 'bots', href: '/bots', label: 'Bots', icon: Bot },
  { id: 'markets', href: '/market', label: 'Markets', icon: Globe },
  { id: 'profile', href: '/settings/profile', label: 'Profile', icon: User },
]

export default function MobileBottomNav() {
  const path = usePathname() || '/'

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md rounded-full px-3 py-2 shadow-lg md:hidden">
      <div className="flex gap-3 items-center">
        {ITEMS.map((it) => {
          const Icon = it.icon as any
          const active = path === it.href
          return (
            <Link
              key={it.id}
              href={it.href}
              className={`flex flex-col items-center text-xs px-2 py-1 rounded ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{it.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
