'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function HeroSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    router.push(`/architecture?${params.toString()}`)
  }

  return (
    <div className="relative bg-detroit-green overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-detroit-dark via-detroit-green to-detroit-green" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-24 text-center">
        <p className="text-detroit-gold uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm mb-3 md:mb-4 font-body">
          Detroit Photography
        </p>
        
        <h1 className="font-display text-4xl md:text-7xl text-white mb-4 md:mb-6 leading-tight">
          Architecture
          <span className="block text-detroit-gold italic">Guide</span>
        </h1>
        
        <p className="text-detroit-cream/80 text-base md:text-xl max-w-3xl mx-auto mb-6 md:mb-10 font-light px-4">
          A comprehensive catalog of <span className="text-white">550+ historic buildings</span> in Detroit and Southeast Michigan. Illustrated with original photographs by Andrew Petrov of Detroit Photography, with <a href="/store" className="text-detroit-gold hover:underline">prints available for purchase</a>.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-2" role="search">
          <label htmlFor="building-search" className="sr-only">Search buildings</label>
          <div className="relative">
            <input
              id="building-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search buildings..."
              className="w-full px-4 md:px-6 py-3 md:py-4 pl-10 md:pl-14 text-base md:text-lg bg-white border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-detroit-gold rounded-lg md:rounded-none"
            />
            <Search className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" aria-hidden="true" />
            <button
              type="submit"
              className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-detroit-green text-white px-3 md:px-6 py-1.5 md:py-2 font-medium hover:bg-detroit-gold hover:text-detroit-green transition-colors uppercase tracking-wider text-xs md:text-sm rounded md:rounded-none"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick filters - scrollable on mobile */}
        <div className="flex md:flex-wrap md:justify-center gap-2 md:gap-3 mt-6 md:mt-8 overflow-x-auto pb-2 px-4 -mx-4 md:mx-0 md:px-0">
          {['Art Deco', 'Albert Kahn', 'Gothic Revival', 'Beaux-Arts', 'Downtown'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setQuery(filter)
                router.push(`/architecture?q=${encodeURIComponent(filter)}`)
              }}
              className="px-3 md:px-5 py-1.5 md:py-2 text-white text-xs md:text-sm hover:text-detroit-gold transition-colors border border-detroit-gold/30 hover:border-detroit-gold uppercase tracking-wider whitespace-nowrap flex-shrink-0"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
