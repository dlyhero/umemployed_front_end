/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
       domains: ['fastly.picsum.photos', "picsum.photos"],
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
