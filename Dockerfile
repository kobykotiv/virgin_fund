# =============================================================================
# Virgin Fund - PaaS Production Dockerfile
# Platform as a Service for Algorithmic Trading
# =============================================================================

# ================================
# Base Stage - Dependencies & Security
# ================================
FROM node:20-alpine AS base

# Install security updates and required packages
RUN apk add --no-cache \
    libc6-compat \
    curl \
    wget \
    ca-certificates \
    && update-ca-certificates

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# ================================
# Dependencies Stage - Install deps
# ================================
FROM base AS deps

# Copy package files
COPY package.json pnpm-lock.yaml* bun.lock* ./

# Install dependencies based on the available lockfile
RUN \
  if [ -f bun.lock ]; then \
    curl -fsSL https://bun.sh/install | bash && \
    export PATH="$HOME/.bun/bin:$PATH" && \
    bun install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && \
    pnpm install --frozen-lockfile; \
  else \
    npm ci; \
  fi

# ================================
# Builder Stage - Build application
# ================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN \
  if command -v bun >/dev/null 2>&1; then \
    bun run build; \
  else \
    npm run build; \
  fi

# ================================
# Runner Stage - Production runtime
# ================================
FROM base AS runner

# Copy runtime dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# ================================
# Configuration & Environment
# ================================

# Platform Environment Variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Platform Configuration
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# ================================
# Networking & Security
# ================================

# Expose platform port
EXPOSE 3000

# Platform startup command
CMD ["node", "server.js"]

# ================================
# Metadata & Labels
# ================================

LABEL org.opencontainers.image.title="Virgin Fund PaaS"
LABEL org.opencontainers.image.description="Platform as a Service for Algorithmic Trading"
LABEL org.opencontainers.image.vendor="Virgin Fund"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.source="https://github.com/kobykotiv/virgin_fund"
LABEL org.opencontainers.image.licenses="MIT"

# Platform-specific labels
LABEL platform.virgin-fund.type="trading-platform"
LABEL platform.virgin-fund.capabilities="real-time-trading,portfolio-management,backtesting"
LABEL platform.virgin-fund.dependencies="supabase,alpaca,nextjs"
