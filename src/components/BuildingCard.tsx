import Link from 'next/link'
import Image from 'next/image'
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
    <Link href={`/building/${slug}`} aria-label={`View ${building.name}${building.year_built ? `, built ${building.year_built}` : ''}`}>
      <article className="building-card bg-white overflow-hidden shadow-sm hover:shadow-lg active:shadow-md cursor-pointer border border-gray-100 transition-all">
        {/* Image or placeholder - use aspect-ratio to prevent CLS */}
        <div className={`aspect-[4/3] ${building.primary_photo_url ? '' : `bg-gradient-to-br ${getPlaceholderColor()}`} relative flex items-center justify-center overflow-hidden`}>
          {building.primary_photo_url ? (
            <Image 
              src={building.primary_photo_url} 
              alt={`Photo of ${building.name}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/AM206wjkaJrp3Ecs7TjsqF6FQkAZI8jnPAHwTU1qUpUJJOT/2Q=="
            />
          ) : (
            <Building2 className="w-16 h-16 text-white/30" aria-hidden="true" />
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
          
          {/* Style badge */}
          {building.architectural_style && (
            <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
              <span className="bg-black/70 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 backdrop-blur-sm">
                {building.architectural_style}
              </span>
            </div>
          )}
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
        </div>
      </article>
    </Link>
  )
}

