#!/bin/bash

# This script builds and deploys the Virgin Fund application
# Usage: ./build-and-deploy.sh [environment]
# Environments: staging, production

# Exit on error
set -e

# Default environment
ENVIRONMENT=${1:-staging}

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "Invalid environment: $ENVIRONMENT"
    echo "Usage: ./build-and-deploy.sh [environment]"
    echo "Environments: staging, production"
    exit 1
fi

echo "Building and deploying Virgin Fund to $ENVIRONMENT environment..."

# Build the application
echo "Building application..."
npm run build

# Create Docker image
echo "Creating Docker image..."
docker build -t virginfund/portfolio-app:$ENVIRONMENT .

# Push Docker image
echo "Pushing Docker image..."
docker push virginfund/portfolio-app:$ENVIRONMENT

# Deploy to the appropriate environment
if [ "$ENVIRONMENT" == "production" ]; then
    echo "Deploying to production..."
    # Add your production deployment commands here
    echo "Production deployment would happen here"
else
    echo "Deploying to staging..."
    # Add your staging deployment commands here
    echo "Staging deployment would happen here"
fi

echo "Deployment to $ENVIRONMENT complete!"
