/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
       domains: ['fastly.picsum.photos', "picsum.photos", "umemployeds1.blob.core.windows.net"],
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

export default nextConfig;
