# Maintainers Documentation

## Overview

This document provides guidelines and best practices for maintaining the Virgin Fund project. It includes instructions for setting up the development environment, managing dependencies, handling deployments, and contributing to the codebase.

---

## Development Environment

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. Bun is used as the package manager.

- **Docker**: Required for containerized deployments.

- **Supabase**: Used for backend services like authentication and database.

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/kobykotiv/virgin_fund.git
   ```

2. Navigate to the project directory:

   ```bash
   cd virgin_fund
   ```

3. Install dependencies using Bun:

   ```bash
   bun install
   ```

4. Start the development server:

   ```bash
   bun dev
   ```

---

## File Structure

### Key Directories

- `/app`: Contains Next.js pages and layouts.

- `/components`: Reusable React components.

- `/lib`: Utility functions and services.

- `/docs`: Project documentation.

- `/styles`: Global and component-specific styles.

- `/types`: TypeScript interfaces and types.

### Important Files

- `next.config.mjs`: Next.js configuration.

- `tailwind.config.ts`: TailwindCSS configuration.

- `tsconfig.json`: TypeScript configuration.

## Ideal File Structure

```
root/
├── app/                # Next.js App Router pages, layouts, and API routes
│   ├── api/            # API routes (REST endpoints)
│   ├── dashboard/      # Dashboard pages and layouts
│   ├── login/          # Login and authentication pages
│   ├── portfolio/      # Portfolio management pages
│   └── ...             # Other feature pages
├── components/         # Reusable React components
│   ├── home/           # Home page sections/components
│   ├── dashboard/      # Dashboard widgets/components
│   ├── calculators/    # Financial calculator components
│   ├── ui/             # Shared UI primitives (Card, Button, etc.)
│   └── ...             # Other feature components
├── blog/               # Markdown blog posts
├── config/             # Configuration files and constants
├── docs/               # Documentation and guides
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets (images, icons, etc.)
├── server/             # Backend logic (Supabase, Alpaca, bots)
├── styles/             # Global and feature-specific styles
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── .env.local          # Local environment variables
├── package.json        # Project dependencies and scripts
├── tailwind.config.ts  # TailwindCSS configuration
├── next.config.mjs     # Next.js configuration
└── ...                 # Other root files
```

## Best Practices
- Keep feature logic modular and separated by domain.
- Use server components for backend logic and data fetching.
- Use client components for interactive UI.
- Store all blog posts in `blog/` as markdown files.
- Document new features and changes in `docs/`.
- Use environment variables for sensitive keys and configuration.
- Follow TypeScript conventions for type safety.
- Use TailwindCSS for consistent styling.

## Maintainer Responsibilities
- Review and merge pull requests.
- Ensure code quality and consistency.
- Update documentation for new features and changes.
- Monitor dependencies and update as needed.
- Respond to issues and feature requests.

## Managing Dependencies

### Adding Dependencies

Use Bun to add new dependencies:

```bash
bun add <package-name>
```

### Removing Dependencies

Use Bun to remove dependencies:

```bash
bun remove <package-name>
```

---

## Deployment

### Docker Setup

1. Build the Docker image:

   ```bash
   docker build -t virgin_fund .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 virgin_fund
   ```

### Environment Variables

Ensure the following environment variables are set:

- `NEXT_PUBLIC_SUPABASE_URL`

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- `NEXT_PUBLIC_APP_VERSION`

---

## Contributing

### Branching Strategy

- **Default Branch**: `primer`

- **Feature Branches**: Use the format `feat/<feature-name>`.

- **Bug Fix Branches**: Use the format `fix/<bug-name>`.

### Pull Requests

1. Create a new branch:

   ```bash
   git checkout -b feat/<feature-name>
   ```

2. Commit changes:

   ```bash
   git commit -m "Add feature <feature-name>"
   ```

3. Push the branch:

   ```bash
   git push origin feat/<feature-name>
   ```

4. Open a pull request on GitHub.

---

## Testing

### Unit Tests

Run unit tests using Bun:

```bash
bun test
```

### End-to-End Tests

Use Playwright for E2E testing:

```bash
bun playwright test
```

---

## Troubleshooting

### Common Issues

- **Dependency Errors**: Run `bun install` to ensure all dependencies are installed.

- **Environment Variable Errors**: Verify `.env` file is correctly configured.

- **Docker Issues**: Ensure Docker is running and properly configured.

### Support

For additional help, contact the project maintainers or open an issue on GitHub.

---

## Contact

For questions or feedback, reach out to the project owner:

- **GitHub**: [kobykotiv](https://github.com/kobykotiv)

- **Email**: [support@virginfund.com](mailto:support@virginfund.com)
