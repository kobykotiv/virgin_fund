# Virgin Fund

## Project Structure

```
├── app/                      # Next.js 13+ App Router
│   ├── (auth)/              # Authentication related routes
│   │   ├── login/          
│   │   └── signup/         
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── backtest/       # Backtesting features
│   │   ├── bots/          # Trading bots management
│   │   ├── portfolio/     # Portfolio management
│   │   └── calculators/   # Financial calculators
│   ├── (marketing)/        # Public marketing pages
│   │   ├── blog/
│   │   └── public/
│   ├── api/                # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/             # Authentication related components
│   ├── dashboard/        # Dashboard specific components
│   ├── charts/          # Chart components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── ui/              # Basic UI components
├── lib/                 # Core business logic
│   ├── api/            # API client functions
│   ├── utils/          # Utility functions
│   └── validation/     # Form validation schemas
├── hooks/              # Custom React hooks
├── providers/          # React context providers
├── public/            # Static assets
├── styles/            # Global styles
├── types/             # TypeScript type definitions
└── config/            # Configuration files
```

## Directory Details

- `app/`: Contains all the route segments and pages using Next.js 13+ App Router
  - `(auth)/`: Groups authentication-related routes
  - `(dashboard)/`: Protected routes requiring authentication
  - `(marketing)/`: Public marketing and informational pages
  
- `components/`: Reusable UI components organized by domain
  - `auth/`: Login, signup, and authentication-related components
  - `dashboard/`: Components specific to the dashboard interface
  - `charts/`: Data visualization components
  - `forms/`: Reusable form components
  - `layout/`: Layout-related components like headers and navigation
  - `ui/`: Basic UI components like buttons, inputs, etc.

- `lib/`: Core business logic and utilities
  - `api/`: API client functions and services
  - `utils/`: Helper functions and utilities
  - `validation/`: Form validation schemas and rules

- `hooks/`: Custom React hooks for shared functionality
- `providers/`: React context providers for state management
- `public/`: Static assets like images and fonts
- `styles/`: Global styles and CSS modules
- `types/`: TypeScript type definitions and interfaces
- `config/`: Configuration files and constants