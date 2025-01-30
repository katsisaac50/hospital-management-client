import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  
  experimental: {
    esmExternals: true, // You can keep this experimental option if needed.
  },
  assetPrefix: process.env.GITHUB_PAGES ? '/<repository-name>/' : '',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.extensions = config.resolve.extensions || [];
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add aliases here if needed for easier module resolution
    };
    config.resolve.extensions.push('.js', '.jsx', '.json', '.ts', '.tsx', '.mjs', '.cjs');
    return config;
  },
};

export default nextConfig;
