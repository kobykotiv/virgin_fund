@echo off
REM Virgin Fund - Cross-Platform Deployment Script
REM Supports Vercel, Netlify, Docker, and cloud platforms

echo ========================================
echo    Virgin Fund - Deployment Script
echo ========================================
echo.

if "%1"=="vercel" goto :vercel
if "%1"=="netlify" goto :netlify
if "%1"=="docker" goto :docker
if "%1"=="aws" goto :aws
if "%1"=="gcp" goto :gcp
goto :help

:vercel
echo Deploying to Vercel...
if not exist "vercel.json" (
    echo Error: vercel.json not found
    exit /b 1
)
call npx vercel --prod
goto :end

:netlify
echo Deploying to Netlify...
if not exist "netlify.toml" (
    echo Error: netlify.toml not found
    exit /b 1
)
call npx netlify deploy --prod --dir=.next
goto :end

:docker
echo Building Docker image...
docker build -t virgin-fund:latest .
echo.
echo To run the container:
echo docker run -p 3000:3000 --env-file .env virgin-fund:latest
echo.
echo Or use Docker Compose:
echo docker-compose up -d
goto :end

:aws
echo Deploying to AWS...
echo Note: Make sure AWS CLI is configured
echo.
echo 1. Build the application:
call bun run build
echo.
echo 2. Deploy to S3/CloudFront:
echo aws s3 sync .next s3://your-bucket-name --delete
echo aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
echo.
echo 3. For ECS deployment:
echo aws ecs update-service --cluster your-cluster --service your-service --force-new-deployment
goto :end

:gcp
echo Deploying to Google Cloud...
echo Note: Make sure gcloud CLI is configured
echo.
echo 1. Build the application:
call bun run build
echo.
echo 2. Deploy to Cloud Run:
echo gcloud run deploy virgin-fund --source . --platform managed --region us-central1 --allow-unauthenticated
goto :end

:help
echo Usage: deploy.bat [platform]
echo.
echo Platforms:
echo   vercel    - Deploy to Vercel
echo   netlify   - Deploy to Netlify
echo   docker    - Build Docker image
echo   aws       - Deploy to AWS
echo   gcp       - Deploy to Google Cloud
echo.
echo Examples:
echo   deploy.bat vercel
echo   deploy.bat docker
echo.
echo Prerequisites:
echo   - Node.js and bun installed
echo   - Platform CLI tools installed (vercel, netlify, aws, gcloud)
echo   - Environment variables configured
goto :end

:end
echo.
echo Deployment script completed.
pause
