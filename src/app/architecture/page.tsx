import { Suspense } from 'react'
import { BuildingGrid } from '@/components/BuildingGrid'
import { SearchFilters } from '@/components/SearchFilters'
import { HeroSection } from '@/components/HeroSection'
import { StatsBar } from '@/components/StatsBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Detroit Architecture Repository | Historic Buildings Database',
  description: 'The most comprehensive database of Detroit\'s historic architecture. 550+ buildings with National Register of Historic Places data, original photography, and detailed documentation.',
  keywords: [
    'Detroit architecture',
    'Detroit architecture repository', 
    'historic buildings Detroit',
    'National Register of Historic Places Detroit',
    'NRHP Michigan',
    'Detroit historic preservation',
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
    canonical: 'https://www.detroitphotography.com/architecture',
  },
  other: {
    'og:url': 'https://www.detroitphotography.com/architecture',
  },
}

export default function ArchitectureHomePage() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SearchFilters />
        
        <Suspense fallback={<BuildingGridSkeleton />}>
          <BuildingGrid />
        </Suspense>
      </div>
    </div>
  )
}

function BuildingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="h-48 skeleton" />
          <div className="p-4">
            <div className="h-6 w-3/4 skeleton rounded mb-2" />
            <div className="h-4 w-1/2 skeleton rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
