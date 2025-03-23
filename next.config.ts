import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  basePath: '/crafto-admin', 
  assetPrefix: '/crafto-admin',
};

export default nextConfig;
