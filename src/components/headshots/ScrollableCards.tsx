'use client'

import { useRef, useState, useEffect, useCallback, memo, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ScrollableCardsProps {
  children: ReactNode
  className?: string
}

export const ScrollableCards = memo(function ScrollableCards({ children, className = '' }: ScrollableCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  useEffect(() => {
    checkScroll()
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll, { passive: true })
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [checkScroll])

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-detroit-green" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-detroit-green" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className={`flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing ${className}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  )
})

ScrollableCards.displayName = 'ScrollableCards'

