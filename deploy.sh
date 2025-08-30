#!/bin/bash
# Virgin Fund - Cross-Platform Deployment Script
# Supports Vercel, Netlify, Docker, and cloud platforms

echo "========================================"
echo "   Virgin Fund - Deployment Script"
echo "========================================"
echo

case "$1" in
    vercel)
        echo "Deploying to Vercel..."
        if [ ! -f "vercel.json" ]; then
            echo "Error: vercel.json not found"
            exit 1
        fi
        npx vercel --prod
        ;;

    netlify)
        echo "Deploying to Netlify..."
        if [ ! -f "netlify.toml" ]; then
            echo "Error: netlify.toml not found"
            exit 1
        fi
        npx netlify deploy --prod --dir=.next
        ;;

    docker)
        echo "Building Docker image..."
        docker build -t virgin-fund:latest .
        echo
        echo "To run the container:"
        echo "docker run -p 3000:3000 --env-file .env virgin-fund:latest"
        echo
        echo "Or use Docker Compose:"
        echo "docker-compose up -d"
        ;;

    aws)
        echo "Deploying to AWS..."
        echo "Note: Make sure AWS CLI is configured"
        echo
        echo "1. Build the application:"
        bun run build
        echo
        echo "2. Deploy to S3/CloudFront:"
        echo "aws s3 sync .next s3://your-bucket-name --delete"
        echo "aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths \"/*\""
        echo
        echo "3. For ECS deployment:"
        echo "aws ecs update-service --cluster your-cluster --service your-service --force-new-deployment"
        ;;

    gcp)
        echo "Deploying to Google Cloud..."
        echo "Note: Make sure gcloud CLI is configured"
        echo
        echo "1. Build the application:"
        bun run build
        echo
        echo "2. Deploy to Cloud Run:"
        echo "gcloud run deploy virgin-fund --source . --platform managed --region us-central1 --allow-unauthenticated"
        ;;

    *)
        echo "Usage: $0 [platform]"
        echo
        echo "Platforms:"
        echo "  vercel    - Deploy to Vercel"
        echo "  netlify   - Deploy to Netlify"
        echo "  docker    - Build Docker image"
        echo "  aws       - Deploy to AWS"
        echo "  gcp       - Deploy to Google Cloud"
        echo
        echo "Examples:"
        echo "  $0 vercel"
        echo "  $0 docker"
        echo
        echo "Prerequisites:"
        echo "  - Node.js and bun installed"
        echo "  - Platform CLI tools installed (vercel, netlify, aws, gcloud)"
        echo "  - Environment variables configured"
        ;;
esac

echo
echo "Deployment script completed."
