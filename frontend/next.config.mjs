/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/page',
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
