/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async rewrites() {
    // Samo za development - u produkciji nginx radi proxy
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5002/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
