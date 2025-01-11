# Virgin Fund Documentation

Welcome to the Virgin Fund documentation. This documentation provides comprehensive information about the project's architecture, components, and usage guidelines.

## Table of Contents

1. [Getting Started](./getting-started.md)
2. [Architecture Overview](./architecture.md)
3. [Components](./components/README.md)
4. [Services](./services/README.md)
5. [Database](./database/README.md)
6. [Error Handling](./error-handling.md)
7. [Search System](./search/README.md)
8. [Authentication](./auth/README.md)
9. [Testing](./testing.md)
10. [Deployment](./deployment.md)

## Project Overview

Virgin Fund is a sophisticated investment strategy platform that enables users to:
- Create and manage investment strategies
- Search and analyze financial instruments
- Backtest trading strategies
- Monitor portfolio performance
- Implement Dollar Cost Averaging (DCA) approaches

## Key Features

- Real-time financial data integration
- Multi-level caching system
- Advanced error handling
- Responsive glass-morphic UI
- Type-safe development with TypeScript
- Secure authentication with Supabase
- Comprehensive testing suite

## Self-Hosting Instructions

### Docker

1. Build the Docker image:
   ```bash
   docker build -t virgin-fund .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 virgin-fund
   ```

### Netlify

1. Push your code to a Git repository (GitHub, GitLab, etc.).
2. Go to [Netlify](https://www.netlify.com/) and create a new site from Git.
3. Connect your repository and set the build command to `npm run build` and the publish directory to `dist`.

### Vercel

1. Push your code to a Git repository.
2. Go to [Vercel](https://vercel.com/) and import your project.
3. Set the build command to `npm run build` and the output directory to `dist`.

### AWS

1. Create an S3 bucket and upload your build files.
2. Configure the bucket for static website hosting.
3. Optionally, set up CloudFront for CDN.

## Contact

For any questions or feedback, please reach out to us at `issues`.

Happy investing! 💰
