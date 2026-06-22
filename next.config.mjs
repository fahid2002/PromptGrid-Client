// Backend API target for proxy rewrites
const renderApiTarget =
  process.env.API_PROXY_TARGET || 'https://promptgrid-server-fahid2002.onrender.com';

const apiTarget =
  process.env.USE_LOCAL_API === 'true'
    ? 'http://localhost:5000'
    : renderApiTarget;

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