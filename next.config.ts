import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // TMDB already serves correctly sized images from its own CDN, so we skip
    // Vercel's image optimizer (saves quota, avoids extra latency).
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" }],
  },
};

export default nextConfig;
