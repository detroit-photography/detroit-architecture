'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Map, Camera, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <nav className="bg-detroit-green text-white sticky top-0 z-50" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Detroit Photography Architecture - Home">
            <span className="font-display text-2xl tracking-wide text-detroit-gold">Detroit Photography</span>
            <span className="text-white/70 text-sm font-body uppercase tracking-widest hidden sm:inline" aria-hidden="true">Architecture</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors">
              Buildings
            </Link>
            <Link href="/map" className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors flex items-center gap-1">
              <Map className="w-4 h-4" aria-hidden="true" />
              Map
            </Link>
            <Link 
              href="/store" 
              className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors flex items-center gap-1"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              Print Store
            </Link>
            <a 
              href="https://www.detroitphotography.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors"
            >
              Main Site
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <Link 
              href="/admin" 
              className="bg-detroit-gold/20 border border-detroit-gold text-detroit-gold px-4 py-1.5 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-detroit-green transition-colors flex items-center gap-1 rounded"
            >
              <Camera className="w-4 h-4" aria-hidden="true" />
              Admin
            </Link>
            {/* Cart icon */}
            <Link href="/store/cart" className="relative p-2 hover:text-detroit-gold transition-colors" aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}>
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-detroit-gold text-detroit-green text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" aria-hidden="true">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: Cart + Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/store/cart" className="relative p-2 hover:text-detroit-gold transition-colors" aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}>
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-detroit-gold text-detroit-green text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" aria-hidden="true">
                  {totalItems}
                </span>
              )}
            </Link>
            <button 
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-detroit-gold/20 pt-4">
            <Link href="/" className="block py-2 text-sm uppercase tracking-wider hover:text-detroit-gold" onClick={() => setIsOpen(false)}>Buildings</Link>
            <Link href="/map" className="block py-2 text-sm uppercase tracking-wider hover:text-detroit-gold" onClick={() => setIsOpen(false)}>Map</Link>
            <Link href="/store" className="block py-2 text-sm uppercase tracking-wider hover:text-detroit-gold" onClick={() => setIsOpen(false)}>Print Store</Link>
            <a href="https://www.detroitphotography.com" className="block py-2 text-sm uppercase tracking-wider hover:text-detroit-gold">Main Site</a>
            <Link href="/admin" className="block py-2 text-sm uppercase tracking-wider text-detroit-gold font-medium" onClick={() => setIsOpen(false)}>Admin</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
