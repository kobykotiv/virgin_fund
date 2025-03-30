# Virgin Fund Deployment Guide

This document outlines the deployment process for the Virgin Fund application across different environments.

## Environments

The application can be deployed to the following environments:

1. **Development** - For local development
2. **Staging** - For testing before production
3. **Production** - Live environment for end users

## Prerequisites

- Docker and Docker Compose
- Node.js v16 or higher
- AWS CLI (for AWS deployments)
- Access to relevant Docker repositories
- Environment-specific configuration

## Local Development Setup

1. Clone the repository
   ```
   git clone https://github.com/your-organization/virgin-fund.git
   cd virgin-fund
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

   Alternatively, use Docker Compose:
   ```
   docker-compose up
   ```

## Deployment Methods

### 1. Docker Deployment

#### Building the Docker image

```bash
docker build -t virginfund/portfolio-app:latest .
```

#### Running the container

```bash
docker run -d -p 80:80 virginfund/portfolio-app:latest
```

### 2. AWS Deployment

#### Prerequisites

- AWS EB CLI installed
- AWS credentials configured

#### Deploy to Elastic Beanstalk

```bash
eb init virgin-fund
eb create virgin-fund-production
eb deploy
```

### 3. CI/CD Pipeline

The application is configured to deploy automatically through GitHub Actions:

1. Push to `develop` branch deploys to staging
2. Push to `main` branch deploys to production

## Environment Configuration

Each environment uses different environment variables:

1. Development: `.env.development`
2. Staging: Set through CI/CD pipeline
3. Production: Set through CI/CD pipeline

## Post-Deployment Verification

1. Navigate to the deployed application URL
2. Verify that the application loads correctly
3. Perform basic operations (create portfolio, add assets)
4. Check that market data is loading
5. Verify performance calculations

## Rollback Procedure

If deployment issues occur:

1. For Docker: Revert to the previous image tag
   ```bash
   docker pull virginfund/portfolio-app:previous-tag
   docker stop [container-id]
   docker run -d -p 80:80 virginfund/portfolio-app:previous-tag
   ```

2. For AWS EB: Use the rollback command
   ```bash
   eb rollback
   ```

3. For CI/CD pipeline: Revert the commit and push again

## Monitoring

After deployment, monitor the application using:

1. Application logs
2. Error tracking through Sentry
3. Performance metrics through CloudWatch (AWS)
4. User metrics through Google Analytics

## Common Issues

1. **API Connection Errors**: Verify environment variables for API endpoints
2. **Missing Market Data**: Check market data API credentials
3. **Performance Issues**: Investigate server resources and application metrics
