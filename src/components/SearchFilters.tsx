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
    router.push(`/architecture?${params.toString()}`)
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
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <Filter className="w-4 h-4" aria-hidden="true" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-detroit-gold text-detroit-green text-xs px-1.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {/* Photos filter - always visible on mobile */}
        <label className="sr-only" htmlFor="mobile-photos-filter">Filter by photos</label>
        <select
          id="mobile-photos-filter"
          value={currentPhotos}
          onChange={(e) => updateFilter('photos', e.target.value)}
          className="px-2 py-2 text-sm border border-detroit-gold bg-detroit-gold/10 rounded-lg focus:outline-none font-medium"
        >
          {photoFilters.map((filter) => (
            <option key={filter.value} value={filter.value}>{filter.label}</option>
          ))}
        </select>

        {/* View Toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden" role="group" aria-label="View options">
          <button className="p-2 bg-detroit-green text-white" aria-label="Grid view" aria-pressed="true">
            <Grid className="w-4 h-4" aria-hidden="true" />
          </button>
          <Link href="/architecture/map" className="p-2 hover:bg-gray-100" aria-label="Map view">
            <Map className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Mobile: Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-2 mt-3 md:hidden">
          <div>
            <label className="sr-only" htmlFor="mobile-style-filter">Architectural style</label>
            <select
              id="mobile-style-filter"
              value={currentStyle}
              onChange={(e) => updateFilter('style', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
            >
              {styles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="mobile-source-filter">Source</label>
            <select
              id="mobile-source-filter"
              value={currentSource}
              onChange={(e) => updateFilter('source', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
            >
              {sources.map((source) => (
                <option key={source.value} value={source.value}>{source.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="mobile-status-filter">Building status</label>
            <select
              id="mobile-status-filter"
              value={currentStatus}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="mobile-sort">Sort by</label>
            <select
              id="mobile-sort"
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
            >
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="year">Year (Oldest)</option>
              <option value="-year">Year (Newest)</option>
              <option value="architect">Architect</option>
            </select>
          </div>
        </div>
      )}

      {/* Desktop: Full filter bar */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" aria-hidden="true" />
            <span id="filters-label">Filters:</span>
          </div>

          <label className="sr-only" htmlFor="desktop-style-filter">Architectural style</label>
          <select
            id="desktop-style-filter"
            value={currentStyle}
            onChange={(e) => updateFilter('style', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold"
          >
            {styles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="desktop-source-filter">Source</label>
          <select
            id="desktop-source-filter"
            value={currentSource}
            onChange={(e) => updateFilter('source', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold"
          >
            {sources.map((source) => (
              <option key={source.value} value={source.value}>{source.label}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="desktop-status-filter">Building status</label>
          <select
            id="desktop-status-filter"
            value={currentStatus}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="desktop-photos-filter">Filter by photos</label>
          <select
            id="desktop-photos-filter"
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
          <label className="sr-only" htmlFor="desktop-sort">Sort by</label>
          <select
            id="desktop-sort"
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

          <div className="flex items-center border border-gray-200 overflow-hidden" role="group" aria-label="View options">
            <button className="p-2 bg-detroit-green text-white" aria-label="Grid view" aria-pressed="true">
              <Grid className="w-4 h-4" aria-hidden="true" />
            </button>
            <button className="p-2 hover:bg-gray-100" aria-label="List view" aria-pressed="false">
              <List className="w-4 h-4" aria-hidden="true" />
            </button>
            <Link href="/architecture/map" className="p-2 hover:bg-gray-100" aria-label="Map view">
              <Map className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
