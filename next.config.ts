import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: '/crafto-admin',
};

export default nextConfig;
