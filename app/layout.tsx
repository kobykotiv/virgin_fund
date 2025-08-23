// Main app layout for the Trading Bot Social Platform
// Uses shadcn/ui, Tailwind, and Next.js App Router

import "@/app/globals.css";
import { Sidebar } from "@/components/layouts/Sidebar";
import { Header } from "@/components/layouts/Header";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}

// Summary of Changes:
// - Created main app layout with sidebar navigation and header using shadcn/ui and Tailwind.
// - Sets up the foundation for a social trading bot dashboard app.
