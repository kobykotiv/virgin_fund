/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable standalone output for Docker deployments (Coolify)
  output: 'standalone',
  
  // Images configuration
  images: {
    domains: ['localhost', 'virginfund.com', 'assets.virginfund.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Environment variable configuration
  env: {
    DEPLOYMENT_PLATFORM: process.env.DEPLOYMENT_PLATFORM || 'unknown',
  },
  
  // Handle child_process issue
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
    };
    return config;
  },
  
  // Detect platform and adjust configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Deployment-Platform',
            value: process.env.DEPLOYMENT_PLATFORM || 'unknown',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
