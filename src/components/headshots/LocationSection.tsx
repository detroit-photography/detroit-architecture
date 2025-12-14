'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useCallback, memo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

const studioImages = [
  { src: '/images/headshots/bagley-mansion.jpg', alt: 'Bagley Mansion exterior' },
  { src: '/images/headshots/bagley-drone.jpg', alt: 'Bagley Mansion aerial view with Detroit skyline' },
  { src: '/images/headshots/bagley-interior-1.jpg', alt: 'Studio with professional lighting setup' },
  { src: '/images/headshots/bagley-interior-2.jpg', alt: 'Studio lighting and fireplace backdrop' },
  { src: '/images/headshots/bagley-interior-3.jpg', alt: 'Historic fireplace mantel' },
  { src: '/images/headshots/bagley-interior-4.jpg', alt: 'Grand staircase and chandelier' },
]

export const LocationSection = memo(function LocationSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % studioImages.length)
  }, [])

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + studioImages.length) % studioImages.length)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Vertical Image Slider - Left Side */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={studioImages[currentIndex].src}
                alt={studioImages[currentIndex].alt}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10"
                aria-label="Previous image"
              >
                <ChevronUp className="w-5 h-5 text-detroit-green" />
              </button>
              <button
                onClick={nextImage}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10"
                aria-label="Next image"
              >
                <ChevronDown className="w-5 h-5 text-detroit-green" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {currentIndex + 1} / {studioImages.length}
              </div>
            </div>
            
            {/* Thumbnail Strip */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {studioImages.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`flex-none w-16 h-16 relative rounded overflow-hidden transition-all ${
                    i === currentIndex 
                      ? 'ring-2 ring-detroit-gold ring-offset-2' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="64px"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Text - Right Side */}
          <div>
            <p className="text-detroit-gold uppercase tracking-wider text-sm mb-4">
              Located in Historic Bagley Mansion
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-6">
              Not just a studio, but a destination
            </h2>
            <div className="prose prose-lg text-gray-600 mb-8">
              <p>
                Detroit Photography occupies the master suite at the historic John N. Bagley House, 
                one of Detroit's oldest and most prestigious historic homes. Constructed in 1889 
                and listed on the National Register of Historic Places, Bagley Mansion is among 
                the finest examples of the Romanesque Revival and French Renaissance architectural 
                styles in Detroit.
              </p>
              <p>
                The entirety of Suite 101, formerly the living room of the historic mansion located 
                at the base of the tower, is available for photography during business hours. The 
                room features a set of massive bay windows and a carved master fireplace. The 
                historic paneled staircase and landing, as well as the downstairs stained glass 
                window, are available for photography after 5 p.m. and all day Sunday.
              </p>
            </div>
            <Link
              href="#pricing"
              className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
            >
              Get Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
})

LocationSection.displayName = 'LocationSection'
