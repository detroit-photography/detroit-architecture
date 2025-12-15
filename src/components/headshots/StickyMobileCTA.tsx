'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
      setIsVisible(window.scrollY > 400)
      
      // Hide when near the pricing form section
      const pricingSection = document.getElementById('pricing')
      if (pricingSection) {
        const rect = pricingSection.getBoundingClientRect()
        setIsAtBottom(rect.top < window.innerHeight + 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible || isAtBottom) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-detroit-gold text-detroit-gold" />
              ))}
            </div>
            <span className="text-xs text-gray-600 truncate">201 reviews</span>
          </div>
          <Link
            href="#pricing"
            className="flex-shrink-0 bg-detroit-green text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-detroit-green/90 transition-colors rounded"
          >
            See Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
