/**
 * FileMenuNav - Nostalgic Mac OS-style file menu navigation for Virgin Fund dashboard
 * Provides quick access to app sections in a classic horizontal menu bar.
 *
 * Usage: Place <FileMenuNav /> at the top of your layout/page.
 */
import React, { useState } from "react"

const MENU = [
  {
    label: "File",
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Performance", href: "/performance" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Bots", href: "/bots" },
      { label: "Calculators", href: "/calculators" },
      { label: "Settings", href: "/settings" },
      { label: "Logout", href: "/logout" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Preferences", href: "/settings" },
      { label: "Theme", href: "/settings/theme" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Overview", href: "/" },
      { label: "Backtest", href: "/backtest" },
      { label: "News", href: "/blog" },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Docs", href: "/docs" },
      { label: "Support", href: "/support" },
    ],
  },
]

export default function FileMenuNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <nav className="bg-gray-200 dark:bg-gray-900 border-b border-gray-400 dark:border-gray-700 shadow flex items-center px-2 h-10 select-none text-xs font-mono">
      {MENU.map((menu) => (
        <div
          key={menu.label}
          className="relative mr-4"
          onMouseEnter={() => setOpenMenu(menu.label)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            className={`px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-800 ${openMenu === menu.label ? "bg-gray-300 dark:bg-gray-800" : ""}`}
          >
            {menu.label}
          </button>
          {openMenu === menu.label && (
            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded shadow z-10 min-w-[120px]">
              {menu.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
