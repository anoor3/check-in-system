/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000']
    }
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
