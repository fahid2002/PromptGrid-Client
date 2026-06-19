const apiTarget = process.env.API_PROXY_TARGET || 'http://localhost:5000';
const nextConfig = { async rewrites() { return [{ source: '/api/:path*', destination: `${apiTarget}/api/:path*` }]; }, images: { remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }, { protocol: 'https', hostname: 'lh3.googleusercontent.com' }] } };
export default nextConfig;
