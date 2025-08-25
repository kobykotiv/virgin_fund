import React from 'react';
import MainNav from '@/components/main-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-muted/30 p-4 flex flex-col gap-6">
        <div className="font-bold text-lg mb-4">Virgin Fund Dashboard</div>
        <MainNav />
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
