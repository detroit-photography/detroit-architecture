import { Suspense } from 'react'
import { BuildingGrid } from '@/components/BuildingGrid'
import { SearchFilters } from '@/components/SearchFilters'
import { HeroSection } from '@/components/HeroSection'
import { StatsBar } from '@/components/StatsBar'

export default function HomePage() {
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


