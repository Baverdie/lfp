import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'scontent-cdg4-2.cdninstagram.com', 'cdninstagram.com', 'scontent-cdg4-1.cdninstagram.com', 'scontent-cdg4-3.cdninstagram.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;