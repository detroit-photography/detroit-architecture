import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, User, Building2, BookOpen, Camera, ExternalLink, Edit, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PhotoGallery } from '@/components/PhotoGallery'
import { BuildingMap } from '@/components/BuildingMap'
import { StreetViewCard } from '@/components/StreetViewCard'
import { ExpandableText } from '@/components/ExpandableText'
import { ShootsAtLocation } from '@/components/ShootsAtLocation'
import { ArchitectureLayout } from '@/components/ArchitectureLayout'

// Always fetch fresh data (no caching)
export const revalidate = 0
export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const { data: building } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!building) {
    return { title: 'Building Not Found | Detroit Architecture Repository' }
  }

  // Build SEO-optimized title
  // Format: "Book Tower, Detroit | 1926 Louis Kamper Art Deco Skyscraper"
  const titleParts: string[] = [building.name]
  
  // Add Detroit if not already in name
  if (!building.name.toLowerCase().includes('detroit')) {
    titleParts[0] = `${building.name}, Detroit`
  }
  
  // Add key details
  const details: string[] = []
  if (building.year_built) details.push(String(building.year_built))
  if (building.architect) details.push(building.architect.split(',')[0].trim())
  if (building.architectural_style) details.push(building.architectural_style)
  if (building.building_type) details.push(building.building_type)
  
  const title = details.length > 0 
    ? `${titleParts[0]} | ${details.slice(0, 3).join(' ')}` 
    : `${titleParts[0]} | Historic Architecture`

  // Create SEO-optimized description
  const descParts: string[] = []
  descParts.push(building.name)
  if (building.year_built) descParts.push(`built in ${building.year_built}`)
  if (building.architect) descParts.push(`designed by ${building.architect.split(',')[0]}`)
  if (building.architectural_style) descParts.push(`is a ${building.architectural_style} landmark`)
  if (building.address) descParts.push(`located at ${building.address}`)
  
  const introDesc = descParts.join(', ') + '.'
  
  const bodyText = building.aia_text?.substring(0, 200) || 
    building.ferry_text?.substring(0, 200) || ''
  
  const description = `${introDesc} ${bodyText}`.trim().substring(0, 320)

  // Get primary photo for OG image
  const { data: photos } = await supabase
    .from('photos')
    .select('url')
    .eq('building_id', building.id)
    .order('is_primary', { ascending: false })
    .order('sort_order')
    .limit(1)

  const ogImage = photos?.[0]?.url

  return {
    title,
    description,
    keywords: [
      building.name,
      `${building.name} Detroit`,
      building.architect,
      `${building.architect?.split(',')[0]} buildings`,
      building.architectural_style,
      `${building.architectural_style} Detroit`,
      'Detroit architecture',
      'Detroit historic building',
      'Michigan architecture',
      building.building_type,
    ].filter(Boolean),
    openGraph: {
      title: `${building.name} | Detroit Architecture Repository`,
      description,
      type: 'article',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: `${building.name} - Historic Detroit Architecture` }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: `${building.name}${building.year_built ? ` (${building.year_built})` : ''}`,
      description: description.substring(0, 200),
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: `/building/${params.id}`,
    },
  }
}

