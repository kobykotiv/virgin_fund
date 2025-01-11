import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  TrendingUp,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const { session } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!session) return null;

  return (
    <header className="sticky top-0 z-50 w-full glass border-b">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            <span className="font-bold">Virgin Fund</span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/dashboard"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "glass-button",
                      isActive("/dashboard") && "bg-primary/20",
                    )}
                  >
                    <BarChart2 className="w-6 h-6 mr-2" />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/learn"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "glass-button",
                      isActive("/learn") && "bg-primary/20",
                    )}
                  >
                    <BookOpen className="w-6 h-6 mr-2" />
                    Learn
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="outline"
            className="relative glass-button h-12 w-12 rounded-full"
            onClick={() => {
              /* Add settings handler */
            }}
          >
            <Settings className="h-7 w-7" />
          </Button>
          <Button
            variant="outline"
            className="relative glass-button h-12 w-12 rounded-full"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </header>
  );
}
