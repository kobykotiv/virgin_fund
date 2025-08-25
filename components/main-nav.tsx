import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NAV from '@/lib/nav'

export default function SideNav() {
  const path = usePathname() || '/'

  return (
    <nav aria-label="Sidebar navigation" className="flex flex-col gap-4">
      {NAV.map((item) => {
        if (item.children) {
          return (
            <div key={item.id}>
              <div className="px-3 text-xs font-medium uppercase text-muted-foreground">{item.label}</div>
              <div className="flex flex-col mt-1 gap-1">
                {item.children.map((c) => (
                  <Link
                    key={c.id}
                    href={c.href || '#'}
                    className={`px-3 py-2 rounded flex items-center gap-3 text-sm hover:bg-primary/10 transition-colors ${
                      path === c.href ? 'bg-primary/20 font-semibold' : ''
                    }`}
                  >
                    {c.icon ? React.createElement(c.icon as any, { className: 'w-4 h-4 opacity-80' }) : null}
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        }

        return (
          <Link
            key={item.id}
            href={item.href || '#'}
            className={`px-3 py-2 rounded flex items-center gap-3 text-sm hover:bg-primary/10 transition-colors ${
              path === item.href ? 'bg-primary/20 font-semibold' : ''
            }`}
          >
            {item.icon ? React.createElement(item.icon as any, { className: 'w-4 h-4 opacity-80' }) : null}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

