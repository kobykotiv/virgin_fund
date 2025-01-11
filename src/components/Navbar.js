import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle, } from '@/components/ui/navigation-menu';
import { TrendingUp, BookOpen, BarChart2, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
export function Navbar() {
    const { session } = useAuth();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    if (!session)
        return null;
    return (_jsx("header", { className: "sticky top-0 z-50 w-full glass border-b", children: _jsxs("div", { className: "container flex h-14 items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-8 w-8" }), _jsx("span", { className: "font-bold", children: "Virgin Fund" })] }), _jsx(NavigationMenu, { children: _jsxs(NavigationMenuList, { children: [_jsx(NavigationMenuItem, { children: _jsx(NavigationMenuLink, { asChild: true, children: _jsxs(Link, { to: "/dashboard", className: cn(navigationMenuTriggerStyle(), "glass-button", isActive('/dashboard') && "bg-primary/20"), children: [_jsx(BarChart2, { className: "w-6 h-6 mr-2" }), "Dashboard"] }) }) }), _jsx(NavigationMenuItem, { children: _jsx(NavigationMenuLink, { asChild: true, children: _jsxs(Link, { to: "/learn", className: cn(navigationMenuTriggerStyle(), "glass-button", isActive('/learn') && "bg-primary/20"), children: [_jsx(BookOpen, { className: "w-6 h-6 mr-2" }), "Learn"] }) }) })] }) })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(ThemeToggle, {}), _jsx(Button, { variant: "outline", className: "relative glass-button h-12 w-12 rounded-full", onClick: () => { }, children: _jsx(Settings, { className: "h-7 w-7" }) }), _jsx(Button, { variant: "outline", className: "relative glass-button h-12 w-12 rounded-full", onClick: () => supabase.auth.signOut(), children: _jsx(LogOut, { className: "h-7 w-7" }) })] })] }) }));
}
