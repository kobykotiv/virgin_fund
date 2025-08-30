# Bun + Next.js + Supabase + Demo Mode Dockerfile
FROM oven/bun:latest as base
WORKDIR /app
COPY . .
RUN bun install

# Set TESTING=true for local/dev
ENV TESTING=true

# Build Next.js app
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]
