import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.convex.cloud',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/vchtech/**",
      },
    ],
  }
};

export default nextConfig;
