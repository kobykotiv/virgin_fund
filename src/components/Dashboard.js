import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { StrategyList } from './StrategyList';
import { PerformanceMetrics } from './PerformanceMetrics';
import { Settings } from './Settings';
import { BlobBackground } from './ui/blob-background';
import { PlusCircle, TrendingUp, Settings as SettingsIcon, UserCircle2, 
// CloudMoon,
LogOut, Inbox, BellRing, LayoutDashboard, 
// ChevronDown,
CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from './ui/dropdown-menu';
export function Dashboard() {
    const { session } = useAuth();
    const [showSettings, setShowSettings] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const { data: strategies, isLoading } = useQuery({
        queryKey: ['strategies'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('strategies')
                .select('*, transactions (*)')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return data;
        },
    });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }));
    }
    if (showSettings) {
        return _jsx(Settings, {});
    }
    return (_jsxs("div", { className: "min-h-screen bg-background relative overflow-hidden", children: [_jsx(BlobBackground, {}), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent", children: "Investment Dashboard" }), session?.user?.email && (_jsxs("p", { className: "mt-1 text-lg text-muted-foreground", children: ["Welcome back, ", session.user.email] }))] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", className: "relative h-12 w-12 rounded-full", children: _jsx(UserCircle2, { className: "h-7 w-7 text-muted-foreground" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuLabel, { children: "My Account" }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onClick: () => setShowSettings(true), children: [_jsx(SettingsIcon, { className: "w-6 h-6 mr-2 text-muted-foreground" }), "Settings"] }), _jsxs(DropdownMenuItem, { onClick: () => supabase.auth.signOut(), children: [_jsx(LogOut, { className: "w-6 h-6 mr-2 text-muted-foreground" }), "Sign out"] })] })] }), _jsxs(Button, { variant: "outline", className: "relative glass-button h-12 w-12 rounded-full", onClick: () => setShowNotifications(!showNotifications), children: [_jsx(Inbox, { className: "h-7 w-7 text-muted-foreground" }), _jsx("span", { className: "absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" })] }), _jsx(Button, { asChild: true, className: "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90", children: _jsxs(Link, { to: "/new-strategy", children: [_jsx(PlusCircle, { className: "w-7 h-7 mr-2" }), "New Strategy"] }) })] })] }), showNotifications && (_jsx(Card, { className: "absolute right-4 top-24 w-96 z-50 shadow-xl", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold", children: "Notifications" }), _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(CheckCircle2, { className: "w-6 h-6 mr-2" }), "Mark all as read"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "p-3 bg-primary/10 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(BellRing, { className: "w-6 h-6 text-primary" }), _jsx("p", { className: "text-sm font-medium", children: "Strategy \"DCA Bitcoin\" reached target" })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "2 hours ago" })] }), _jsxs("div", { className: "p-3 bg-muted rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(LayoutDashboard, { className: "w-6 h-6 text-muted-foreground" }), _jsx("p", { className: "text-sm font-medium", children: "New feature: Advanced Backtesting" })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "1 day ago" })] })] })] }) })), strategies?.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-gradient-to-b from-background to-muted/20 rounded-lg border border-border/50 backdrop-blur-sm", children: [_jsx(TrendingUp, { className: "mx-auto h-12 w-12 text-muted-foreground" }), _jsx("h3", { className: "mt-4 text-lg font-medium", children: "No strategies yet" }), _jsx("p", { className: "mt-1 text-muted-foreground", children: "Get started by creating your first investment strategy." }), _jsx(Button, { asChild: true, className: "mt-6", children: _jsx(Link, { to: "/new-strategy", children: "Create Strategy" }) })] })) : (_jsxs("div", { className: "grid grid-cols-1 gap-8", children: [_jsx(PerformanceMetrics, { strategies: strategies || [] }), _jsx(StrategyList, { strategies: strategies || [] })] }))] })] }));
}
