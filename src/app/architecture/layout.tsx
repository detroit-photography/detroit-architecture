import type { Metadata } from 'next'
import { ArchitectureLayout } from '@/components/ArchitectureLayout'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.detroitphotography.com'),
  title: {
    default: 'Detroit Architecture Repository | Historic Buildings Database',
    template: '%s | Detroit Architecture Repository'
  },
  description: 'The most comprehensive database of Detroit\'s historic architecture. 550+ buildings with National Register of Historic Places data, original photography, and detailed documentation.',
  keywords: [
    'Detroit architecture',
    'Detroit architecture repository',
    'historic buildings Detroit',
    'National Register of Historic Places Detroit',
    'NRHP Michigan',
    'Albert Kahn buildings',
    'Art Deco Detroit',
    'Guardian Building',
    'Fisher Building',
    'Michigan Central Station',
    'Detroit skyscrapers',
    'Detroit historic preservation',
    'Wayne County historic buildings',
  ],
  openGraph: {
    title: 'Detroit Architecture Repository | Historic Buildings Database',
    description: 'The most comprehensive database of Detroit\'s historic architecture. 550+ buildings with NRHP data and original photography.',
    url: 'https://www.detroitphotography.com/architecture',
    siteName: 'Detroit Architecture Repository',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://qjxuiljsgrmymeayoqzi.supabase.co/storage/v1/object/public/photos/buildings/guardian-building.jpg',
        width: 1200,
        height: 630,
        alt: 'Detroit Architecture Repository - Guardian Building',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detroit Architecture Repository | Historic Buildings Database',
    description: '550+ historic Detroit buildings with National Register data and original photography.',
    images: ['https://qjxuiljsgrmymeayoqzi.supabase.co/storage/v1/object/public/photos/buildings/guardian-building.jpg'],
  },
  alternates: {
    canonical: '/architecture',
  },
}

// JSON-LD structured data for architecture section
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Detroit Architecture Repository',
  description: 'The most comprehensive database of Detroit\'s historic architecture with National Register of Historic Places data',
  url: 'https://www.detroitphotography.com/architecture',
  author: {
    '@type': 'Organization',
    name: 'Detroit Photography',
    url: 'https://www.detroitphotography.com',
  },
  about: {
    '@type': 'Thing',
    name: 'Historic Architecture of Detroit',
    description: 'Documentation of Detroit\'s architectural heritage including Art Deco, Beaux-Arts, Gothic Revival, and modernist buildings',
  },
}

export default function ArchitectureSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArchitectureLayout>
        {children}
      </ArchitectureLayout>
    </>
  )
}
