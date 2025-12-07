'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { Photo } from '@/lib/database.types'

interface PhotoGalleryProps {
  photos: Photo[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const currentPhoto = photos[selectedIndex]

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  return (
    <div>
      {/* Main Image */}
      <div 
        className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={currentPhoto.url}
          alt={currentPhoto.caption || 'Building photo'}
          className="w-full h-full object-cover"
        />
        
        {/* Zoom indicator */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Caption */}
        {currentPhoto.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-sm">{currentPhoto.caption}</p>
            {currentPhoto.photographer && (
              <p className="text-white/70 text-xs mt-1">Photo by {currentPhoto.photographer}</p>
            )}
          </div>
        )}

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
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
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
            onClick={(e) => { e.stopPropagation(); goToPrevious() }}
            className="absolute left-4 text-white hover:text-detroit-gold transition-colors"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption || 'Building photo'}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); goToNext() }}
            className="absolute right-4 text-white hover:text-detroit-gold transition-colors"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          {/* Photo info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
            <p>{selectedIndex + 1} / {photos.length}</p>
            {currentPhoto.caption && <p className="text-sm opacity-75 mt-1">{currentPhoto.caption}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
