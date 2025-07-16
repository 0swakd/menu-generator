import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Skip type checking during build if it's hanging
    ignoreBuildErrors: false,
  },
  eslint: {
    // Skip ESLint during build if it's hanging
    ignoreDuringBuilds: false,
  },
  // Optimize build performance
  experimental: {
    typedRoutes: false,
  },
  // Skip source map generation in production for faster builds
  ...(process.env.NODE_ENV === 'production' && {
    productionBrowserSourceMaps: false,
  }),
};

export default nextConfig;
