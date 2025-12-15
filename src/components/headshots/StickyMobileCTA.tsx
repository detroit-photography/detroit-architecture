'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'

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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
      {/* Gradient shadow for depth */}
      <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      
      <div className="bg-detroit-green border-t-2 border-detroit-gold shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
        <div className="px-4 py-3">
          {/* Top row: Social proof */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-detroit-gold text-detroit-gold" />
              ))}
            </div>
            <span className="text-white/90 text-xs font-medium">201 five-star reviews</span>
            <span className="text-white/50 text-xs">•</span>
            <span className="text-detroit-gold text-xs font-bold">From $149</span>
          </div>
          
          {/* CTA Button - Full width, prominent */}
          <Link
            href="#pricing"
            className="flex items-center justify-center gap-2 w-full bg-white text-detroit-green py-3 px-6 font-bold uppercase tracking-wide text-sm rounded hover:bg-detroit-gold hover:text-white transition-all active:scale-[0.98]"
          >
            See Pricing & Book
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
