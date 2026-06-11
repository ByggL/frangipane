import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    localPatterns: [
      {
        pathname: "/api/**",
      },
    ],
  },
  cacheComponents: true,
  devIndicators: false,
};

export default nextConfig;
