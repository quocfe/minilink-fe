/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  /**
   * Proxy tất cả API calls qua Next.js để tránh cross-domain cookie issue.
   * Browser gọi /api/proxy/* (same-origin) → Next.js forward tới backend
   * kèm toàn bộ request headers, bao gồm Cookie.
   */
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:8000';

    return [
      {
        source: '/api/proxy/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

