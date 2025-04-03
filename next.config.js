/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  experimental: {
    // Update serverActions format to match Next.js 15 requirements
    serverActions: {
      allowedOrigins: ["localhost:3000"],
      bodySizeLimit: "2mb",
    },
  },
  // This enables proper output format for containerized deployments (Coolify)
  output: "standalone",
};

module.exports = nextConfig;
