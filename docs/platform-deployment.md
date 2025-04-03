# Platform Deployment Guide

This guide explains how to deploy the Virgin Fund application on different platforms.

## Common Deployment Prerequisites

- Node.js v18 or higher
- pnpm installed globally
- Environment variables configured for the target environment

## Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in the Vercel dashboard
3. Deploy using the default settings

Vercel will automatically detect the Next.js configuration and deploy accordingly.

## Coolify Deployment

1. Set up Coolify on your server following [the official documentation](https://coolify.io/docs/get-started)

2. Create a new project in Coolify
   - Click "Projects" in the sidebar
   - Click "+ Add"
   - Enter a name for your project and create it
   - Select your environment

3. Add a new resource
   - Click "Add New Resource"
   - Select "Docker Compose"
   - Choose your server
   - Choose "Standalone Docker" as the destination

4. Configure your deployment
   - Use the docker-compose.yaml configuration from this repository
   - Configure your environment variables
   - Set up your domain name

5. Deploy your application
   - Click "Deploy" to start the deployment process

6. Fix storage permissions if needed
   ```bash
   mkdir -p {VOLUME_PATH}/data
   chmod -R 775 {VOLUME_PATH}/data
   ```

## Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Use the following build settings:
   - Build command: `pnpm run build`
   - Publish directory: `.next`
   - Node.js version: 18.x

3. Configure environment variables in the Netlify dashboard

4. Deploy your site

## Environment Variables

Make sure to set the following environment variables on each platform:

```
NEXT_PUBLIC_ALPACA_KEY_ID=your_production_key
NEXT_PUBLIC_ALPACA_SECRET_KEY=your_production_secret
NEXT_PUBLIC_ALPACA_BASE_URL=https://paper-api.alpaca.markets
MONGODB_URI=your_production_mongodb_uri
MONGODB_DB=virgin_fund
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://your-production-url.com
ENCRYPTION_KEY=your_production_encryption_key
DEPLOYMENT_PLATFORM=[vercel|coolify|netlify]
```

## Verifying Deployment

After deployment, verify:
1. The application loads correctly
2. Authentication works
3. Portfolio management functions work
4. API integrations are functioning
