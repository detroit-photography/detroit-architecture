'use client'

import { Eye, ExternalLink, MapPin } from 'lucide-react'

interface StreetViewCardProps {
  lat: number
  lng: number
  name: string
  streetViewUrl?: string | null  // Pre-fetched street view URL from database
}

export function StreetViewCard({ lat, lng, name, streetViewUrl }: StreetViewCardProps) {
  const googleMapsUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`

  // If we have a pre-fetched street view, show it
  if (streetViewUrl) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-display text-lg flex items-center gap-2">
            <Eye className="w-5 h-5 text-detroit-green" />
            Street View
          </h3>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-detroit-gold hover:underline flex items-center gap-1"
          >
            Open 360° View <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative group"
        >
          <img
            src={streetViewUrl}
            alt={`Street view of ${name}`}
            className="w-full h-56 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-lg text-sm font-medium">
              Click for 360° View
            </div>
          </div>
        </a>
      </div>
    )
  }

  // No street view available - show link to Google Maps
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-display text-lg flex items-center gap-2">
          <Eye className="w-5 h-5 text-detroit-green" />
          Street View
        </h3>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-detroit-gold hover:underline flex items-center gap-1"
        >
          Open 360° View <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <a 
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4 text-center hover:bg-gray-200 transition-colors"
      >
        <MapPin className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-gray-600 text-sm font-medium">Click to view on Google Maps</p>
        <p className="text-detroit-gold text-xs mt-1 flex items-center gap-1">
          Open 360° Street View <ExternalLink className="w-3 h-3" />
        </p>
      </a>
    </div>
  )
}

