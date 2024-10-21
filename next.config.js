/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./lib/env.js');

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    ppr: false
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/datasets',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
