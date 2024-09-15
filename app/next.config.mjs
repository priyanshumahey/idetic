/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/localserver/:path*",
        destination: "https://660e-129-97-124-74.ngrok-free.app/:path*",
      },
    ];
  },
};

export default nextConfig;
