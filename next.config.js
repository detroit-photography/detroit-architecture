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
      {
        protocol: 'https',
        hostname: 'qjxuiljsgrmymeayoqzi.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.squarespace-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile photos
      },
    ],
    // Optimize images for faster loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    // Minimize image processing time
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    // Limit concurrent image optimizations for faster response
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports - tree shake lucide icons
    optimizePackageImports: ['lucide-react'],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // HTTP response headers for caching and performance
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  
  // Redirects from old /headshots/* URLs to new /* URLs
  async redirects() {
    return [
      // Main headshots redirect
      {
        source: '/headshots',
        destination: '/',
        permanent: true,
      },
      // Catch-all redirect for /headshots/* to /*
      {
        source: '/headshots/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Old building URLs redirect to new architecture paths
      {
        source: '/building/:id*',
        destination: '/architecture/building/:id*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig


