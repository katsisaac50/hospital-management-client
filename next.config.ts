import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/es/Dom/canUseDom': path.resolve(
        __dirname,
        'node_modules/rc-util/es/Dom/canUseDom.js'
      ),
    };
    return config;
  },
};

export default nextConfig;
