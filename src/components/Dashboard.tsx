import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { StrategyList } from './StrategyList';
import { PerformanceMetrics } from './PerformanceMetrics';
import { Settings } from './Settings';
import { BlobBackground } from './ui/blob-background';
import { 
  PlusCircle, 
  TrendingUp, 
  Settings as SettingsIcon,
  UserCircle2,
  // CloudMoon,
  LogOut,
  Inbox,
  BellRing,
  LayoutDashboard,
  // ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showSettings) {
    return <Settings />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BlobBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Investment Dashboard
            </h1>
            {session?.user?.email && (
              <p className="mt-1 text-lg text-muted-foreground">
                Welcome back, {session.user.email}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative h-12 w-12 rounded-full">
                  <UserCircle2 className="h-7 w-7 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <SettingsIcon className="w-6 h-6 mr-2 text-muted-foreground" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
                  <LogOut className="w-6 h-6 mr-2 text-muted-foreground" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notification Button */}
            <Button
              variant="outline"
              className="relative glass-button h-12 w-12 rounded-full"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Inbox className="h-7 w-7 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></span>
            </Button>
            
            <Button 
              asChild
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Link to="/new-strategy">
                <PlusCircle className="w-7 h-7 mr-2" />
                New Strategy
              </Link>
            </Button>
          </div>
        </div>

        {/* Notification Panel */}
        {showNotifications && (
          <Card className="absolute right-4 top-24 w-96 z-50 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Notifications</h3>
                <Button variant="ghost" size="sm">
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  Mark all as read
                </Button>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BellRing className="w-6 h-6 text-primary" />
                  <p className="text-sm font-medium">Strategy "DCA Bitcoin" reached target</p>
                  </div>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <LayoutDashboard className="w-6 h-6 text-muted-foreground" />
                  <p className="text-sm font-medium">New feature: Advanced Backtesting</p>
                  </div>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {strategies?.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-b from-background to-muted/20 rounded-lg border border-border/50 backdrop-blur-sm">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No strategies yet</h3>
            <p className="mt-1 text-muted-foreground">
              Get started by creating your first investment strategy.
            </p>
            <Button asChild className="mt-6">
              <Link to="/new-strategy">Create Strategy</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <PerformanceMetrics strategies={strategies || []} />
            <StrategyList strategies={strategies || []} />
          </div>
        )}
      </div>
    </div>
  );
}
