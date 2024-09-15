/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
