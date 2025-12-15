'use client'

import { useEffect, useState } from 'react'
import { GoogleIcon } from './GoogleIcon'

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
    <p className="text-center text-gray-700 mb-12 flex items-center justify-center gap-2">
      {reviewCount} five-star reviews on <GoogleIcon className="w-5 h-5" />
    </p>
  )
}


