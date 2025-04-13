/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'umemployeds1.blob.core.windows.net',
            port: '',
            pathname: '/umemployedcont1/**', 
          },
        ],
      },
};

export default nextConfig;
