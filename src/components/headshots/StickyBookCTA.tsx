'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Calendar } from 'lucide-react'

export function StickyBookCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show after scrolling down 500px
      if (currentScrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      
      // Hide when scrolling up
      if (currentScrollY < lastScrollY - 50) {
        setIsHidden(true)
      } else if (currentScrollY > lastScrollY + 50) {
        setIsHidden(false)
      }
      
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-detroit-green text-white shadow-2xl transform transition-transform duration-300 ${
        isHidden ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex">
        <a 
          href="tel:13133518244"
          className="flex-1 flex items-center justify-center gap-2 py-4 border-r border-white/20 hover:bg-white/10 transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="font-medium">Call Now</span>
        </a>
        <Link 
          href="/book"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-detroit-gold text-detroit-green hover:bg-white transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Book Online</span>
        </Link>
      </div>
    </div>
  )
}
