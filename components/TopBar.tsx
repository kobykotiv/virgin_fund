import React from 'react';
import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useUIStore } from '../hooks/useUIStore';

const TopBar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useUIStore();
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-header text-header-foreground shadow">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">Virgin Fund</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input type="text" placeholder="Search..." className="rounded px-2 py-1 bg-input text-input-foreground" />
          <Search className="absolute right-2 top-2 w-4 h-4 text-muted" />
        </div>
        <button onClick={toggleDarkMode} className="p-2 rounded bg-muted/10 hover:bg-muted/20 transition">
          {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-blue-500" />}
        </button>
        <Bell className="w-6 h-6 cursor-pointer" />
        <div className="relative">
          <User className="w-8 h-8 rounded-full bg-muted p-1 cursor-pointer" />
          {/* Dropdown stub */}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
