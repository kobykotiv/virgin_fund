# Virgin Fund: GenEric TraDer AI

A self-hostable finance application bridging bot-based trading and copy trading in an isolated environment.

## Features

- Advanced Calculator Suite with Monte Carlo simulations
- Portfolio management and analysis tools
- Real-time market data integration (Alpaca API)
- Bot-based and copy trading capabilities
- Secure credential storage with AES-GCM encryption

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PNPM package manager
- A secure environment variable for credential encryption

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/virgin_fund.git
cd virgin_fund
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=your_api_url
CREDENTIAL_ENCRYPTION_KEY=your_secure_key
```

4. Run the development server:
```bash
pnpm dev
```

## Adding New Features (App Router)

### File Structure
```
app/
├── (protected)/          # Protected routes
│   ├── strategies/
│   ├── news/
│   └── profile/
├── blog/                 # Public blog
├── layout.tsx           # Root layout
└── page.tsx            # Landing page
```

### Creating New Pages

1. Add new pages directly in the `app` directory:

```tsx
// app/new-feature/page.tsx
export default function NewFeaturePage() {
  return (
    <div>
      <h1>New Feature</h1>
    </div>
  )
}
```

2. Protected routes should be placed in `app/(protected)`:

```tsx
// app/(protected)/new-protected-feature/page.tsx
export default function NewProtectedFeaturePage() {
  return (
    <div>
      <h1>Protected New Feature</h1>
    </div>
  )
}
```

### Component Guidelines

- Place shared components in `components/`
- Use the UI components from `components/ui/`
- Follow the established styling patterns using Tailwind CSS

### State Management

- Use React Context for global state
- Place providers in `providers/` directory
- Implement new providers following the pattern in `auth-provider.tsx`

## Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes:
```bash
git commit -m "feat: add new feature"
```

4. Push to your fork:
```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

## Security

- Always use environment variables for sensitive data
- Implement proper authentication checks
- Follow security best practices for API integrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.