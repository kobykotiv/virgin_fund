# Minimalist Virgin Fund Trading Platform for Alpaca Markets

## Overview
This document outlines a brainstorm for a minimalist trading platform called "Virgin Fund," integrated with Alpaca Markets. The focus is on essential features, simplicity, and rapid development to validate the concept.

## Core Concept
- **Minimalist Design**: Clean, flat UI using TailwindCSS and shadcn/ui. Single-page dashboard for bot management.
- **Alpaca Integration**: Direct API calls for market data, orders, and account management. Default to paper trading for safety.
- **Bot Management**: Simple CRUD for bots with basic strategies (e.g., grid, momentum). Real-time status and basic metrics.
- **User Experience**: One-click API key setup, intuitive forms, responsive design.

## Key Features
1. **Dashboard Overview**: Account balance, active bots, recent trades, top market data.
2. **Bot Builder**: Form-based strategy selection with parameters (e.g., thresholds).
3. **Market Data Feed**: Real-time quotes and charts for selected symbols.
4. **Order Management**: Place, cancel, monitor orders with status updates.
5. **Settings**: Configure Alpaca keys, trading mode, notifications.
6. **Analytics**: Basic P&L charts, win/loss, bot performance.

## Technical Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui.
- **Backend**: Supabase for DB/users, Edge Functions for API.
- **Integrations**: Alpaca SDK.
- **State**: React hooks.
- **Deployment**: Vercel.

## Implementation Highlights
- **File Structure**: Flat structure with `app/dashboard/page.tsx` for UI, `lib/alpaca.ts` for wrappers, `components/BotCard.tsx` for elements.
- **Security**: Encrypted keys in Supabase with RLS.
- **Performance**: Lazy-load charts, cache data, ISR.
- **Testing**: Unit tests for utilities, component tests for UI, integration for Alpaca.

## Challenges & Solutions
- **API Rate Limits**: Caching and batching.
- **Real-Time Updates**: WebSockets or polling.
- **Scalability**: Start with Supabase free tier; add Redis if needed.

## Development Timeline
- Build MVP in 1-2 weeks focusing on core features.
