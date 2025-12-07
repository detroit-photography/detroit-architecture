/** @type {import('next').NextConfig} */
const nextConfig = {
  // Faster builds with SWC
  swcMinify: true,
  
  // Smaller deployment bundle
  output: 'standalone',
  
  // Skip type checking during build (faster deploys, rely on IDE/CI for types)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig


