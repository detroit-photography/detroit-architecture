'use client'

import { useState } from 'react'
import { Clock, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface HistoricImage {
  id: string
  filename: string
  original_caption: string | null
  copyright_status: string | null
}

interface HistoricPhotosSectionProps {
  images: HistoricImage[]
  buildingName: string
  nrhpRefNumber?: string
}

// Format copyright status for display
function formatCopyright(status: string | null): string | null {
  if (!status) return null
  switch (status) {
    case 'public_domain':
      return 'Public Domain'
    case 'public_domain_nrhp':
      return 'Public Domain (Michigan filing for National Register of Historic Places)'
    case 'fair_use':
      return 'Fair Use'
    default:
      return status
  }
}

export function HistoricPhotosSection({ images, buildingName, nrhpRefNumber }: HistoricPhotosSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (images.length === 0) return null

  const getImageSrc = (image: HistoricImage) => {
    if (nrhpRefNumber) {
      return `/images/nrhp/${nrhpRefNumber}/${image.filename}`
    }
    return `/images/historic/${image.filename}`
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const currentImage = images[lightboxIndex]

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-500">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-600" />
          <h2 className="font-display text-xl text-gray-900">Historical Photos</h2>
          <span className="text-sm text-gray-500">({images.length})</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <figure 
              key={image.id} 
              className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={getImageSrc(image)}
                  alt={image.original_caption || `Historic photo of ${buildingName}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity">
                    View larger
                  </span>
                </div>
              </div>
              {image.original_caption && (
                <figcaption className="p-3 text-sm text-gray-600">
                  {image.original_caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-amber-400 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious() }}
              className="absolute left-4 text-white hover:text-amber-400 transition-colors"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
          )}

          <div 
            className="max-h-[90vh] max-w-[90vw] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageSrc(currentImage)}
              alt={currentImage.original_caption || `Historic photo of ${buildingName}`}
              className="max-h-[75vh] max-w-full object-contain"
            />
            
            {/* Caption below image */}
            <div className="mt-4 text-center text-white max-w-2xl px-4">
              {currentImage.original_caption && (
                <p className="text-gray-200 text-sm mb-2">{currentImage.original_caption}</p>
              )}
              {currentImage.copyright_status && (
                <p className="text-xs text-gray-400">
                  {formatCopyright(currentImage.copyright_status)}
                </p>
              )}
              {images.length > 1 && (
                <p className="text-gray-500 text-xs mt-2">
                  {lightboxIndex + 1} of {images.length}
                </p>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext() }}
              className="absolute right-4 text-white hover:text-amber-400 transition-colors"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
