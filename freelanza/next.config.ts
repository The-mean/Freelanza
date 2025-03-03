import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Exclude certain directories from being processed
  webpack: (config, { isServer }) => {
    // Ignore the backend and freelanza-frontend directories
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/backend/**', '**/freelanza-frontend/**', '**/node_modules/**']
    };
    return config;
  },
};

export default nextConfig;
