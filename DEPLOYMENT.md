# Virgin Fund - Deployment Guide

## Overview

This guide covers the deployment of the Virgin Fund platform using Docker and Docker Compose for both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- Bash shell (for deployment script)

## Quick Start

### Development Deployment

```bash
# Clone the repository
git clone <repository-url>
cd virgin-fund

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Deploy to development
./scripts/deploy.sh development
```

### Production Deployment

```bash
# Deploy to production
./scripts/deploy.sh production v1.0.0

# Or deploy latest
./scripts/deploy.sh production latest
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
POSTGRES_DB=virgin_fund
POSTGRES_USER=virgin_fund_user
POSTGRES_PASSWORD=your_secure_password

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis
REDIS_PASSWORD=your_redis_password

# Alpaca Trading
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_API_SECRET=your_alpaca_api_secret
ALPACA_BASE_URL=https://api.alpaca.markets

# JWT
JWT_SECRET=your_jwt_secret

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## Architecture

### Development Environment

- **Platform**: Next.js development server with hot reload
- **Database**: PostgreSQL with Supabase local development
- **Cache**: Redis for session and data caching
- **Networking**: Local development networking

### Production Environment

- **Platform**: Optimized Next.js production build
- **Database**: PostgreSQL with persistent storage
- **Cache**: Redis with persistence
- **Proxy**: Nginx reverse proxy with SSL termination
- **Networking**: Production-grade networking

## Services

### Core Services

1. **virgin-fund-platform**: Main Next.js application
2. **postgres**: PostgreSQL database
3. **redis**: Redis cache
4. **nginx**: Reverse proxy (production only)

### Development Services

1. **supabase**: Local Supabase development environment

## File Structure

```
virgin-fund/
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Base Docker Compose configuration
├── docker-compose.override.yml  # Development overrides
├── docker-compose.prod.yml     # Production configuration
├── nginx/
│   └── nginx.conf         # Nginx configuration
├── scripts/
│   ├── deploy.sh          # Deployment script
│   └── init-db.sql        # Database initialization
└── .env                   # Environment variables
```

## Deployment Process

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

### 2. SSL Certificates (Production)

For production deployment with HTTPS:

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Place your certificates
# nginx/ssl/cert.pem
# nginx/ssl/key.pem
```

### 3. Database Initialization

The database is automatically initialized with the `scripts/init-db.sql` script during first startup.

### 4. Deployment

```bash
# Development
./scripts/deploy.sh development

# Production
./scripts/deploy.sh production v1.0.0
```

## Monitoring and Health Checks

### Health Check Endpoint

The platform provides a health check endpoint at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

Response includes:
- Overall platform status
- Service health (Supabase, Redis, Alpaca)
- Uptime and version information

### Logs

```bash
# View platform logs
docker-compose logs virgin-fund-platform

# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f
```

## Scaling

### Horizontal Scaling

For production scaling:

```bash
# Scale the platform service
docker-compose up -d --scale virgin-fund-platform=3
```

### Database Scaling

For database scaling, consider:
- Connection pooling
- Read replicas
- Database sharding

## Backup and Recovery

### Database Backup

```bash
# Backup PostgreSQL data
docker exec virgin-fund-postgres pg_dump -U virgin_fund_user virgin_fund > backup.sql

# Backup Redis data
docker exec virgin-fund-redis redis-cli --raw KEYS "*" | xargs redis-cli DEL
```

### Volume Backup

```bash
# Backup Docker volumes
docker run --rm -v virgin-fund_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000

   # Stop conflicting services
   sudo systemctl stop apache2
   ```

2. **Permission issues**
   ```bash
   # Fix Docker permissions
   sudo usermod -aG docker $USER
   ```

3. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs postgres

   # Test connection
   docker exec -it virgin-fund-postgres psql -U virgin_fund_user -d virgin_fund
   ```

### Logs and Debugging

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs virgin-fund-platform

# Follow logs in real-time
docker-compose logs -f virgin-fund-platform

# View last 100 lines
docker-compose logs --tail=100 virgin-fund-platform
```

## Security Considerations

### Production Security

1. **Environment Variables**: Never commit secrets to version control
2. **Network Security**: Use internal networks for service communication
3. **SSL/TLS**: Always use HTTPS in production
4. **Updates**: Regularly update Docker images and dependencies
5. **Monitoring**: Implement logging and monitoring solutions

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw --force enable
```

## Performance Optimization

### Docker Optimization

1. **Multi-stage builds**: Reduces image size
2. **Layer caching**: Optimize Dockerfile for better caching
3. **Resource limits**: Set CPU and memory limits

### Application Optimization

1. **Next.js optimization**: Enable production optimizations
2. **Database indexing**: Ensure proper database indexes
3. **Caching**: Implement Redis caching strategies
4. **CDN**: Use CDN for static assets

## Maintenance

### Regular Maintenance Tasks

```bash
# Update Docker images
docker-compose pull

# Clean up unused resources
docker system prune -f

# Rotate logs
docker-compose logs --no-color > logs_$(date +%Y%m%d).txt

# Backup data
./scripts/backup.sh
```

### Updates

```bash
# Update application
git pull origin main
./scripts/deploy.sh production

# Update dependencies
docker-compose exec virgin-fund-platform npm update
```

## Support

For issues and questions:
1. Check the logs: `docker-compose logs`
2. Review the health check: `curl http://localhost:3000/api/health`
3. Check Docker status: `docker ps`
4. Review this documentation

## Contributing

When making changes to the deployment:
1. Update this README
2. Test in development environment
3. Test in production environment
4. Update deployment scripts as needed
