// import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore } from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-12 w-12 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-white/10 to-white/5",
            "hover:from-white/20 hover:to-white/10",
            "border border-white/20 backdrop-blur-lg",
            "transition-all duration-300",
          )}
        >
          <div className="relative flex items-center justify-center w-7 h-7">
            <Sun
              className={cn(
                "absolute h-7 w-7",
                "text-yellow-500/90",
                "transition-all duration-500",
                "rotate-0 scale-100",
                "[data-theme='dark']:-rotate-90 [data-theme='dark']:scale-0",
                "[data-theme='black']:-rotate-90 [data-theme='black']:scale-0",
              )}
            />
            <Moon
              className={cn(
                "absolute h-7 w-7",
                "bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent",
                "transition-all duration-500",
                "rotate-90 scale-0",
                "[data-theme='dark']:rotate-0 [data-theme='dark']:scale-100",
                "[data-theme='black']:rotate-0 [data-theme='black']:scale-100",
              )}
            />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-40 p-2",
          "bg-white/10 backdrop-blur-lg border border-white/20",
          "rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95",
        )}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md",
            "hover:bg-white/10 cursor-pointer",
            "transition-colors duration-200",
          )}
        >
          <Sun className="h-5 w-5 text-yellow-500/90" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md",
            "hover:bg-white/10 cursor-pointer",
            "transition-colors duration-200",
          )}
        >
          <Moon className="h-5 w-5 text-indigo-500" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("black")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md",
            "hover:bg-white/10 cursor-pointer",
            "transition-colors duration-200",
          )}
        >
          <Monitor className="h-5 w-5 text-gray-400" />
          <span>Black</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
