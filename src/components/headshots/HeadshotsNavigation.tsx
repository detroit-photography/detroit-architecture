'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, memo } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Headshots',
    children: [
      { label: 'Headshot Photography', href: '/headshot-photography-in-detroit' },
      { label: 'Group Photos', href: '/group-photos-in-detroit' },
      { label: 'Event Booths', href: '/event-booths' },
      { label: 'LinkedIn Headshots', href: '/linkedin-profile-photographer-in-detroit' },
    ],
  },
  {
    label: 'Other Services',
    children: [
      { label: 'Branding Photography', href: '/branding-photography' },
      { label: 'Event Photography', href: '/event-photography' },
      { label: 'Portrait Photography', href: '/portrait-photography' },
      { label: 'Sports Photography', href: '/sports-photographer-in-detroit' },
      { label: 'Dating Profile Photos', href: '/headshot-types/dating-headshots-in-detroit' },
      { label: 'Drone Photography', href: '/drone-photography' },
      { label: 'Videography', href: '/detroit-videography-services' },
    ],
  },
  {
    label: 'Portfolio',
    children: [
      { label: 'Photo Shoots', href: '/shoots' },
      { label: 'Architecture Portfolio', href: '/architecture' },
      { label: 'Real Estate', href: '/real-estate-portfolio' },
    ],
  },
  {
    label: 'More',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
      { label: 'Book Now', href: '/book' },
    ],
  },
]

export const HeadshotsNavigation = memo(function HeadshotsNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <nav className="bg-detroit-green text-white sticky top-0 z-50" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo - optimized */}
          <Link href="/" className="flex items-center gap-3" aria-label="Detroit Photography - Home">
            <Image 
              src="/images/headshots/logo.svg" 
              alt="Detroit Photography" 
              width={56}
              height={56}
              className="h-12 w-12 md:h-14 md:w-14"
              priority
            />
            <div className="font-display text-detroit-gold tracking-wide">
              <div className="text-lg md:text-xl tracking-[0.2em]">DETROIT</div>
              <div className="text-sm md:text-base tracking-[0.15em]">PHOTOGRAPHY</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div 
                key={item.label} 
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <>
                    <button 
                      className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors flex items-center gap-1 py-2"
                      aria-expanded={openDropdown === item.label}
                    >
                      {item.label}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 bg-white text-gray-900 shadow-xl py-2 min-w-[200px] z-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm hover:bg-detroit-cream transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-sm uppercase tracking-wider hover:text-detroit-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/headshots/book"
              className="bg-white text-detroit-green px-6 py-2.5 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4 border-t border-detroit-gold/20 pt-4">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div className="space-y-2">
                    <div className="text-detroit-gold text-sm uppercase tracking-wider font-medium">
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-1 pl-4 text-sm hover:text-detroit-gold transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-2 text-sm uppercase tracking-wider hover:text-detroit-gold"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/headshots/book"
              className="block bg-white text-detroit-green px-6 py-3 text-center text-sm uppercase tracking-wider font-medium mt-4"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
})

HeadshotsNavigation.displayName = 'HeadshotsNavigation'
