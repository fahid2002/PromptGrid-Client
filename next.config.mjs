// Backend API target for proxy rewrites
const apiTarget = process.env.API_PROXY_TARGET || 'http://localhost:5000';

// Next.js configuration
const nextConfig = {
  // Proxy frontend /api requests to backend server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  },

  // Allowed external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;