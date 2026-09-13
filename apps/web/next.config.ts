import type { NextConfig } from 'next';

const apiOrigin = (process.env.API_ORIGIN || 'https://service-scheduler-ci6s.onrender.com').replace(
  /\/$/,
  '',
);

const config: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== 'production') return [];
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};
export default config;
