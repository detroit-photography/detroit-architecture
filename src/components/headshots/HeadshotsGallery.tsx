'use client'

import Image from 'next/image'
import { useState, useCallback, memo } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  src: string
  alt: string
}

interface HeadshotsGalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  className?: string
}

export const HeadshotsGallery = memo(function HeadshotsGallery({ images, columns = 4, className = '' }: HeadshotsGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => setSelectedIndex(index), [])
  const closeLightbox = useCallback(() => setSelectedIndex(null), [])
  
  const goToPrevious = useCallback(() => {
    setSelectedIndex(prev => prev === null ? null : prev === 0 ? images.length - 1 : prev - 1)
  }, [images.length])
  
  const goToNext = useCallback(() => {
    setSelectedIndex(prev => prev === null ? null : prev === images.length - 1 ? 0 : prev + 1)
  }, [images.length])

  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  return (
    <>
      <div className={`grid ${columnClasses[columns]} gap-2 md:gap-4 ${className}`}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
              loading={index < 4 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-detroit-gold transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 text-white hover:text-detroit-gold transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 text-white hover:text-detroit-gold transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div 
            className="relative w-full h-full max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
})

HeadshotsGallery.displayName = 'HeadshotsGallery'
