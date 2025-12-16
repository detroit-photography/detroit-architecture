import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, User, Building2, BookOpen, Camera, ExternalLink, Edit, Users, Landmark, Award } from 'lucide-react'
import { HistoricPhotosSection } from '@/components/HistoricPhotosSection'
import { createServerClient } from '@/lib/supabase'
import { PhotoGallery } from '@/components/PhotoGallery'
import { BuildingMap } from '@/components/BuildingMap'
import { StreetViewCard } from '@/components/StreetViewCard'
import { ExpandableText } from '@/components/ExpandableText'
import { ShootsAtLocation } from '@/components/ShootsAtLocation'
// Layout is handled by /architecture/layout.tsx

// NRHP Entry type
interface NRHPEntry {
  id: string
  ref_number: string
  date_listed: string
  level_of_significance: string
  areas_of_significance: string[]
  period_of_significance: string
  description: string
  statement_of_significance: string
  architect_builder: string
}

// NRHP Image type
interface NRHPImage {
  id: string
  filename: string
  original_caption: string | null
  copyright_status: string | null
}

// Always fetch fresh data (no caching)
export const revalidate = 0
export const dynamic = 'force-dynamic'

// Helper to generate slug from building name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-+/g, '-')
}

// Helper to check if a string is a UUID
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// Fetch building by ID or slug
async function getBuildingByIdOrSlug(idOrSlug: string) {
  const supabase = createServerClient()
  
  // If it's a UUID, lookup by ID
  if (isUUID(idOrSlug)) {
    const { data } = await supabase
      .from('buildings')
      .select('*')
      .eq('id', idOrSlug)
      .single()
    return data
  }
  
  // Otherwise, search all buildings and find one with matching slug
  const { data: buildings } = await supabase
    .from('buildings')
    .select('*')
  
  if (!buildings) return null
  
  return buildings.find(b => generateSlug(b.name) === idOrSlug)
}

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const building = await getBuildingByIdOrSlug(params.id)

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
  const supabase = createServerClient()
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
      canonical: `/architecture/building/${params.id}`,
    },
  }
}

export default async function BuildingPage({ params }: Props) {
  const supabase = createServerClient()
  const building = await getBuildingByIdOrSlug(params.id)

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

  // Fetch NRHP entry for this building
  const { data: nrhpEntry } = await supabase
    .from('nrhp_entries')
    .select('*')
    .eq('building_id', building.id)
    .single() as { data: NRHPEntry | null }

  // Fetch NRHP historic images for this building
  const { data: nrhpImages } = await supabase
    .from('nrhp_images')
    .select('id, filename, original_caption, copyright_status')
    .eq('building_id', building.id)
    .eq('is_published', true)
    .is('deleted_at', null)
    .order('display_order') as { data: NRHPImage[] | null }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-detroit-green text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link 
            href="/architecture" 
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
            
            <div className="flex gap-2 items-center flex-wrap">
              {nrhpEntry && (
                <span className="bg-amber-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                  <Landmark className="w-4 h-4" />
                  National Register
                </span>
              )}
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

            {/* National Register of Historic Places Entry */}
            {nrhpEntry && (
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-600" />
                    <h2 className="font-display text-xl text-amber-700">National Register of Historic Places</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    Listed {nrhpEntry.date_listed ? new Date(nrhpEntry.date_listed).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </span>
                </div>
                
                {/* Significance badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {nrhpEntry.level_of_significance && (
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm capitalize">
                      {nrhpEntry.level_of_significance} Significance
                    </span>
                  )}
                  {nrhpEntry.areas_of_significance?.map((area, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                  {nrhpEntry.period_of_significance && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {nrhpEntry.period_of_significance}
                    </span>
                  )}
                </div>

                {/* Description */}
                {nrhpEntry.description && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      {nrhpEntry.description.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statement of Significance */}
                {nrhpEntry.statement_of_significance && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Statement of Significance</h3>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      {nrhpEntry.statement_of_significance.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architect/Builder from NRHP */}
                {nrhpEntry.architect_builder && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Architect/Builder</h3>
                    <p className="text-gray-700">{nrhpEntry.architect_builder}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                  <span>NRHP Ref# {nrhpEntry.ref_number} • Data from National Park Service</span>
                  {nrhpEntry.pdf_url && (
                    <a 
                      href={nrhpEntry.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Original PDF
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Historic Photographs Section - with Lightbox */}
            {nrhpImages && nrhpImages.length > 0 && (
              <HistoricPhotosSection 
                images={nrhpImages}
                buildingName={building.name}
                nrhpRefNumber={nrhpEntry?.ref_number}
              />
            )}

            {/* Wikipedia Entry */}
            {building.wikipedia_entry && building.wikipedia_entry !== 'NOT_FOUND' && (
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
                        href={`/architecture?style=${encodeURIComponent(building.architectural_style)}`}
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

                {nrhpEntry && (
                  <div className="pt-4 border-t">
                    <dt className="text-sm text-gray-500 flex items-center gap-1">
                      <Landmark className="w-4 h-4" /> National Register
                    </dt>
                    <dd className="font-medium text-amber-700">
                      Listed {nrhpEntry.date_listed ? new Date(nrhpEntry.date_listed).getFullYear() : ''}
                    </dd>
                    <dd className="text-sm text-gray-500">Ref# {nrhpEntry.ref_number}</dd>
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
                href={`/architecture?q=${encodeURIComponent(building.architect)}`}
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
  )
}

