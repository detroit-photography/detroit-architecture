'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Map, Camera } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-detroit-green text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="font-display text-2xl tracking-wide text-detroit-gold">Detroit Photography</span>
            <span className="text-white/70 text-sm font-body uppercase tracking-widest hidden sm:inline">Architecture</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors">
              Buildings
            </Link>
            <Link href="/map" className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors flex items-center gap-1">
              <Map className="w-4 h-4" />
              Map
            </Link>
            <a 
              href="https://www.detroitphotography.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors"
            >
              Main Site
            </a>
            <Link 
              href="/admin" 
              className="bg-detroit-gold text-detroit-green px-4 py-2 text-sm uppercase tracking-wider font-medium hover:bg-detroit-cream transition-colors flex items-center gap-1"
            >
              <Camera className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-detroit-gold/20 pt-4">
            <Link href="/" className="block py-2 text-sm uppercase tracking-wider hover:text-detroit-gold">Buildings</Link>
            <Link href="/map" className="block py-2 text-sm uppercase tracking-wider hover:text-detroit-gold">Map</Link>
            <a href="https://www.detroitphotography.com" className="block py-2 text-sm uppercase tracking-wider hover:text-detroit-gold">Main Site</a>
            <Link href="/admin" className="block py-2 text-sm uppercase tracking-wider text-detroit-gold font-medium">Admin</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
