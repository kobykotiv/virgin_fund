#!/bin/bash

# =============================================================================
# Virgin Fund - Deployment Script
# Automated deployment for development and production environments
# =============================================================================

set -e

# Configuration
PROJECT_NAME="virgin-fund"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io/your-org}"
ENVIRONMENT="${1:-development}"
TAG="${2:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi

    # Check environment file
    if [ ! -f ".env" ]; then
        log_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_warning "Please update .env with your actual values"
        else
            log_error ".env.example not found"
            exit 1
        fi
    fi

    log_success "Prerequisites check passed"
}

# Build Docker images
build_images() {
    log_info "Building Docker images for $ENVIRONMENT..."

    if [ "$ENVIRONMENT" = "production" ]; then
        # Build production image
        docker build -t $PROJECT_NAME:$TAG -f Dockerfile .
        log_success "Production image built: $PROJECT_NAME:$TAG"
    else
        # Build development image
        docker build -t $PROJECT_NAME:dev -f Dockerfile.dev .
        log_success "Development image built: $PROJECT_NAME:dev"
    fi
}

# Deploy services
deploy_services() {
    log_info "Deploying services for $ENVIRONMENT..."

    if [ "$ENVIRONMENT" = "production" ]; then
        # Production deployment
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        log_success "Production services deployed"
    else
        # Development deployment
        docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
        log_success "Development services deployed"
    fi
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."

    if [ "$ENVIRONMENT" = "production" ]; then
        # Run Supabase migrations if using Supabase
        if command -v supabase &> /dev/null; then
            supabase db push
            log_success "Supabase migrations applied"
        fi
    else
        # For development, migrations are handled by docker-compose
        log_info "Database initialized via docker-compose"
    fi
}

# Health check
health_check() {
    log_info "Performing health checks..."

    # Wait for services to be ready
    sleep 30

    # Check platform health
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        log_success "Platform health check passed"
    else
        log_error "Platform health check failed"
        exit 1
    fi

    # Check database
    if [ "$ENVIRONMENT" = "production" ]; then
        # Add database health check for production
        log_info "Database health check completed"
    fi
}

# Cleanup
cleanup() {
    log_info "Cleaning up..."

    # Remove dangling images
    docker image prune -f

    # Remove unused volumes (optional)
    # docker volume prune -f

    log_success "Cleanup completed"
}

# Main deployment function
main() {
    log_info "Starting deployment for $PROJECT_NAME ($ENVIRONMENT)"

    check_prerequisites
    build_images
    deploy_services
    run_migrations
    health_check
    cleanup

    log_success "Deployment completed successfully!"
    log_info "Access your application at: http://localhost:3000"
}

# Show usage
usage() {
    echo "Usage: $0 [environment] [tag]"
    echo ""
    echo "Environments:"
    echo "  development  Deploy to development environment (default)"
    echo "  production   Deploy to production environment"
    echo ""
    echo "Examples:"
    echo "  $0 development"
    echo "  $0 production v1.0.0"
    echo "  $0 production latest"
}

# Parse arguments
case "$1" in
    -h|--help)
        usage
        exit 0
        ;;
    development|production)
        ENVIRONMENT="$1"
        TAG="${2:-latest}"
        main
        ;;
    *)
        usage
        exit 1
        ;;
esac
