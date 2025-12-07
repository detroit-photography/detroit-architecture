'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BuildingCard } from './BuildingCard'
import { supabase } from '@/lib/supabase'
import { Building } from '@/lib/database.types'

type BuildingWithPhotos = Building & { primary_photo_url?: string; photo_count?: number }

export function BuildingGrid() {
  const searchParams = useSearchParams()
  const [buildings, setBuildings] = useState<BuildingWithPhotos[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchBuildings() {
      setLoading(true)
      
      try {
        const photosParam = searchParams.get('photos')
        const showOnlyWithPhotos = photosParam !== 'all'

        // First, get ALL photos to know which buildings have them
        const { data: allPhotos } = await supabase
          .from('photos')
          .select('building_id, url, is_primary, photographer')
          .order('is_primary', { ascending: false })
          .order('sort_order')

        // Create a map of building_id -> photo info (excluding Street View from original count)
        const photoMap: Record<string, { url: string; originalCount: number; streetViewUrl: string }> = {}
        if (allPhotos) {
          for (const photo of allPhotos) {
            const isStreetView = photo.photographer === 'Google Street View'
            
            if (!photoMap[photo.building_id]) {
              photoMap[photo.building_id] = { 
                url: '',
                originalCount: 0,
                streetViewUrl: ''
              }
            }
            
            if (isStreetView) {
              // Store street view URL as fallback
              if (!photoMap[photo.building_id].streetViewUrl) {
                photoMap[photo.building_id].streetViewUrl = photo.url
              }
            } else {
              photoMap[photo.building_id].originalCount++
              // Use first original photo as primary if not already set
              if (!photoMap[photo.building_id].url) {
                photoMap[photo.building_id].url = photo.url
              }
            }
          }
        }
        
        // Only include buildings with ORIGINAL photos (not just street view)
        const buildingIdsWithOriginalPhotos = Object.keys(photoMap).filter(
          id => photoMap[id].originalCount > 0
        )

        // Build the query
        let query = supabase
          .from('buildings')
          .select('*', { count: 'exact' })

        // If filtering by photos, only get those buildings with ORIGINAL photos
        if (showOnlyWithPhotos && buildingIdsWithOriginalPhotos.length > 0) {
          query = query.in('id', buildingIdsWithOriginalPhotos)
        } else if (showOnlyWithPhotos && buildingIdsWithOriginalPhotos.length === 0) {
          // No original photos exist, show nothing
          setBuildings([])
          setTotal(0)
          setLoading(false)
          return
        }

        // Apply search
        const q = searchParams.get('q')
        if (q) {
          query = query.or(`name.ilike.%${q}%,architect.ilike.%${q}%,address.ilike.%${q}%,architectural_style.ilike.%${q}%`)
        }

        // Apply filters
        const style = searchParams.get('style')
        if (style && style !== 'All Styles') {
          query = query.ilike('architectural_style', `%${style}%`)
        }

        const status = searchParams.get('status')
        if (status) {
          query = query.eq('status', status)
        }

        const source = searchParams.get('source')
        if (source === 'aia') {
          query = query.not('aia_number', 'is', null)
        } else if (source === 'ferry') {
          query = query.not('ferry_number', 'is', null)
        } else if (source === 'both') {
          query = query.not('aia_number', 'is', null).not('ferry_number', 'is', null)
        }

        // Apply sorting
        const sort = searchParams.get('sort') || 'name'
        const descending = sort.startsWith('-')
        const sortField = descending ? sort.slice(1) : sort
        const sortColumn = sortField === 'year' ? 'year_built' : sortField
        query = query.order(sortColumn, { ascending: !descending, nullsFirst: false })

        // Pagination (only for "All Buildings" mode)
        if (!showOnlyWithPhotos) {
          const page = parseInt(searchParams.get('page') || '1')
          const limit = 24
          const from = (page - 1) * limit
          query = query.range(from, from + limit - 1)
        }

        const { data, error, count } = await query

        if (error) {
          console.error('Error fetching buildings:', error)
          setBuildings([])
          setTotal(0)
          setLoading(false)
          return
        }

        // Merge photo data with buildings (only counting original photos, but show street view as fallback image)
        const buildingsWithPhotos: BuildingWithPhotos[] = (data || []).map(b => ({
          ...b,
          // Use original photo if available, otherwise fall back to street view for display
          primary_photo_url: photoMap[b.id]?.url || photoMap[b.id]?.streetViewUrl || undefined,
          photo_count: photoMap[b.id]?.originalCount || 0  // Only count originals for the badge
        }))

        setBuildings(buildingsWithPhotos)
        setTotal(count || 0)
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setBuildings([])
        setTotal(0)
        setLoading(false)
      }
    }

    fetchBuildings()
  }, [searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mt-6 md:mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow-sm border border-gray-100">
            <div className="h-32 md:h-48 skeleton" />
            <div className="p-3 md:p-4">
              <div className="h-5 md:h-6 w-3/4 skeleton rounded mb-2" />
              <div className="h-4 w-1/2 skeleton rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (buildings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏛️</div>
        <h3 className="text-xl font-display text-gray-700 mb-2">No buildings found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  const photosParam = searchParams.get('photos')
  const showOnlyWithPhotos = photosParam !== 'all'

  return (
    <div>
      <p className="text-xs md:text-sm text-gray-500 mt-4 mb-4 md:mb-6">
        Showing {buildings.length} of {total} buildings
        {showOnlyWithPhotos && ' with original photos'}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {buildings.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
      </div>

      {/* Pagination - only for All Buildings mode */}
      {!showOnlyWithPhotos && total > 24 && (
        <div className="flex justify-center gap-1 md:gap-2 mt-8 md:mt-12 flex-wrap px-4">
          {Array.from({ length: Math.ceil(total / 24) }, (_, i) => i + 1).slice(0, 8).map((pageNum) => (
            <a
              key={pageNum}
              href={`?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: pageNum.toString() }).toString()}`}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-sm ${
                pageNum === parseInt(searchParams.get('page') || '1')
                  ? 'bg-detroit-green text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {pageNum}
            </a>
          ))}
          {Math.ceil(total / 24) > 8 && (
            <span className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-400">...</span>
          )}
        </div>
      )}
    </div>
  )
}
