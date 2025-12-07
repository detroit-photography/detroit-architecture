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
  
  // Set build date at build time
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
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


