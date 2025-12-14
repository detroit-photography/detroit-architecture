import Link from 'next/link'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { getShootsByLocation, type Shoot } from '@/lib/shoots-data'

interface ShootsAtLocationProps {
  locationSlug: string
  locationName: string
}

export function ShootsAtLocation({ locationSlug, locationName }: ShootsAtLocationProps) {
  const shoots = getShootsByLocation(locationSlug)

  if (shoots.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-detroit-gold">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-detroit-gold" />
        <h2 className="font-display text-xl text-detroit-green">Photography at {locationName}</h2>
        <span className="text-sm text-gray-500">({shoots.length})</span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        Professional photography shoots that have taken place at this location.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shoots.slice(0, 4).map((shoot) => (
          <Link
            key={shoot.slug}
            href={`/headshots/shoots/${shoot.slug}`}
            className="group flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-detroit-cream transition-colors"
          >
            <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={shoot.coverImage}
                alt={shoot.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 group-hover:text-detroit-gold transition-colors truncate">
                {shoot.title}
              </h3>
              <p className="text-sm text-gray-500">{shoot.date}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {shoot.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-white text-gray-500 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {shoots.length > 4 && (
        <Link
          href={`/headshots/shoots?location=${locationSlug}`}
          className="block text-center text-detroit-gold hover:text-detroit-green mt-4 text-sm font-medium"
        >
          View all {shoots.length} shoots at this location →
        </Link>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link
          href="/headshots/book"
          className="inline-block bg-detroit-green text-white px-4 py-2 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
        >
          Book a Shoot Here
        </Link>
      </div>
    </div>
  )
}
