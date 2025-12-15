'use client'

import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'

interface Review {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
  profile_photo_url?: string
}

interface ReviewData {
  rating: number
  reviewCount: number
}

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Headshots+by+Detroit+Photography/@42.3755776,-83.132416,14z/data=!4m6!3m5!1s0x2998aadd7474799f:0xa334661cf827d5cf!8m2!3d42.3400136!4d-83.0194721!16s%2Fg%2F11rvd2qn5d?entry=ttu'

export function GoogleReviewsSection() {
  const [data, setData] = useState<ReviewData>({ rating: 5.0, reviewCount: 203 })
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // Fetch rating
    fetch('/api/google-rating')
      .then(res => res.json())
      .then(d => setData({ rating: d.rating || 5.0, reviewCount: d.reviewCount || 201 }))
      .catch(() => {})

    // Fetch reviews
    fetch('/api/google-rating', { method: 'POST' })
      .then(res => res.json())
      .then(d => {
        if (d.reviews && d.reviews.length > 0) {
          setReviews(d.reviews.filter((r: Review) => r.rating >= 4))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-12 bg-detroit-cream">
      <div className="max-w-4xl mx-auto px-4">
        {/* Rating Summary */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-detroit-gold fill-detroit-gold" />
            ))}
          </div>
          <p className="text-4xl font-bold text-detroit-green mb-2">{data.rating.toFixed(1)}</p>
          <p className="text-xl text-gray-700">{data.reviewCount}+ five-star reviews on Google</p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-detroit-green hover:text-detroit-gold underline"
          >
            Read all reviews →
          </a>
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-detroit-gold fill-detroit-gold' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-detroit-gold/30 mb-2" />
                <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                  {review.text}
                </p>
                <div className="flex items-center gap-3">
                  {review.profile_photo_url ? (
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-detroit-green text-white flex items-center justify-center font-medium">
                      {review.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{review.author_name}</p>
                    <p className="text-gray-500 text-xs">{review.relative_time_description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {reviews.length > 0 && (
          <div className="text-center mt-8">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-detroit-green text-white px-6 py-3 rounded-lg hover:bg-detroit-gold transition-colors"
            >
              See All {data.reviewCount}+ Reviews
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
