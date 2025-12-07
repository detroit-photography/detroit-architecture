'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, Camera, Clock } from 'lucide-react'
import { Photo } from '@/lib/database.types'

interface PhotoGalleryProps {
  photos: Photo[]
  buildingName?: string
}

function PhotoSection({ 
  photos, 
  title, 
  icon: Icon,
  buildingName,
  allPhotos,
  startIndex
}: { 
  photos: Photo[]
  title: string
  icon: React.ElementType
  buildingName?: string
  allPhotos: Photo[]
  startIndex: number
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (photos.length === 0) return null

  const currentPhoto = photos[selectedIndex]

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(startIndex + index)
    setLightboxOpen(true)
  }

  const goToPreviousLightbox = () => {
    setLightboxIndex((prev) => (prev === 0 ? allPhotos.length - 1 : prev - 1))
  }

  const goToNextLightbox = () => {
    setLightboxIndex((prev) => (prev === allPhotos.length - 1 ? 0 : prev + 1))
  }

  const lightboxPhoto = allPhotos[lightboxIndex]

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-detroit-green" />
        <h3 className="font-display text-lg text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">({photos.length})</span>
      </div>

      {/* Main Image */}
      <div 
        className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
        onClick={() => openLightbox(selectedIndex)}
      >
        <img
          src={currentPhoto.url}
          alt={currentPhoto.caption || `${buildingName || 'Building'} photo`}
          className="w-full h-full object-cover"
        />
        
        {/* Zoom indicator */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {currentPhoto.caption && (
            <p className="text-white text-sm">{currentPhoto.caption}</p>
          )}
          <div className="flex items-center gap-2 text-white/70 text-xs mt-1">
            {currentPhoto.photographer && (
              <span>Photo by {currentPhoto.photographer}</span>
            )}
            {currentPhoto.year_taken && (
              <span>• {currentPhoto.year_taken}</span>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedIndex ? 'border-detroit-gold' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-detroit-gold transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToPreviousLightbox() }}
            className="absolute left-4 text-white hover:text-detroit-gold transition-colors"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <img
            src={lightboxPhoto.url}
            alt={lightboxPhoto.caption || `${buildingName || 'Building'} photo`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); goToNextLightbox() }}
            className="absolute right-4 text-white hover:text-detroit-gold transition-colors"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          {/* Photo info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
            <p>{lightboxIndex + 1} / {allPhotos.length}</p>
            {lightboxPhoto.caption && <p className="text-sm opacity-75 mt-1">{lightboxPhoto.caption}</p>}
            {lightboxPhoto.photographer && (
              <p className="text-xs opacity-50 mt-1">
                Photo by {lightboxPhoto.photographer}
                {lightboxPhoto.year_taken && ` • ${lightboxPhoto.year_taken}`}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function PhotoGallery({ photos, buildingName }: PhotoGalleryProps) {
  // Group photos by type
  const { originalPhotos, historicalPhotos, allDisplayPhotos } = useMemo(() => {
    const original = photos.filter(p => !p.photo_type || p.photo_type === 'original')
    const historical = photos.filter(p => p.photo_type === 'historical')
    // Combine for lightbox navigation (original first, then historical)
    const all = [...original, ...historical]
    return { originalPhotos: original, historicalPhotos: historical, allDisplayPhotos: all }
  }, [photos])

  if (allDisplayPhotos.length === 0) {
    return null
  }

  // If there are no historical photos, show simple gallery without section headers
  if (historicalPhotos.length === 0) {
    return (
      <PhotoSection
        photos={originalPhotos}
        title="Photos"
        icon={Camera}
        buildingName={buildingName}
        allPhotos={allDisplayPhotos}
        startIndex={0}
      />
    )
  }

  // If there are no original photos, show only historical
  if (originalPhotos.length === 0) {
    return (
      <PhotoSection
        photos={historicalPhotos}
        title="Historical Photos"
        icon={Clock}
        buildingName={buildingName}
        allPhotos={allDisplayPhotos}
        startIndex={0}
      />
    )
  }

  // Show both sections
  return (
    <div className="space-y-8">
      <PhotoSection
        photos={originalPhotos}
        title="My Photos"
        icon={Camera}
        buildingName={buildingName}
        allPhotos={allDisplayPhotos}
        startIndex={0}
      />
      
      <PhotoSection
        photos={historicalPhotos}
        title="Historical Photos"
        icon={Clock}
        buildingName={buildingName}
        allPhotos={allDisplayPhotos}
        startIndex={originalPhotos.length}
      />
    </div>
  )
}
