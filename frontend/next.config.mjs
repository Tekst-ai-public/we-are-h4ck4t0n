/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [

    ];
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
