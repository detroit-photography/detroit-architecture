'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface ReviewData {
  rating: number
  reviewCount: number
}

export function GoogleReviewsSection() {
  const [data, setData] = useState<ReviewData>({ rating: 5.0, reviewCount: 201 })

  useEffect(() => {
    fetch('/api/google-rating')
      .then(res => res.json())
      .then(d => setData({ rating: d.rating, reviewCount: d.reviewCount }))
      .catch(() => {})
  }, [])

  return (
    <section className="py-12 bg-detroit-cream">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-8 h-8 text-detroit-gold fill-detroit-gold" />
          ))}
        </div>
        <p className="text-4xl font-bold text-detroit-green mb-2">{data.rating.toFixed(1)}</p>
        <p className="text-xl text-gray-700">{data.reviewCount}+ five-star reviews on Google</p>
        <a
          href="https://www.google.com/maps/place/Headshots+by+Detroit+Photography"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-detroit-green hover:text-detroit-gold underline"
        >
          Read our reviews →
        </a>
      </div>
    </section>
  )
}
