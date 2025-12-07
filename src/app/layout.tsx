import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Detroit Architecture Repository | Historic Buildings Guide by Detroit Photography',
    template: '%s | Detroit Architecture Repository'
  },
  description: 'Explore 550+ historic Detroit buildings with original photography. Comprehensive guide featuring Art Deco, Beaux-Arts, and Gothic Revival architecture from Albert Kahn, Minoru Yamasaki, and more.',
  keywords: [
    'Detroit architecture',
    'historic buildings Detroit',
    'Detroit Photography',
    'Albert Kahn buildings',
    'Art Deco Detroit',
    'Guardian Building',
    'Fisher Building',
    'Michigan Central Station',
    'Detroit skyscrapers',
    'AIA Detroit Guide',
    'Buildings of Detroit',
    'Detroit architectural history',
    'Michigan architecture',
    'Detroit landmarks',
    'historic preservation Detroit'
  ],
  authors: [{ name: 'Andrew Petrov', url: 'https://www.detroitphotography.com' }],
  creator: 'Detroit Photography',
  publisher: 'Detroit Photography',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://detroit-architecture.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Detroit Architecture Repository | 550+ Historic Buildings',
    description: 'Explore Detroit\'s architectural heritage with original photography. From Art Deco masterpieces to modernist landmarks.',
    url: 'https://detroit-architecture.vercel.app',
    siteName: 'Detroit Architecture Repository',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Detroit Architecture Repository - Historic Buildings of Detroit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detroit Architecture Repository | Historic Buildings Guide',
    description: 'Explore 550+ historic Detroit buildings with original photography by Detroit Photography.',
    creator: '@detroitphoto',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Detroit Architecture Repository',
  description: 'Comprehensive guide to 550+ historic Detroit buildings with original photography',
  url: 'https://detroit-architecture.vercel.app',
  author: {
    '@type': 'Organization',
    name: 'Detroit Photography',
    url: 'https://www.detroitphotography.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Detroit Photography',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.detroitphotography.com/logo.png',
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://detroit-architecture.vercel.app/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0d2e1f" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
