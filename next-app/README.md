# Trading Agent Dashboard - Next.js Frontend

A modern, responsive frontend application for the Trading Agent platform built with Next.js 14, TypeScript, and TailwindCSS.

## Features

- **🚀 Next.js 14** - App Router with server-side rendering
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🎨 Modern UI** - TailwindCSS with custom design system
- **🔄 Real-time Updates** - React Query for data synchronization
- **🛡️ Type Safety** - Full TypeScript coverage with Zod validation
- **📊 Interactive Components** - Portfolio cards, charts, and trading interface
- **🔌 API Integration** - Seamless connection with Bun backend

## Quick Start

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Next.js 14 compatible environment

### Installation

```bash
cd next-app
npm install
# or
bun install
```

### Environment Configuration

Create `.env.local` file:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Optional: Enable development features
NEXT_PUBLIC_DEV_MODE=true
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev

# Type checking
npm run type-check
# or
bun run type-check

# Linting
npm run lint
# or
bun run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build
npm run start

# or with Bun
bun run build
bun run start
```

## Application Structure

```
next-app/
├── app/                      # Next.js App Router
│   ├── analysis/            # Market analysis page
│   ├── scheduler/           # Job scheduler page
│   ├── trading/             # Trading interface page
│   ├── reports/             # Performance reports page
│   ├── settings/            # User settings page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard home page
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── PortfolioCard.tsx    # Portfolio overview widget
│   ├── HeatmapWidget.tsx    # Market heatmap visualization
│   ├── AgentPanel.tsx       # Trading agent controls
│   ├── TradeBox.tsx         # Quick trading interface
│   └── ReactQueryProvider.tsx # Data fetching provider
├── lib/                     # Utilities and configuration
│   ├── api/                 # API clients and HTTP utilities
│   │   ├── httpClient.ts    # Axios client with auth & retry
│   │   └── apiClients.ts    # Typed API endpoints
│   └── schemas/             # Zod validation schemas
│       └── schemas.ts       # All data models
└── public/                  # Static assets
```

## Key Components

### Dashboard (/)
- Portfolio overview with real-time updates
- Market heatmap visualization
- Trading agent status and controls
- Quick trade execution interface

### Analysis (/analysis)
- Technical indicator analysis
- Market sentiment from news
- AI-powered trading recommendations
- Real-time chart data

### Trading (/trading)
- Advanced trading interface
- Open positions management
- Trade history and analytics
- Order book and market data

### Scheduler (/scheduler)
- Automated trading job management
- Cron-based scheduling
- Job execution monitoring
- Strategy automation

### Reports (/reports)
- P&L analysis and performance metrics
- Risk assessment and portfolio analytics
- Export functionality (CSV, PDF, Excel)
- Historical performance tracking

### Settings (/settings)
- User profile management
- Trading preferences
- Integration management
- Security settings

## Data Management

### React Query Integration
- Optimistic updates for better UX
- Background refetching for real-time data
- Intelligent caching and stale-while-revalidate
- Error handling with retry logic

### API Client Architecture
- Type-safe API calls with Zod validation
- Automatic authentication header injection
- Exponential backoff retry strategy
- Comprehensive error handling

### WebSocket Integration
- Real-time portfolio updates
- Live market quotes
- Trading notifications
- Connection management with auto-reconnect

## Styling & Design

### Design System
- Custom TailwindCSS configuration
- Consistent color palette and typography
- Responsive grid layouts
- Dark/light mode support (foundation ready)

### Component Patterns
- Trading card layout for consistent UI
- Loading skeletons for better perceived performance
- Error boundaries for graceful failure handling
- Progressive enhancement for accessibility

## Development Guidelines

### Code Organization
- Feature-based folder structure
- Consistent naming conventions
- TypeScript strict mode enabled
- ESLint and Prettier configuration

### Performance Optimization
- Next.js automatic code splitting
- React Query caching strategies
- Lazy loading for heavy components
- Image optimization with Next.js Image

### Error Handling
- Global error boundaries
- API error toast notifications
- Fallback UI components
- Development error overlays

## API Integration

The frontend communicates with the Bun backend through RESTful APIs and WebSocket connections:

### REST Endpoints
- Portfolio data and positions
- Trading execution and history
- Market analysis and indicators
- Job scheduling and automation
- User settings and preferences

### WebSocket Events
- Real-time portfolio updates
- Live market quotes
- Trade execution notifications
- Analysis job progress

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Tenant isolation support
- Demo mode for development

## Testing & Quality

### Type Safety
- Full TypeScript coverage
- Zod schema validation for API responses
- Strict null checks and type assertions
- Interface segregation for maintainability

### Code Quality
- ESLint with Next.js recommended rules
- Prettier for consistent formatting
- Husky pre-commit hooks (if enabled)
- TypeScript strict mode

## Deployment

### Vercel (Recommended)
```bash
# Connect to Vercel
vercel

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend.com
NEXT_PUBLIC_WS_URL=wss://your-backend.com
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export (if needed)
```bash
# For static hosting
npm run build && npm run export
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `ws://localhost:3001` |
| `NEXT_PUBLIC_DEV_MODE` | Enable development features | `false` |

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend server is running on port 3001
   - Check CORS configuration in backend
   - Validate environment variables

2. **WebSocket Connection Failures**
   - Ensure WebSocket URL is correct
   - Check network firewall settings
   - Verify authentication tokens

3. **Type Errors**
   - Run `npm run type-check` for detailed errors
   - Ensure all API responses match Zod schemas
   - Update types after backend changes

4. **Build Failures**
   - Clear `.next` folder and rebuild
   - Check for missing dependencies
   - Verify Node.js version compatibility

### Development Tips

- Use React Query DevTools for debugging data fetching
- Enable Next.js source maps for better error tracking
- Test API endpoints independently before frontend integration
- Use TypeScript strict mode to catch errors early

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new features
3. Include loading states and error handling
4. Test responsive design on multiple screen sizes
5. Update documentation for new components

## License

This project is part of the Virgin Fund Trading Agent platform.