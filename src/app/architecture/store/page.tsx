'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check, Camera, Building2, Filter, X, MapPin, Star, Tag, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/cart-context'

interface PrintPhoto {
  id: string
  url: string
  caption: string | null
  building_id: string
  building_name: string
  building_address: string | null
  year_built: string | null
  architect: string | null
  is_featured?: boolean
}

type SizeOption = '11x17' | '13x19'
type LocationFilter = 'michigan' | 'worldwide'

const PRICES: Record<SizeOption, number> = {
  '11x17': 100,
  '13x19': 150,
}

const SIZE_LABELS: Record<SizeOption, string> = {
  '11x17': '11×17" Framed',
  '13x19': '13×19" Framed',
}

// Bulk discount tiers
const BULK_DISCOUNTS = [
  { qty: 5, percent: 25 },
  { qty: 4, percent: 20 },
  { qty: 3, percent: 14 },
  { qty: 2, percent: 10 },
]

export default function StorePage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<PrintPhoto[]>([])
  const [featuredPhotos, setFeaturedPhotos] = useState<PrintPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [filterBuilding, setFilterBuilding] = useState<string>('')
  const [filterLocation, setFilterLocation] = useState<LocationFilter>('michigan')
  const { addItem, totalItems } = useCart()
  
  // Lightbox state
  const [lightboxPhoto, setLightboxPhoto] = useState<PrintPhoto | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  
  // Size modal state
  const [sizeModalPhoto, setSizeModalPhoto] = useState<PrintPhoto | null>(null)

  // Helper to check if a photo is in Michigan
  const isMichiganPhoto = (photo: PrintPhoto) => {
    const addr = (photo.building_address || '').toLowerCase()
    return addr.includes('michigan') || 
           addr.includes(', mi') || 
           addr.includes(' mi ') ||
           addr.includes('detroit') ||
           addr.includes('grosse pointe') ||
           addr.includes('dearborn') ||
           addr.includes('ann arbor') ||
           addr.includes('flint') ||
           // Default to Michigan if no address (since most are Detroit buildings)
           !photo.building_address
  }

  useEffect(() => {
    async function loadPrints() {
      // First, get all featured buildings
      const { data: featuredBuildings } = await supabase
        .from('buildings')
        .select('id, name, address, year_built, architect')
        .eq('featured', true)
        .order('name')

      // Get all photos (exclude street view)
      const { data: photosData, error } = await supabase
        .from('photos')
        .select(`
          id,
          url,
          caption,
          building_id,
          is_primary,
          photographer,
          buildings (
            id,
            name,
            address,
            year_built,
            architect,
            featured
          )
        `)
        .neq('photographer', 'Google Street View')
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading prints:', error)
        setLoading(false)
        return
      }

      // Transform photo data
      const prints: PrintPhoto[] = (photosData || [])
        .filter((p: any) => p.buildings)
        .map((p: any) => ({
          id: p.id,
          url: p.url,
          caption: p.caption,
          building_id: p.building_id,
          building_name: p.buildings.name,
          building_address: p.buildings.address,
          year_built: p.buildings.year_built,
          architect: p.buildings.architect,
          is_featured: p.buildings.featured,
        }))

      // Create a map of building_id -> photos for featured buildings
      const featuredBuildingIds = new Set((featuredBuildings || []).map(b => b.id))
      
      // Get photos for featured buildings (prioritize primary photos)
      const featuredPrints: PrintPhoto[] = []
      const seenFeaturedBuildings = new Set<string>()
      
      // First pass: get primary photos from featured buildings
      for (const print of prints) {
        if (featuredBuildingIds.has(print.building_id) && !seenFeaturedBuildings.has(print.building_id)) {
          featuredPrints.push({ ...print, is_featured: true })
          seenFeaturedBuildings.add(print.building_id)
        }
      }
      
      // Regular prints (non-featured buildings only)
      const regular = prints.filter(p => !featuredBuildingIds.has(p.building_id))

      setFeaturedPhotos(featuredPrints)
      setPhotos(regular)
      setLoading(false)
    }

    loadPrints()
  }, [])

  const handleAddToCart = (photo: PrintPhoto, size: SizeOption) => {
    addItem({
      photoId: photo.id,
      photoUrl: photo.url,
      buildingName: photo.building_name,
      buildingId: photo.building_id,
      caption: photo.caption,
      size,
      price: PRICES[size],
    })
    setSizeModalPhoto(null)
    router.push('/architecture/store/cart')
  }

  // Combine all photos for filtering
  const allPhotos = [...featuredPhotos, ...photos]

  // Filter by location first
  const locationFilteredPhotos = filterLocation === 'michigan'
    ? allPhotos.filter(isMichiganPhoto)
    : allPhotos

  // Get unique buildings for filter (from location-filtered photos)
  const buildings = [...new Set(locationFilteredPhotos.map(p => p.building_name))].sort()

  // Filter photos by building
  const filteredPhotos = filterBuilding
    ? locationFilteredPhotos.filter(p => p.building_name === filterBuilding)
    : locationFilteredPhotos
  
  // Separate featured from regular in filtered results
  const filteredFeatured = filteredPhotos.filter(p => p.is_featured)
  const filteredRegular = filteredPhotos.filter(p => !p.is_featured)

  // Lightbox navigation
  const openLightbox = (photo: PrintPhoto) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id)
    setLightboxIndex(index)
    setLightboxPhoto(photo)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (lightboxIndex + 1) % filteredPhotos.length
      : (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    setLightboxIndex(newIndex)
    setLightboxPhoto(filteredPhotos[newIndex])
  }

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return
      if (e.key === 'Escape') setLightboxPhoto(null)
      if (e.key === 'ArrowLeft') navigateLightbox('prev')
      if (e.key === 'ArrowRight') navigateLightbox('next')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxPhoto, lightboxIndex])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-detroit-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prints...</p>
        </div>
      </div>
    )
  }

  // Photo card component
  const PhotoCard = ({ photo, featured = false }: { photo: PrintPhoto; featured?: boolean }) => (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${featured ? 'ring-2 ring-detroit-gold' : ''}`}
    >
      <div 
        className="relative aspect-[4/3] bg-gray-100 cursor-pointer group"
        onClick={() => openLightbox(photo)}
      >
        <Image
          src={photo.url}
          alt={photo.caption || photo.building_name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {featured && (
          <div className="absolute top-2 left-2 bg-detroit-gold text-detroit-green px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-gray-900 line-clamp-1">{photo.building_name}</h3>
        {photo.caption && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{photo.caption}</p>}
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
          {photo.year_built && <span>{photo.year_built}</span>}
          {photo.architect && <span>• {photo.architect.split(',')[0]}</span>}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-detroit-green">From $100</span>
          </div>
          <button
            onClick={() => setSizeModalPhoto(photo)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-detroit-green text-white hover:bg-opacity-90 transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-detroit-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl mb-4">Print Store</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Museum-quality prints of Detroit architecture, photographed by Andrew Petrov. 
            Each print is professionally framed and signed by the artist.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-detroit-gold font-semibold">11×17" Framed</span>
              <span className="ml-2">$100</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-detroit-gold font-semibold">13×19" Framed</span>
              <span className="ml-2">$150</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              ✍️ Signed by artist
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              🚚 Free shipping
            </div>
          </div>
          
          {/* Bulk Discount Banner */}
          <div className="mt-6 bg-detroit-gold/20 border border-detroit-gold/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-detroit-gold" />
              <span className="font-semibold text-detroit-gold">Buy More, Save More!</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded">2 prints = <strong>10% off</strong></span>
              <span className="bg-white/10 px-3 py-1 rounded">3 prints = <strong>15% off</strong></span>
              <span className="bg-white/10 px-3 py-1 rounded">4 prints = <strong>20% off</strong></span>
              <span className="bg-white/20 px-3 py-1 rounded border border-detroit-gold">5+ prints = <strong>25% off</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Cart */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Location filter */}
            <div className="relative">
              <select
                value={filterLocation}
                onChange={(e) => {
                  setFilterLocation(e.target.value as LocationFilter)
                  setFilterBuilding('') // Reset building filter when changing location
                }}
                className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-detroit-green"
              >
                <option value="michigan">🏛️ Michigan ({allPhotos.filter(isMichiganPhoto).length})</option>
                <option value="worldwide">🌍 Worldwide ({allPhotos.length})</option>
              </select>
              <MapPin className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Building filter */}
            <div className="relative">
              <select
                value={filterBuilding}
                onChange={(e) => setFilterBuilding(e.target.value)}
                className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-detroit-green"
              >
                <option value="">All Buildings ({locationFilteredPhotos.length})</option>
                {buildings.map(name => (
                  <option key={name} value={name}>
                    {name} ({locationFilteredPhotos.filter(p => p.building_name === name).length})
                  </option>
                ))}
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {filterBuilding && (
              <button
                onClick={() => setFilterBuilding('')}
                className="text-sm text-detroit-green hover:underline flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          {/* Cart button */}
          <Link
            href="/architecture/store/cart"
            className="flex items-center gap-2 bg-detroit-gold text-detroit-green px-5 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">No prints available yet</h2>
            <p className="text-gray-500">Check back soon for new prints!</p>
          </div>
        ) : (
          <>
            {/* Featured Prints Section */}
            {filteredFeatured.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-detroit-gold fill-detroit-gold" />
                  <h2 className="font-display text-xl text-gray-900">Featured Prints</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFeatured.map(photo => (
                    <PhotoCard key={photo.id} photo={photo} featured />
                  ))}
                </div>
              </div>
            )}

            {/* All Prints Section */}
            {filteredRegular.length > 0 && (
              <div>
                {filteredFeatured.length > 0 && (
                  <h2 className="font-display text-xl text-gray-900 mb-4">All Prints</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRegular.map(photo => (
                    <PhotoCard key={photo.id} photo={photo} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-2xl text-gray-900 mb-6 text-center">About These Prints</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-detroit-green" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Original Photography</h3>
              <p className="text-sm text-gray-600">
                Each image is an original photograph captured by Andrew Petrov, documenting Detroit's architectural heritage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-detroit-green" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Museum Quality</h3>
              <p className="text-sm text-gray-600">
                Printed on archival paper with a professional black frame, ready to hang.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Signed & Numbered</h3>
              <p className="text-sm text-gray-600">
                Every print is hand-signed by the artist with a certificate of authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            className="absolute left-4 text-white/70 hover:text-white p-2"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption || lightboxPhoto.building_name}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[75vh]"
              priority
            />
            <div className="text-white text-center mt-4">
              <h3 className="font-display text-2xl">{lightboxPhoto.building_name}</h3>
              {lightboxPhoto.caption && <p className="text-gray-300 mt-1">{lightboxPhoto.caption}</p>}
              <p className="text-gray-500 text-sm mt-2">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </p>
              <button
                onClick={() => { setLightboxPhoto(null); setSizeModalPhoto(lightboxPhoto); }}
                className="mt-4 px-6 py-2 bg-detroit-gold text-detroit-green rounded-lg font-medium hover:bg-opacity-90"
              >
                Buy Print
              </button>
            </div>
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            className="absolute right-4 text-white/70 hover:text-white p-2"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}

      {/* Size Selection Modal */}
      {sizeModalPhoto && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSizeModalPhoto(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <Image
                src={sizeModalPhoto.url}
                alt={sizeModalPhoto.building_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl text-gray-900 mb-1">{sizeModalPhoto.building_name}</h3>
              {sizeModalPhoto.caption && <p className="text-gray-500 mb-4">{sizeModalPhoto.caption}</p>}
              
              <p className="text-sm text-gray-600 mb-4">Select a size:</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAddToCart(sizeModalPhoto, '11x17')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-detroit-green hover:bg-detroit-green/5 transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover:text-detroit-green">11×17" Framed Print</p>
                    <p className="text-sm text-gray-500">Perfect for home offices and smaller spaces</p>
                  </div>
                  <span className="text-xl font-bold text-detroit-green">$100</span>
                </button>
                
                <button
                  onClick={() => handleAddToCart(sizeModalPhoto, '13x19')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-detroit-green hover:bg-detroit-green/5 transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover:text-detroit-green">13×19" Framed Print</p>
                    <p className="text-sm text-gray-500">Statement piece for living rooms and galleries</p>
                  </div>
                  <span className="text-xl font-bold text-detroit-green">$150</span>
                </button>
              </div>
              
              <button
                onClick={() => setSizeModalPhoto(null)}
                className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
