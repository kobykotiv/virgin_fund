# Getting Started

This guide will help you set up and run the Virgin Fund project locally.

## Prerequisites

- Node.js 18 or higher
- npm 7 or higher
- Supabase account
- Alpha Vantage API key

## Environment Setup

1. Clone the repository
2. Create a `.env` file with the following variables:

```env
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=your_supabase_url
ALPHA_VANTAGE_API_KEY=your_api_key
VITE_DEBUG_MODE=true  # Optional, for development
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow the existing project structure
- Use the provided UI components from `@/components/ui`
- Implement error handling using the `SearchError` class
- Use the glass-morphic design system

### Component Development

1. Create new components in `src/components`
2. Use the existing UI components as building blocks
3. Implement proper TypeScript types
4. Add error boundaries where appropriate
5. Follow the glass-morphic design pattern

### State Management

- Use Zustand for global state
- Use React Query for server state
- Implement proper loading and error states
- Follow the existing patterns in `useSearch` and other hooks

### Testing

- Write tests for new components and hooks
- Use Vitest for testing
- Follow the existing test patterns
- Ensure proper error case coverage

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and services
├── context/       # React context providers
├── types/         # TypeScript type definitions
└── docs/          # Documentation
```

## Common Tasks

### Adding a New Component

1. Create component file in `src/components`
2. Add TypeScript types
3. Implement error handling
4. Add tests
5. Update documentation

### Implementing a New Feature

1. Create feature branch
2. Implement components and hooks
3. Add tests
4. Update documentation
5. Submit pull request

### Database Changes

1. Create new migration in `supabase/migrations`
2. Test migrations locally
3. Update documentation
4. Deploy changes

## Troubleshooting

Common issues and solutions:

1. API Rate Limiting
   - Implement proper caching
   - Use the provided retry mechanism
   - Check rate limit status

2. Type Errors
   - Ensure proper TypeScript types
   - Check generated types
   - Update type definitions

3. Authentication Issues
   - Verify Supabase configuration
   - Check session handling
   - Review auth policies