// Header for Trading Bot Social Platform
// Uses shadcn/ui and Tailwind

import { User } from "lucide-react";

export function Header() {
  return (
    <header className="w-full h-16 flex items-center justify-between px-6 border-b bg-background/80 backdrop-blur z-10">
      <div className="font-semibold text-lg tracking-tight">Bot Army Dashboard</div>
      <div className="flex items-center gap-4">
        {/* Placeholder for notifications, settings, etc. */}
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}

// Summary of Changes:
// - Created Header component with app title and user avatar placeholder.
// - Uses shadcn/ui, Tailwind, and Lucide icons for a modern look.
