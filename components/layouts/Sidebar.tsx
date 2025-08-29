"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Bot, PieChart, Calculator, FlaskConical, Hammer, PlayCircle } from 'lucide-react';

type Item = { label: string; href?: string; icon?: any; children?: Item[] };

const NAV: Item[] = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Bots', href: '/bots', icon: Bot },
  { label: 'Portfolio', href: '/portfolio', icon: PieChart },
  { label: 'Backtest', href: '/backtest', icon: FlaskConical },
  {
    label: 'Calculators', icon: Calculator, children: [
      { label: 'Financial', href: '/calculators/financial' },
      { label: 'Trading', href: '/calculators/trading' },
    ]
  },
  { label: 'Strategy Builder', href: '/strategies/builder', icon: Hammer },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggle = () => setOpen(o => !o);
  const toggleSection = (label: string) => setExpanded(e => ({ ...e, [label]: !e[label] }));

  return (
    <>
      <button aria-label="Toggle navigation" onClick={toggle} className="lg:hidden fixed top-3 left-3 z-40 p-2 rounded-md bg-gray-800 text-white">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
  <aside aria-label="Primary" className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-950/95 backdrop-blur border-r border-gray-800 flex flex-col transform transition-transform duration-300 z-30 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-5 text-indigo-300 font-bold tracking-wide border-b border-gray-800">Bot Dashboard</div>
  <nav className="flex-1 overflow-y-auto p-4 space-y-2" role="navigation">
          {NAV.map(item => {
            const active = item.href && pathname === item.href;
            if (item.children) {
              const isOpen = expanded[item.label];
              return (
                <div key={item.label}>
                  <button onClick={() => toggleSection(item.label)} className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition ${isOpen ? 'bg-gray-800' : 'hover:bg-gray-800'} text-gray-300`}> 
                    <span className="flex items-center gap-2">
                      {item.icon ? <item.icon className="w-4 h-4 opacity-80" /> : null}
                      {item.label}
                    </span>
                    <span className="text-xs">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div className={`mt-1 ml-4 border-l border-gray-800 pl-3 space-y-1 overflow-hidden transition-[max-height] duration-300 ${isOpen ? 'max-h-64' : 'max-h-0'}`}>
                    {item.children.map(c => {
                      const childActive = c.href && pathname === c.href;
                      return (
                        <Link key={c.label} href={c.href!} className={`block px-2 py-1.5 rounded text-sm transition ${childActive ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}>{c.label}</Link>
                      )
                    })}
                  </div>
                </div>
              )
            }
            return (
              <Link key={item.label} href={item.href!} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${active ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'}`}> {item.icon ? <item.icon className="w-4 h-4 opacity-80" /> : null} <span>{item.label}</span></Link>
            )
          })}
        </nav>
  <div className="p-4 border-t border-gray-800">
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md py-2 text-sm font-medium">
              <PlayCircle className="w-4 h-4 rotate-180" /> Log off
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
