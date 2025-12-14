'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface GoogleRatingProps {
  className?: string
  showReviewCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'badge'
}

interface RatingData {
  rating: number
  reviewCount: number
}

// Default values while loading or if API fails
const DEFAULT_RATING: RatingData = {
  rating: 5.0,
  reviewCount: 201,
}

export function GoogleRating({ 
  className = '', 
  showReviewCount = true,
  size = 'md',
  variant = 'default'
}: GoogleRatingProps) {
  const [ratingData, setRatingData] = useState<RatingData>(DEFAULT_RATING)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRating() {
      try {
        const response = await fetch('/api/google-rating')
        if (response.ok) {
          const data = await response.json()
          setRatingData({
            rating: data.rating,
            reviewCount: data.reviewCount,
          })
        }
      } catch (error) {
        console.error('Failed to fetch Google rating:', error)
        // Keep default values on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchRating()
  }, [])

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  // Render stars based on rating
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(ratingData.rating)
    const hasHalfStar = ratingData.rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star 
            key={i} 
            className={`${starSizes[size]} text-detroit-gold fill-detroit-gold`} 
          />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className={`${starSizes[size]} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${starSizes[size]} text-detroit-gold fill-detroit-gold`} />
            </div>
          </div>
        )
      } else {
        stars.push(
          <Star key={i} className={`${starSizes[size]} text-gray-300`} />
        )
      }
    }
    return stars
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full ${className}`}>
        <Star className={`${starSizes[size]} text-detroit-gold fill-detroit-gold`} />
        <span className={`font-semibold ${sizeClasses[size]}`}>
          {ratingData.rating.toFixed(1)}
        </span>
        {showReviewCount && (
          <span className={`opacity-80 ${sizeClasses[size]}`}>
            ({ratingData.reviewCount}+ reviews)
          </span>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <Star className={`${starSizes[size]} text-detroit-gold fill-detroit-gold`} />
        <span className={`font-semibold ${sizeClasses[size]}`}>
          {ratingData.rating.toFixed(1)}
        </span>
        {showReviewCount && (
          <span className={`text-gray-500 ${sizeClasses[size]}`}>
            ({ratingData.reviewCount}+)
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      <span className={`font-semibold ${sizeClasses[size]}`}>
        {ratingData.rating.toFixed(1)}
      </span>
      {showReviewCount && (
        <span className={`text-gray-500 ${sizeClasses[size]}`}>
          ({ratingData.reviewCount}+ Google reviews)
        </span>
      )}
    </div>
  )
}

// Hook for use in other components
export function useGoogleRating() {
  const [ratingData, setRatingData] = useState<RatingData>(DEFAULT_RATING)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRating() {
      try {
        const response = await fetch('/api/google-rating')
        if (response.ok) {
          const data = await response.json()
          setRatingData({
            rating: data.rating,
            reviewCount: data.reviewCount,
          })
        }
      } catch (error) {
        console.error('Failed to fetch Google rating:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRating()
  }, [])

  return { ...ratingData, isLoading }
}
