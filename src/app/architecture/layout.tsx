import type { Metadata } from 'next'
import { ArchitectureLayout } from '@/components/ArchitectureLayout'

export const metadata: Metadata = {
  title: {
    default: 'Detroit Architecture Repository | Historic Buildings Guide',
    template: '%s | Detroit Architecture Repository'
  },
  description: 'Explore 550+ historic Detroit buildings with original photography. Comprehensive guide featuring Art Deco, Beaux-Arts, and Gothic Revival architecture from Albert Kahn, Minoru Yamasaki, and more.',
  keywords: [
    'Detroit architecture',
    'historic buildings Detroit',
    'Albert Kahn buildings',
    'Art Deco Detroit',
    'Guardian Building',
    'Fisher Building',
    'Michigan Central Station',
    'Detroit skyscrapers',
  ],
}

// JSON-LD structured data for architecture section
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Detroit Architecture Repository',
  description: 'Comprehensive guide to 550+ historic Detroit buildings with original photography',
  url: 'https://www.detroitphotography.com/architecture',
  author: {
    '@type': 'Organization',
    name: 'Detroit Photography',
    url: 'https://www.detroitphotography.com',
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
