'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X, ZoomIn, Camera, Clock, User, ShoppingBag, Check, Share2, Printer, Link2, Twitter, Facebook, Mail } from 'lucide-react'
import { Photo } from '@/lib/database.types'
import { useCart } from '@/lib/cart-context'

const MAX_THUMBNAILS = 20

interface PhotoGalleryProps {
  photos: Photo[]
  buildingName?: string
  buildingId?: string
  showBuyButton?: boolean
}

function PhotoSection({ 
  photos, 
  title, 
  icon: Icon,
  buildingName,
  buildingId,
  allPhotos,
  startIndex,
  showBuyButton = false
}: { 
  photos: Photo[]
  title: string
  icon: React.ElementType
  buildingName?: string
  buildingId?: string
  allPhotos: Photo[]
  startIndex: number
  showBuyButton?: boolean
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { addItem } = useCart()

  if (photos.length === 0) return null

  const currentPhoto = photos[selectedIndex]

  const handleAddToCart = (photo: Photo, size: '11x17' | '13x19') => {
    if (!buildingName || !buildingId) return
    
    addItem({
      photoId: photo.id,
      photoUrl: photo.url,
      buildingName,
      buildingId,
      caption: photo.caption,
      size,
      price: size === '11x17' ? 100 : 150,
    })
    
    setAddedToCart(`${photo.id}-${size}`)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  const getShareUrl = () => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(getShareUrl())
    const text = encodeURIComponent(`Check out ${buildingName} on Detroit Architecture Repository`)
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      email: `mailto:?subject=${encodeURIComponent(buildingName || 'Detroit Architecture')}&body=${text}%0A%0A${url}`,
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    setShareModalOpen(false)
  }

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
        <Image
          src={currentPhoto.url}
          alt={currentPhoto.caption || `${buildingName || 'Building'} photo`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false}
        />
        
        {/* Zoom indicator */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
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
            {/* Share and Buy Print buttons */}
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShareModalOpen(true)}
                className="px-3 py-1.5 rounded text-xs font-medium bg-white/20 text-white hover:bg-white/30 transition-all flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                Share
              </button>
              {showBuyButton && currentPhoto.photographer === 'Andrew Petrov' && (
                <button
                  onClick={() => setBuyModalOpen(true)}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-detroit-gold text-detroit-green hover:bg-opacity-90 transition-all flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  Buy Print
                </button>
              )}
            </div>
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

      {/* Thumbnails - limited to MAX_THUMBNAILS */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {photos.slice(0, MAX_THUMBNAILS).map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors relative ${
                index === selectedIndex ? 'border-detroit-gold' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `Photo ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
          {photos.length > MAX_THUMBNAILS && (
            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-sm text-gray-600 font-medium">
              +{photos.length - MAX_THUMBNAILS}
            </div>
          )}
        </div>
      )}

      {/* Lightbox - z-[9999] to ensure it's above everything including maps */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
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

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxPhoto.url}
            alt={lightboxPhoto.caption || `${buildingName || 'Building'} photo`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
            loading="eager"
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

      {/* Share Modal */}
      {shareModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
          onClick={() => setShareModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">Share this photo</h3>
              <button onClick={() => setShareModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {buildingName}{currentPhoto.caption ? ` - ${currentPhoto.caption}` : ''}
            </p>

            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Link2 className="w-5 h-5 text-gray-600" />}
                </div>
                <div>
                  <p className="font-medium">{copied ? 'Link copied!' : 'Copy link'}</p>
                  <p className="text-xs text-gray-500">Share via any app</p>
                </div>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="font-medium">Twitter / X</p>
                  <p className="text-xs text-gray-500">Share on Twitter</p>
                </div>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-xs text-gray-500">Share on Facebook</p>
                </div>
              </button>

              <button
                onClick={() => handleShare('email')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-xs text-gray-500">Send via email</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Print Modal */}
      {buyModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
          onClick={() => setBuyModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">Buy Print</h3>
              <button onClick={() => setBuyModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo preview */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-4">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption || buildingName || 'Photo'}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>

            <h4 className="font-medium text-gray-900">{buildingName}</h4>
            {currentPhoto.caption && (
              <p className="text-sm text-gray-500 mb-4">{currentPhoto.caption}</p>
            )}

            <div className="border-t pt-4 mt-2 space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                Museum-quality archival print, professionally framed in black, signed by the artist. Free shipping.
              </p>

              <button
                onClick={() => {
                  handleAddToCart(currentPhoto, '11x17')
                  setBuyModalOpen(false)
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  addedToCart === `${currentPhoto.id}-11x17` 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-detroit-green'
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold">11×17" Framed Print</p>
                  <p className="text-sm text-gray-500">Perfect for desks & small spaces</p>
                </div>
                <div className="text-right">
                  {addedToCart === `${currentPhoto.id}-11x17` ? (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <Check className="w-4 h-4" /> Added
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-detroit-green">$100</span>
                  )}
                </div>
              </button>

              <button
                onClick={() => {
                  handleAddToCart(currentPhoto, '13x19')
                  setBuyModalOpen(false)
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  addedToCart === `${currentPhoto.id}-13x19` 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-detroit-green'
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold">13×19" Framed Print</p>
                  <p className="text-sm text-gray-500">Statement piece for walls</p>
                </div>
                <div className="text-right">
                  {addedToCart === `${currentPhoto.id}-13x19` ? (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <Check className="w-4 h-4" /> Added
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-detroit-green">$150</span>
                  )}
                </div>
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              ✓ Signed by artist · ✓ Certificate of authenticity · ✓ 30-day returns
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function PhotoGallery({ photos, buildingName, buildingId, showBuyButton = true }: PhotoGalleryProps) {
  // Group photos by type
  const { originalPhotos, portraiturePhotos, historicalPhotos, allDisplayPhotos } = useMemo(() => {
    const original = photos.filter(p => !p.photo_type || p.photo_type === 'original')
    const portraiture = photos.filter(p => p.photo_type === 'portraiture')
    const historical = photos.filter(p => p.photo_type === 'historical')
    // Combine for lightbox navigation (original first, then portraiture, then historical)
    const all = [...original, ...portraiture, ...historical]
    return { originalPhotos: original, portraiturePhotos: portraiture, historicalPhotos: historical, allDisplayPhotos: all }
  }, [photos])

  if (allDisplayPhotos.length === 0) {
    return null
  }

  // Check if we have multiple types to show sections
  const hasMultipleTypes = [originalPhotos.length, portraiturePhotos.length, historicalPhotos.length].filter(n => n > 0).length > 1

  // If only one type, show without section header
  if (!hasMultipleTypes) {
    if (originalPhotos.length > 0) {
      return (
        <PhotoSection
          photos={originalPhotos}
          title="Photos"
          icon={Camera}
          buildingName={buildingName}
          buildingId={buildingId}
          allPhotos={allDisplayPhotos}
          startIndex={0}
          showBuyButton={showBuyButton}
        />
      )
    }
    if (portraiturePhotos.length > 0) {
      return (
        <PhotoSection
          photos={portraiturePhotos}
          title="Portraiture"
          icon={User}
          buildingName={buildingName}
          buildingId={buildingId}
          allPhotos={allDisplayPhotos}
          startIndex={0}
          showBuyButton={showBuyButton}
        />
      )
    }
    if (historicalPhotos.length > 0) {
      return (
        <PhotoSection
          photos={historicalPhotos}
          title="Historical Photos"
          icon={Clock}
          buildingName={buildingName}
          buildingId={buildingId}
          allPhotos={allDisplayPhotos}
          startIndex={0}
          showBuyButton={false}
        />
      )
    }
  }

  // Show multiple sections
  let currentIndex = 0
  return (
    <div className="space-y-8">
      {originalPhotos.length > 0 && (
        <PhotoSection
          photos={originalPhotos}
          title="Architecture Photos"
          icon={Camera}
          buildingName={buildingName}
          buildingId={buildingId}
          allPhotos={allDisplayPhotos}
          startIndex={(() => { const idx = currentIndex; currentIndex += originalPhotos.length; return idx })()}
          showBuyButton={showBuyButton}
        />
      )}
      
      {portraiturePhotos.length > 0 && (
        <PhotoSection
          photos={portraiturePhotos}
          title="Portraiture"
          icon={User}
          buildingName={buildingName}
          buildingId={buildingId}
          allPhotos={allDisplayPhotos}
          startIndex={originalPhotos.length}
          showBuyButton={showBuyButton}
        />
      )}
      
      {historicalPhotos.length > 0 && (
        <PhotoSection
          photos={historicalPhotos}
          title="Historical Photos"
          icon={Clock}
          buildingName={buildingName}
          buildingId={buildingId}
          allPhotos={allDisplayPhotos}
          startIndex={originalPhotos.length + portraiturePhotos.length}
          showBuyButton={false}
        />
      )}
    </div>
  )
}
