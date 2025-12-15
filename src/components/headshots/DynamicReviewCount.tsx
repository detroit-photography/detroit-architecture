'use client'

import { useEffect, useState } from 'react'

export function DynamicReviewCount() {
  const [reviewCount, setReviewCount] = useState(203)

  useEffect(() => {
    fetch('/api/google-rating')
      .then(res => res.json())
      .then(data => {
        if (data.reviewCount) {
          setReviewCount(data.reviewCount)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <p className="text-center text-gray-500 mb-12">
      {reviewCount} five-star Google reviews
    </p>
  )
}


