/** @type {import('next').NextConfig} */

import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  fallbacks: {
    document: '/offline.html',
  },
});

const nextConfig = {
  images: {
    domains: [
      'fastly.picsum.photos',
      'picsum.photos',
      'umemployeds1.blob.core.windows.net',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'umemployeds1.blob.core.windows.net',
        port: '',
        pathname: '/umemployedcont1/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/jobs/:id',
        destination: '/jobs/:id/details',
        permanent: true,
      },
    ];
  },
};

export default withPWA(nextConfig);
