'use client'

import { useEffect, useState, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

// Note: Metadata must be in a separate file for client components
// See map/layout.tsx for SEO metadata
import Link from 'next/link'
import { Search, Filter, X, MapPin, ChevronRight, Camera, ChevronUp, List } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { BuildingListItem } from '@/lib/database.types'

type BuildingWithPhotos = BuildingListItem & { photo_count?: number; primary_photo_url?: string }

// Generate SEO-friendly slug from building name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-+/g, '-')
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const hasInitialized = useRef(false)
  
  const [buildings, setBuildings] = useState<BuildingWithPhotos[]>([])
  const [filteredBuildings, setFilteredBuildings] = useState<BuildingWithPhotos[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingWithPhotos | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    style: '',
    source: '',
    status: '',
    photos: 'true',
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileListExpanded, setMobileListExpanded] = useState(false)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) setSidebarOpen(true)
  }, [isMobile])

  // Fetch all buildings with coordinates, photo counts, and primary photos
  useEffect(() => {
    async function fetchBuildings() {
      // Exclude large wikipedia_entry column for performance
      const { data: buildingsData } = await supabase
        .from('buildings')
        .select('id, created_at, updated_at, name, alternate_names, address, city, lat, lng, architect, year_built, year_demolished, architectural_style, building_type, aia_number, aia_text, ferry_number, ferry_text, photographer_notes, status, featured')
        .not('lat', 'is', null)
        .not('lng', 'is', null)
      
      if (!buildingsData) return

      // Get photos with primary photo URL (excluding Street View from original count)
      const { data: photos } = await supabase
        .from('photos')
        .select('building_id, url, is_primary, photographer')
        .order('is_primary', { ascending: false })
        .order('sort_order')

      const photoData: Record<string, { originalCount: number; url: string; streetViewUrl: string }> = {}
      if (photos) {
        for (const p of photos) {
          const isStreetView = p.photographer === 'Google Street View'
          
          if (!photoData[p.building_id]) {
            photoData[p.building_id] = { 
              originalCount: 0, 
              url: '',
              streetViewUrl: ''
            }
          }
          
          if (isStreetView) {
            // Store street view URL as fallback
            if (!photoData[p.building_id].streetViewUrl) {
              photoData[p.building_id].streetViewUrl = p.url
            }
          } else {
            photoData[p.building_id].originalCount++
            // Use first original photo as primary
            if (!photoData[p.building_id].url) {
              photoData[p.building_id].url = p.url
            }
          }
        }
      }

      const buildingsWithPhotos = buildingsData.map(b => ({
        ...b,
        photo_count: photoData[b.id]?.originalCount || 0,  // Only count original photos
        // Use original photo if available, otherwise fall back to street view
        primary_photo_url: photoData[b.id]?.url || photoData[b.id]?.streetViewUrl || undefined
      }))

      setBuildings(buildingsWithPhotos)
      
      // Filter and find Guardian Building
      const withPhotos = buildingsWithPhotos.filter(b => b.photo_count && b.photo_count > 0)
      setFilteredBuildings(withPhotos)
      
      // Auto-select Guardian Building on initial load
      const guardian = withPhotos.find(b => b.name.toLowerCase().includes('guardian'))
      if (guardian && !hasInitialized.current) {
        hasInitialized.current = true
        setSelectedBuilding(guardian)
        setSelectedPhoto(guardian.primary_photo_url || null)
      }
    }
    fetchBuildings()
  }, [])

  // Filter buildings
  useEffect(() => {
    let result = buildings

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) ||
        b.architect?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q)
      )
    }

    if (filters.style) {
      result = result.filter(b => b.architectural_style?.includes(filters.style))
    }

    if (filters.source === 'aia') {
      result = result.filter(b => b.aia_number)
    } else if (filters.source === 'ferry') {
      result = result.filter(b => b.ferry_number)
    } else if (filters.source === 'both') {
      result = result.filter(b => b.aia_number && b.ferry_number)
    }

    if (filters.status) {
      result = result.filter(b => b.status === filters.status)
    }

    if (filters.photos !== 'all') {
      result = result.filter(b => b.photo_count && b.photo_count > 0)
    }

    setFilteredBuildings(result)
  }, [buildings, searchQuery, filters])

  // Initialize map and pan to Guardian Building
  useEffect(() => {
    const initMap = async () => {
      const L = (await import('leaflet')).default

      if (!mapRef.current || mapInstanceRef.current) return

      // Start centered on downtown Detroit
      const map = L.map(mapRef.current).setView([42.3314, -83.0458], 14)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Pan to Guardian Building once it's loaded
  useEffect(() => {
    if (selectedBuilding && mapInstanceRef.current && hasInitialized.current) {
      const guardian = buildings.find(b => b.name.toLowerCase().includes('guardian'))
      if (guardian && guardian.lat && guardian.lng && selectedBuilding.id === guardian.id) {
        mapInstanceRef.current.setView([guardian.lat, guardian.lng], 16)
      }
    }
  }, [selectedBuilding, buildings])

  // Get icon config based on building type
  const getIconConfig = (buildingType: string | null | undefined) => {
    const type = (buildingType || '').toLowerCase()
    
    // Religious - Purple
    if (['church', 'cathedral', 'temple', 'synagogue', 'monastery', 'chapel'].some(t => type.includes(t))) {
      return { 
        color: '#7c3aed', // violet
        icon: `<path d="M12 2v4m0 12v4m-4-8H4m16 0h-4m-2.5-5.5L12 7l-1.5 1.5m3 3L12 13l-1.5-1.5m3 3L12 16l-1.5-1.5" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
        label: 'Religious'
      }
    }
    // Residential - Green
    if (['house', 'mansion', 'estate', 'apartment', 'residential', 'townhouse', 'loft'].some(t => type.includes(t))) {
      return { 
        color: '#059669', // emerald
        icon: `<path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
        label: 'Residential'
      }
    }
    // Commercial/Office - Blue
    if (['office', 'skyscraper', 'tower', 'bank', 'corporate', 'headquarters', 'commercial'].some(t => type.includes(t))) {
      return { 
        color: '#2563eb', // blue
        icon: `<rect x="4" y="2" width="16" height="20" rx="1" stroke="white" stroke-width="2" fill="none"/><path d="M9 6h2m-2 4h2m-2 4h2m4-8h2m-2 4h2m-2 4h2" stroke="white" stroke-width="1.5" stroke-linecap="round"/>`,
        label: 'Office'
      }
    }
    // Cultural - Orange
    if (['theater', 'theatre', 'museum', 'library', 'concert', 'auditorium', 'gallery', 'arena'].some(t => type.includes(t))) {
      return { 
        color: '#ea580c', // orange
        icon: `<circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="none"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-4.2-5.8l1.4-1.4M6.8 17.2l-1.4 1.4m0-12.8l1.4 1.4m10.4 10.4l1.4 1.4" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
        label: 'Cultural'
      }
    }
    // Educational - Teal
    if (['school', 'academy', 'institute', 'university', 'college', 'education'].some(t => type.includes(t))) {
      return { 
        color: '#0891b2', // cyan
        icon: `<path d="M12 3L2 9l10 6 10-6-10-6z" stroke="white" stroke-width="2" fill="none"/><path d="M2 9v6m20-6v6M6 11.5v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
        label: 'Education'
      }
    }
    // Industrial - Slate
    if (['factory', 'plant', 'industrial', 'warehouse'].some(t => type.includes(t))) {
      return { 
        color: '#475569', // slate
        icon: `<path d="M2 20V8l6 4V8l6 4V8l6 4v12H2z" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M6 20v-4m6 4v-4m6 4v-4" stroke="white" stroke-width="2"/>`,
        label: 'Industrial'
      }
    }
    // Government - Indigo
    if (['courthouse', 'police', 'government', 'federal', 'city hall', 'municipal'].some(t => type.includes(t))) {
      return { 
        color: '#4f46e5', // indigo
        icon: `<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
        label: 'Government'
      }
    }
    // Hotels - Rose
    if (['hotel', 'inn'].some(t => type.includes(t))) {
      return { 
        color: '#e11d48', // rose
        icon: `<path d="M3 21V7a2 2 0 012-2h6v16M21 21V11a2 2 0 00-2-2h-6v12" stroke="white" stroke-width="2" fill="none"/><circle cx="9" cy="9" r="2" stroke="white" stroke-width="2" fill="none"/>`,
        label: 'Hotel'
      }
    }
    // Medical - Red
    if (['hospital', 'medical', 'clinic'].some(t => type.includes(t))) {
      return { 
        color: '#dc2626', // red
        icon: `<rect x="3" y="3" width="18" height="18" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M12 8v8m-4-4h8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`,
        label: 'Medical'
      }
    }
    // Transportation - Amber
    if (['station', 'terminal', 'bridge', 'viaduct'].some(t => type.includes(t))) {
      return { 
        color: '#d97706', // amber
        icon: `<rect x="4" y="3" width="16" height="18" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M4 11h16M9 18h1m4 0h1" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7" r="2" stroke="white" stroke-width="2" fill="none"/>`,
        label: 'Transit'
      }
    }
    // Default - Gold (with photo) or Gray
    return { 
      color: '#c4a962', // gold
      icon: `<circle cx="12" cy="12" r="8" stroke="white" stroke-width="2" fill="none"/>`,
      label: 'Other'
    }
  }

  // Update markers
  useEffect(() => {
    const updateMarkers = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current
      if (!map) return

      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      filteredBuildings.forEach(building => {
        if (!building.lat || !building.lng) return

        const isSelected = selectedBuilding?.id === building.id
        const hasPhotos = building.photo_count && building.photo_count > 0
        const isDemolished = building.status === 'demolished'
        
        let config = getIconConfig(building.building_type)
        
        // Override color for special states
        if (!hasPhotos && config.color === '#c4a962') {
          config = { ...config, color: '#9ca3af' } // gray for no photos on default type
        }
        if (isDemolished) {
          config = { ...config, color: '#991b1b' } // dark red for demolished
        }
        
        const size = isSelected ? 36 : 28
        const strokeWidth = isSelected ? 3 : 0
        
        const markerHtml = `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            ${isSelected ? 'filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));' : ''}
          ">
            <circle cx="12" cy="12" r="11" fill="${config.color}" stroke="${isSelected ? '#0d2e1f' : 'white'}" stroke-width="${isSelected ? 2 : 1}"/>
            <g transform="scale(0.6) translate(8, 8)">
              ${config.icon}
            </g>
          </svg>
        `
        
        const markerIcon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [size, size],
          iconAnchor: [size/2, size/2],
        })

        const marker = L.marker([building.lat, building.lng], { icon: markerIcon })
          .addTo(map)

        marker.on('click', () => {
          setSelectedBuilding(building)
          setSelectedPhoto(building.primary_photo_url || null)
          if (isMobile) setMobileListExpanded(false)
          map.setView([building.lat, building.lng], 16)
        })
        
        // Store building reference on marker
        ;(marker as any).buildingId = building.id
        markersRef.current.push(marker)
      })

      // Open popup for selected building
      if (selectedBuilding) {
        const selectedMarker = markersRef.current.find((m: any) => m.buildingId === selectedBuilding.id)
        if (selectedMarker) {
          // Update the marker icon to show selected state
        }
      }
    }

    updateMarkers()
  }, [filteredBuildings, selectedBuilding, isMobile])

  const selectAndPan = (building: BuildingWithPhotos) => {
    setSelectedBuilding(building)
    setSelectedPhoto(building.primary_photo_url || null)
    if (mapInstanceRef.current && building.lat && building.lng) {
      mapInstanceRef.current.setView([building.lat, building.lng], 16)
    }
    if (isMobile) {
      setMobileListExpanded(false)
      setSidebarOpen(false)
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row relative">
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex ${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 bg-white border-r overflow-hidden flex-col`}>
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buildings..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex gap-2 mt-3">
            <select
              value={filters.photos}
              onChange={(e) => setFilters({ ...filters, photos: e.target.value })}
              className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none bg-detroit-gold/10 border-detroit-gold font-medium"
            >
              <option value="true">📷 With Photos</option>
              <option value="all">All Buildings</option>
            </select>
            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none"
            >
              <option value="">All Sources</option>
              <option value="aia">AIA Only</option>
              <option value="ferry">Ferry Only</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="flex gap-2 mt-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="extant">Extant</option>
              <option value="demolished">Demolished</option>
            </select>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            Showing {filteredBuildings.length} of {buildings.length} buildings
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredBuildings.map(building => (
            <button
              key={building.id}
              onClick={() => selectAndPan(building)}
              className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors ${
                selectedBuilding?.id === building.id ? 'bg-detroit-gold/10 border-l-4 border-l-detroit-gold' : ''
              }`}
            >
              <div className="font-medium text-gray-900 line-clamp-1">{building.name}</div>
              <div className="text-sm text-gray-500 line-clamp-1">
                {building.year_built && `${building.year_built} • `}
                {building.architect?.split(',')[0]}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {building.photo_count && building.photo_count > 0 && (
                  <span className="text-xs bg-detroit-gold/20 text-detroit-green px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Camera className="w-3 h-3" /> {building.photo_count}
                  </span>
                )}
                {building.aia_number && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">AIA</span>
                )}
                {building.ferry_number && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Ferry</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="h-full w-full" />
        
        {/* Desktop: Toggle sidebar button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:block absolute top-4 left-4 z-[1000] bg-white shadow-lg rounded-lg p-2 hover:bg-gray-50"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
        </button>

        {/* Legend */}
        <div className="absolute bottom-20 md:bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur shadow-lg rounded-xl p-4 text-xs">
          <div className="font-semibold mb-3 text-sm text-gray-800">Building Types</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-violet-600"></div>
              <span className="text-gray-700">Religious</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
              <span className="text-gray-700">Residential</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="text-gray-700">Office</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-600"></div>
              <span className="text-gray-700">Cultural</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-600"></div>
              <span className="text-gray-700">Education</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
              <span className="text-gray-700">Government</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-600"></div>
              <span className="text-gray-700">Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-detroit-gold"></div>
              <span className="text-gray-700">Other</span>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              <span className="text-gray-600">No Photos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-800"></div>
              <span className="text-gray-600">Demolished</span>
            </div>
          </div>
        </div>

        {/* Selected building popup with photo (desktop) */}
        {selectedBuilding && !isMobile && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white shadow-xl rounded-xl overflow-hidden max-w-md w-full">
            {/* Photo */}
            {selectedPhoto && (
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={selectedPhoto} 
                  alt={selectedBuilding.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-4 relative">
              <button
                onClick={() => {
                  setSelectedBuilding(null)
                  setSelectedPhoto(null)
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="font-display text-xl pr-6">{selectedBuilding.name}</h3>
              <div className="text-sm text-gray-600 mt-1">
                {selectedBuilding.architect && <div>{selectedBuilding.architect}</div>}
                {selectedBuilding.year_built && <div>{selectedBuilding.year_built}</div>}
                {selectedBuilding.address && (
                  <div className="flex items-center gap-1 text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    {selectedBuilding.address}
                  </div>
                )}
              </div>
              <Link
                href={`/architecture/building/${generateSlug(selectedBuilding.name)}`}
                className="mt-3 inline-flex items-center gap-1 bg-detroit-green text-white px-4 py-2 rounded-lg text-sm hover:bg-detroit-gold hover:text-detroit-green transition-colors"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Bottom sheet */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white shadow-2xl rounded-t-2xl transition-all duration-300 ${
        mobileListExpanded ? 'h-[70vh]' : selectedBuilding ? 'h-auto' : 'h-auto'
      }`}>
        {/* Handle */}
        <button
          onClick={() => setMobileListExpanded(!mobileListExpanded)}
          className="w-full flex justify-center py-2"
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </button>

        {/* Search & Filters */}
        <div className="px-4 pb-2 border-b">
          <div className="relative mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buildings..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-detroit-gold"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <select
              value={filters.photos}
              onChange={(e) => setFilters({ ...filters, photos: e.target.value })}
              className="px-2 py-1 text-xs border rounded bg-detroit-gold/10 border-detroit-gold font-medium whitespace-nowrap"
            >
              <option value="true">📷 With Photos</option>
              <option value="all">All</option>
            </select>
            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="px-2 py-1 text-xs border rounded whitespace-nowrap"
            >
              <option value="">All Sources</option>
              <option value="aia">AIA</option>
              <option value="ferry">Ferry</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-2 py-1 text-xs border rounded whitespace-nowrap"
            >
              <option value="">All Status</option>
              <option value="extant">Extant</option>
              <option value="demolished">Demolished</option>
            </select>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{filteredBuildings.length} buildings</span>
            <button
              onClick={() => setMobileListExpanded(!mobileListExpanded)}
              className="flex items-center gap-1 text-detroit-green font-medium"
            >
              <List className="w-4 h-4" />
              {mobileListExpanded ? 'Hide List' : 'Show List'}
              <ChevronUp className={`w-4 h-4 transition-transform ${mobileListExpanded ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>

        {/* Selected Building with photo (mobile) */}
        {selectedBuilding && !mobileListExpanded && (
          <div className="border-b">
            {/* Photo */}
            {selectedPhoto && (
              <div className="h-32 w-full overflow-hidden">
                <img 
                  src={selectedPhoto} 
                  alt={selectedBuilding.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-4 relative">
              <button
                onClick={() => {
                  setSelectedBuilding(null)
                  setSelectedPhoto(null)
                }}
                className="absolute top-2 right-2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-display text-lg pr-6">{selectedBuilding.name}</h3>
              <div className="text-sm text-gray-600">
                {selectedBuilding.year_built && <span>{selectedBuilding.year_built} • </span>}
                {selectedBuilding.architect?.split(',')[0]}
              </div>
              <Link
                href={`/architecture/building/${generateSlug(selectedBuilding.name)}`}
                className="mt-2 inline-flex items-center gap-1 bg-detroit-green text-white px-4 py-2 rounded-lg text-sm"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Building List (mobile) */}
        {mobileListExpanded && (
          <div className="overflow-y-auto" style={{ height: 'calc(70vh - 160px)' }}>
            {filteredBuildings.map(building => (
              <button
                key={building.id}
                onClick={() => selectAndPan(building)}
                className={`w-full text-left p-3 border-b hover:bg-gray-50 ${
                  selectedBuilding?.id === building.id ? 'bg-detroit-gold/10' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  {building.primary_photo_url && (
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={building.primary_photo_url} 
                        alt={building.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm line-clamp-1">{building.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {building.year_built && `${building.year_built} • `}
                      {building.architect?.split(',')[0]}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {building.photo_count && building.photo_count > 0 && (
                        <span className="text-xs bg-detroit-gold/20 text-detroit-green px-1 py-0.5 rounded">📷 {building.photo_count}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
