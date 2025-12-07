'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Grid, List, Map, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const styles = [
  'All Styles',
  'Art Deco',
  'Beaux-Arts',
  'Gothic Revival',
  'Romanesque Revival',
  'Renaissance Revival',
  'Classical Revival',
  'Moderne',
  'International',
  'Victorian',
  'Italianate',
  'Greek Revival',
  'Colonial',
]

const sources = [
  { value: '', label: 'All Sources' },
  { value: 'aia', label: 'AIA Guide Only' },
  { value: 'ferry', label: 'Ferry Book Only' },
  { value: 'both', label: 'Both Sources' },
]

const statuses = [
  { value: '', label: 'All Buildings' },
  { value: 'extant', label: 'Extant' },
  { value: 'demolished', label: 'Demolished' },
]

const photoFilters = [
  { value: 'true', label: '📷 With Original Photos' },
  { value: 'all', label: 'All Buildings' },
]

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'All Styles') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/?${params.toString()}`)
  }

  const currentStyle = searchParams.get('style') || 'All Styles'
  const currentSource = searchParams.get('source') || ''
  const currentStatus = searchParams.get('status') || ''
  const currentPhotos = searchParams.get('photos') === 'all' ? 'all' : 'true'
  const currentSort = searchParams.get('sort') || 'name'

  const activeFiltersCount = [
    currentStyle !== 'All Styles',
    currentSource !== '',
    currentStatus !== '',
    currentPhotos !== 'true',
  ].filter(Boolean).length

  return (
    <div className="py-4 border-b border-gray-200">
      {/* Mobile: Compact filter bar */}
      <div className="flex items-center justify-between gap-2 md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-detroit-gold text-detroit-green text-xs px-1.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Photos filter - always visible on mobile */}
        <select
          value={currentPhotos}
          onChange={(e) => updateFilter('photos', e.target.value)}
          className="px-2 py-2 text-sm border border-detroit-gold bg-detroit-gold/10 rounded-lg focus:outline-none font-medium"
        >
          {photoFilters.map((filter) => (
            <option key={filter.value} value={filter.value}>{filter.label}</option>
          ))}
        </select>

        {/* View Toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button className="p-2 bg-detroit-green text-white">
            <Grid className="w-4 h-4" />
          </button>
          <Link href="/map" className="p-2 hover:bg-gray-100">
            <Map className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mobile: Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-2 mt-3 md:hidden">
          <select
            value={currentStyle}
            onChange={(e) => updateFilter('style', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
          >
            {styles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
          <select
            value={currentSource}
            onChange={(e) => updateFilter('source', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
          >
            {sources.map((source) => (
              <option key={source.value} value={source.value}>{source.label}</option>
            ))}
          </select>
          <select
            value={currentStatus}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
          >
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
            <option value="year">Year (Oldest)</option>
            <option value="-year">Year (Newest)</option>
            <option value="architect">Architect</option>
          </select>
        </div>
      )}

      {/* Desktop: Full filter bar */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Filters:</span>
          </div>

          <select
            value={currentStyle}
            onChange={(e) => updateFilter('style', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold"
          >
            {styles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>

          <select
            value={currentSource}
            onChange={(e) => updateFilter('source', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold"
          >
            {sources.map((source) => (
              <option key={source.value} value={source.value}>{source.label}</option>
            ))}
          </select>

          <select
            value={currentStatus}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          <select
            value={currentPhotos}
            onChange={(e) => updateFilter('photos', e.target.value)}
            className="px-3 py-2 rounded-lg border border-detroit-gold bg-detroit-gold/10 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold font-medium"
          >
            {photoFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold"
          >
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
            <option value="year">Year (Oldest)</option>
            <option value="-year">Year (Newest)</option>
            <option value="architect">Architect</option>
          </select>

          <div className="flex items-center border border-gray-200 overflow-hidden">
            <button className="p-2 bg-detroit-green text-white">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100">
              <List className="w-4 h-4" />
            </button>
            <Link href="/map" className="p-2 hover:bg-gray-100">
              <Map className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
