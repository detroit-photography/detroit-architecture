import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import dynamic from 'next/dynamic'
import Script from 'next/script'

// Optimized font loading - prevents render blocking
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
})

// Static navigation - keep as regular import for LCP
import { HeadshotsNavigation } from '@/components/headshots/HeadshotsNavigation'

// Lazy load footer - not critical for initial render
const HeadshotsFooter = dynamic(
  () => import('@/components/headshots/HeadshotsFooter').then(mod => ({ default: mod.HeadshotsFooter })),
  { ssr: true }
)

// Sticky mobile CTA for conversions
const StickyBookCTA = dynamic(
  () => import('@/components/headshots/StickyBookCTA').then(mod => ({ default: mod.StickyBookCTA })),
  { ssr: false }
)

export const metadata: Metadata = {
  title: {
    default: 'Detroit Photography | Professional Headshot Photographer',
    template: '%s | Detroit Photography'
  },
  description: 'Professional headshots by Detroit\'s #1-rated photo studio. Located at historic Bagley Mansion. Unlimited time, wardrobe changes & backdrops. Starting at $149.',
  keywords: [
    'Detroit headshots',
    'professional headshots Detroit',
    'corporate headshots Detroit',
    'headshot photographer near me',
    'business headshots Detroit',
    'LinkedIn headshots',
    'executive portraits Detroit',
    'team photos Detroit',
    'Bagley Mansion photography',
    'Detroit Photography'
  ],
  authors: [{ name: 'Andrew Petrov', url: 'https://www.detroitphotography.com' }],
  creator: 'Detroit Photography',
  publisher: 'Detroit Photography',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.detroitphotography.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Professional Headshots | Detroit Photography',
    description: 'Professional headshots by Detroit\'s #1-rated photo studio. Located at historic Bagley Mansion.',
    url: 'https://www.detroitphotography.com',
    siteName: 'Detroit Photography',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional Headshots by Detroit Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Headshots | Detroit Photography',
    description: 'Professional headshots by Detroit\'s #1-rated photo studio.',
    images: ['https://www.detroitphotography.com/images/headshots/hero-headshot.jpg'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
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
}

// JSON-LD structured data for local business
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.detroitphotography.com',
  name: 'Detroit Photography',
  description: 'Professional headshot photographer in Detroit, MI. Located at historic Bagley Mansion.',
  url: 'https://www.detroitphotography.com',
  telephone: '+1-313-351-8244',
  email: 'andrew@detroitphotography.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2921 E Jefferson Ave, Suite 101',
    addressLocality: 'Detroit',
    addressRegion: 'MI',
    postalCode: '48207',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 42.3436,
    longitude: -83.0176,
  },
  image: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '201',
  },
  openingHours: 'Mo-Su 09:00-21:00',
  sameAs: [
    'https://www.instagram.com/detroitphoto',
    'https://www.facebook.com/detroitphotography',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <head>
        <meta name="theme-color" content="#0d2e1f" />
        {/* Preload hero image for faster LCP */}
        <link
          rel="preload"
          as="image"
          href="/images/headshots/hero-headshot.jpg"
          type="image/jpeg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`min-h-screen flex flex-col ${montserrat.className}`}>
        <Providers>
          {/* HubSpot Tracking Code - lazy load for performance */}
          <Script
            id="hs-script-loader"
            src="//js.hs-scripts.com/46684962.js"
            strategy="lazyOnload"
          />
          {/* Google Analytics - lazy load for performance */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `}
          </Script>
          <HeadshotsNavigation />
          <main className="flex-grow">
            {children}
          </main>
          <HeadshotsFooter />
          <StickyBookCTA />
        </Providers>
      </body>
    </html>
  )
}
