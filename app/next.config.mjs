/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/localserver/:path*",
        destination: "https://b2b1-129-97-124-74.ngrok-free.app/:path*",
      },
    ];
  },
};

export default nextConfig;
