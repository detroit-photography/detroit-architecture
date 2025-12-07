import Link from 'next/link'
import { MapPin, Calendar, User, Building2, Camera, Star } from 'lucide-react'
import { Building } from '@/lib/database.types'

interface BuildingCardProps {
  building: Building & { primary_photo_url?: string; photo_count?: number }
}

export function BuildingCard({ building }: BuildingCardProps) {
  const slug = building.id
  const hasPhotos = building.photo_count && building.photo_count > 0

  // Placeholder - elegant dark green gradient
  const getPlaceholderColor = () => {
    return 'from-detroit-green to-detroit-dark'
  }

  return (
    <Link href={`/building/${slug}`}>
      <article className="building-card bg-white overflow-hidden shadow-sm hover:shadow-lg active:shadow-md cursor-pointer border border-gray-100 transition-all">
        {/* Image or placeholder */}
        <div className={`h-40 md:h-48 ${building.primary_photo_url ? '' : `bg-gradient-to-br ${getPlaceholderColor()}`} relative flex items-center justify-center overflow-hidden`}>
          {building.primary_photo_url ? (
            <img 
              src={building.primary_photo_url} 
              alt={building.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-16 h-16 text-white/30" />
          )}
          
          {/* Featured badge */}
          {building.featured && (
            <div className="absolute top-2 md:top-3 left-2 md:left-3">
              <div className="bg-detroit-gold text-detroit-green text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 flex items-center gap-0.5 md:gap-1 uppercase tracking-wider font-medium">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                <span className="hidden sm:inline">Featured</span>
              </div>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1">
            {hasPhotos && (
              <div className="bg-detroit-gold text-detroit-green text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 flex items-center gap-0.5 md:gap-1 uppercase tracking-wider font-medium">
                <Camera className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span className="hidden sm:inline">Original</span>
              </div>
            )}
            {building.status === 'demolished' && (
              <div className="bg-detroit-green text-white text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 uppercase tracking-wider">
                <span className="sm:hidden">✕</span>
                <span className="hidden sm:inline">Demolished</span>
              </div>
            )}
          </div>
          
          {/* Source badges - hidden on mobile to save space */}
          <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 flex gap-1">
            {building.aia_number && (
              <span className="bg-black/70 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 backdrop-blur-sm hidden sm:inline-block">
                AIA {building.aia_number}
              </span>
            )}
            {building.ferry_number && (
              <span className="bg-black/70 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 backdrop-blur-sm hidden sm:inline-block">
                Ferry {building.ferry_number}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 md:p-4">
          <h3 className="font-display text-sm md:text-lg text-gray-900 mb-1 md:mb-2 line-clamp-2 md:line-clamp-1">
            {building.name}
          </h3>
          
          {/* Desktop: Full details */}
          <div className="hidden md:block space-y-1 text-sm text-gray-600">
            {building.architect && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-detroit-green flex-shrink-0" />
                <span className="line-clamp-1">{building.architect}</span>
              </div>
            )}
            
            {building.year_built && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-detroit-green flex-shrink-0" />
                <span>{building.year_built}</span>
              </div>
            )}
            
            {building.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-detroit-green flex-shrink-0" />
                <span className="line-clamp-1">{building.address}</span>
              </div>
            )}
          </div>

          {/* Mobile: Compact details */}
          <div className="md:hidden text-xs text-gray-500 space-y-0.5">
            {building.year_built && <div>{building.year_built}</div>}
            {building.architect && <div className="line-clamp-1">{building.architect.split(',')[0]}</div>}
          </div>

          {building.architectural_style && (
            <div className="mt-2 md:mt-3">
              <span className="inline-block bg-gray-100 text-gray-700 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                {building.architectural_style}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

