'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (about 500px)
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-detroit-green border-t border-detroit-gold/30 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] safe-area-inset-bottom">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-detroit-gold text-detroit-gold" />
            ))}
          </div>
          <span className="text-white text-xs">201 reviews</span>
        </div>
        <Link
          href="#pricing"
          className="bg-detroit-gold text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide rounded shadow-lg hover:bg-white hover:text-detroit-green transition-colors"
        >
          Get Pricing
        </Link>
      </div>
    </div>
  )
}


