"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BotManagement } from '@/components/bots/BotManagement';
import { PortfolioManagement } from '@/components/portfolios/PortfolioManagement';
import { EnhancedWatchlistManager } from '@/components/watchlists/EnhancedWatchlistManager';

export default function CrudDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            🚀 Trading Bot Platform Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience comprehensive CRUD operations for Bots, Portfolios, and Watchlists with modern UI patterns and emoji-driven design.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🤖</div>
              <CardTitle>Trading Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Multi-step creation wizard</li>
                <li>✅ Table & card view modes</li>
                <li>✅ Bulk operations (start/stop/delete)</li>
                <li>✅ Advanced filtering & search</li>
                <li>✅ Real-time status tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-colors">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">💼</div>
              <CardTitle>Portfolios</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Asset allocation wizard</li>
                <li>✅ Preset allocation strategies</li>
                <li>✅ Performance tracking</li>
                <li>✅ Rebalancing operations</li>
                <li>✅ Position management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">👁️</div>
              <CardTitle>Watchlists</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Multi-provider support</li>
                <li>✅ Symbol management</li>
                <li>✅ Real-time price integration</li>
                <li>✅ Bulk symbol operations</li>
                <li>✅ Export functionality</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎮 Interactive Demo
              <span className="text-sm font-normal text-muted-foreground">
                Try all CRUD operations with live components
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bots" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bots" className="flex items-center gap-2">
                  🤖 Bots
                </TabsTrigger>
                <TabsTrigger value="portfolios" className="flex items-center gap-2">
                  💼 Portfolios
                </TabsTrigger>
                <TabsTrigger value="watchlists" className="flex items-center gap-2">
                  👁️ Watchlists
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bots" className="mt-6">
                <BotManagement />
              </TabsContent>

              <TabsContent value="portfolios" className="mt-6">
                <PortfolioManagement />
              </TabsContent>

              <TabsContent value="watchlists" className="mt-6">
                <EnhancedWatchlistManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔧 Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  ⚛️ Frontend Stack
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>React 19 with TypeScript</li>
                  <li>Next.js 15 with Turbopack</li>
                  <li>Tailwind CSS + shadcn/ui</li>
                  <li>React Query for state</li>
                  <li>Framer Motion animations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  🎨 UI Features
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Emoji-first icon system</li>
                  <li>Table/card view toggle</li>
                  <li>Responsive design</li>
                  <li>Dark/light mode support</li>
                  <li>Toast notifications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  🔄 CRUD Operations
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Multi-step creation wizards</li>
                  <li>Bulk operations support</li>
                  <li>Real-time search & filtering</li>
                  <li>Optimistic updates</li>
                  <li>Error handling & recovery</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  📊 Data Management
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Supabase integration</li>
                  <li>Real-time subscriptions</li>
                  <li>Caching strategies</li>
                  <li>Export functionality</li>
                  <li>Type-safe APIs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p className="text-sm">
            🎯 This demo showcases a modern, production-ready CRUD interface for trading bot management.
          </p>
          <p className="text-xs mt-2">
            Built with ❤️ using React, TypeScript, and modern web technologies.
          </p>
        </div>
      </div>
    </div>
  );
}