export default async function BuildingPage({ params }: Props) {
  const { data: building } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!building) {
    notFound()
  }

  // Fetch photos for this building
  const { data: allPhotos } = await supabase
    .from('photos')
    .select('*')
    .eq('building_id', building.id)
    .order('sort_order')

  // Separate photos by type
  const streetViewPhoto = allPhotos?.find(p => p.photographer === 'Google Street View')
  const architecturePhotos = allPhotos?.filter(p => 
    p.photographer !== 'Google Street View' && 
    (!p.photo_type || p.photo_type === 'original' || p.photo_type === 'historical')
  ) || []
  const portraiturePhotos = allPhotos?.filter(p => p.photo_type === 'portraiture') || []
  
  // For backwards compatibility, use architecturePhotos as the main photos
  const photos = architecturePhotos

  return (
    <ArchitectureLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-detroit-green text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-detroit-gold hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all buildings
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-5xl mb-2">{building.name}</h1>
              
              {building.alternate_names && building.alternate_names.length > 0 && (
                <p className="text-gray-300 text-lg">
                  Also known as: {building.alternate_names.join(', ')}
                </p>
              )}
            </div>
            
            <div className="flex gap-2 items-center">
              {building.aia_number && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                  AIA #{building.aia_number}
                </span>
              )}
              {building.ferry_number && (
                <span className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm">
                  Ferry #{building.ferry_number}
                </span>
              )}
              {building.status === 'demolished' && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                  Demolished
                </span>
              )}
              <Link
                href={`/admin?building=${building.id}`}
                className="bg-detroit-gold text-detroit-green px-3 py-1 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Gallery - Architecture Photos */}
            {photos && photos.length > 0 ? (
              <PhotoGallery photos={photos} buildingName={building.name} buildingId={building.id} />
            ) : streetViewPhoto ? (
              /* Show Street View as main image if no original photos */
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={streetViewPhoto.url} 
                  alt={`Street view of ${building.name}`}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Google Street View — No original photos yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-detroit-green to-detroit-dark rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="opacity-75">No photos yet</p>
                </div>
              </div>
            )}

            {/* Portraiture Section */}
            {portraiturePhotos.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-pink-500">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-pink-500" />
                  <h2 className="font-display text-xl text-pink-600">Portraiture at {building.name}</h2>
                  <span className="text-sm text-gray-500">({portraiturePhotos.length})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portraiturePhotos.map((photo, index) => (
                    <div key={photo.id} className="relative aspect-[3/4] rounded-lg overflow-hidden group">
                      <img 
                        src={photo.url} 
                        alt={photo.caption || `Portrait ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-white text-sm">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photography Shoots at this Location */}
            <ShootsAtLocation locationSlug={params.id} locationName={building.name} />

            {/* AIA Guide Text - TEMPORARILY HIDDEN pending written permission */}
            {/* TODO: Restore once permission is obtained from publisher */}
            {false && building.aia_text && (
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-600">
                {/* Content hidden */}
              </div>
            )}

            {/* Ferry Book Text - TEMPORARILY HIDDEN pending written permission */}
            {/* TODO: Restore once permission is obtained from publisher */}
            {false && building.ferry_text && (
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-600">
                {/* Content hidden */}
              </div>
            )}

            {/* Wikipedia Entry */}
            {building.wikipedia_entry && (
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-gray-400">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                    <h2 className="font-display text-xl text-gray-600">From Wikipedia</h2>
                  </div>
                </div>
                <ExpandableText 
                  html={building.wikipedia_entry}
                  maxLines={20}
                  className="text-gray-700 leading-relaxed"
                />
                <p className="text-xs text-gray-400 mt-4">
                  Content available under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="hover:underline">CC BY-SA 4.0</a>
                </p>
              </div>
            )}

            {/* Photographer Notes */}
            {building.photographer_notes && (
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-detroit-gold">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5 text-detroit-gold" />
                  <h2 className="font-display text-xl text-detroit-gold">Photographer's Notes</h2>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {building.photographer_notes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="font-display text-xl mb-4 border-b pb-2">Building Details</h2>
              
              <dl className="space-y-4">
                {building.architect && (
                  <div>
                    <dt className="text-sm text-gray-500 flex items-center gap-1">
                      <User className="w-4 h-4" /> Architect
                    </dt>
                    <dd className="font-medium text-gray-900">{building.architect}</dd>
                  </div>
                )}
                
                {building.year_built && (
                  <div>
                    <dt className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Year Built
                    </dt>
                    <dd className="font-medium text-gray-900">
                      {building.year_built}
                      {building.year_demolished && ` — Demolished ${building.year_demolished}`}
                    </dd>
                  </div>
                )}
                
                {building.address && (
                  <div>
                    <dt className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> Address
                    </dt>
                    <dd className="font-medium text-gray-900">{building.address}</dd>
                    {building.lat && building.lng && (
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${building.lat},${building.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-detroit-gold hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Get Directions <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
                
                {building.architectural_style && (
                  <div>
                    <dt className="text-sm text-gray-500 flex items-center gap-1">
                      <Building2 className="w-4 h-4" /> Style
                    </dt>
                    <dd>
                      <Link 
                        href={`/?style=${encodeURIComponent(building.architectural_style)}`}
                        className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-detroit-gold hover:text-white transition-colors"
                      >
                        {building.architectural_style}
                      </Link>
                    </dd>
                  </div>
                )}

                {building.building_type && (
                  <div>
                    <dt className="text-sm text-gray-500">Building Type</dt>
                    <dd className="font-medium text-gray-900">{building.building_type}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Map */}
            {building.lat && building.lng && (
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-64">
                  <BuildingMap lat={building.lat} lng={building.lng} name={building.name} />
                </div>
              </div>
            )}

            {/* Street View */}
            {building.lat && building.lng && (
              <StreetViewCard 
                lat={building.lat} 
                lng={building.lng} 
                name={building.name}
                streetViewUrl={streetViewPhoto?.url}
              />
            )}

            {/* Architect Link */}
            {building.architect && (
              <Link
                href={`/?q=${encodeURIComponent(building.architect)}`}
                className="block bg-detroit-blue text-white rounded-xl p-4 text-center hover:bg-opacity-90 transition-colors"
              >
                See more by {building.architect.split(',')[0]}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Sources Footer - TEMPORARILY HIDDEN pending written permission */}
      {/* TODO: Restore once permission is obtained from publishers */}
    </div>
    </ArchitectureLayout>
  )
}

