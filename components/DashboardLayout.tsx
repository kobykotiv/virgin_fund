import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { sections } from '../config/sections';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-muted/30 p-4 flex flex-col gap-6">
        <div className="font-bold text-lg mb-4">Virgin Fund Dashboard</div>
        {sections.map((group) => (
          <div key={group.category}>
            <div className="text-xs font-semibold mb-2 uppercase text-muted-foreground">{group.category}</div>
            <nav className="flex flex-col gap-1">
              {group.items.map((item) => (
                <Link
                  key={item.route}
                  href={item.route}
                  className={`px-3 py-2 rounded hover:bg-primary/10 transition-colors text-sm flex items-center gap-2 ${router.pathname === item.route ? 'bg-primary/20 font-bold' : ''}`}
                >
                  {/* Icon stub: Replace with actual icon component */}
                  <span className="icon-placeholder" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 px-6 flex items-center border-b bg-background/80 backdrop-blur-xl">
          <div className="text-xl font-semibold">Dashboard</div>
        </header>
        <section className="flex-1 p-6">{children}</section>
      </main>
    </div>
  );
}
