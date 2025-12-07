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
  
  // Set build date/time at build time
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
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


