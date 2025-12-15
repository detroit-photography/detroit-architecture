'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'

// Pages where footer should be hidden (landing pages for ads, homepage)
const HIDE_FOOTER_PATHS = [
  '/',
  '/headshot-photography-in-detroit',
]

// Prefixes where footer should be hidden (architecture has its own)
const HIDE_FOOTER_PREFIXES = ['/architecture', '/admin']

export function HeadshotsFooter() {
  const pathname = usePathname()
  
  // Hide footer on landing pages
  if (HIDE_FOOTER_PATHS.includes(pathname)) {
    return null
  }
  
  // Hide on architecture/admin pages - they have their own footer
  if (HIDE_FOOTER_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return null
  }

  return (
    <footer className="bg-detroit-green text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-6">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/headshots/logo-new.png" 
                alt="Detroit Photography" 
                className="h-14 w-14"
              />
              <div className="font-display text-xl md:text-2xl text-detroit-gold">
                Detroit Photography
              </div>
            </div>
            <div className="space-y-2 text-detroit-cream/80 text-sm mb-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-detroit-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Bagley Mansion</p>
                  <p>2921 E Jefferson Ave, Suite 101</p>
                  <p>Detroit, MI 48207</p>
                </div>
              </div>
              <a href="tel:13133518244" className="flex items-center gap-2 hover:text-detroit-gold transition-colors">
                <Phone className="w-4 h-4 text-detroit-gold" />
                (313) 351-8244
              </a>
              <a href="mailto:andrew@detroitphotography.com" className="flex items-center gap-2 hover:text-detroit-gold transition-colors">
                <Mail className="w-4 h-4 text-detroit-gold" />
                andrew@detroitphotography.com
              </a>
            </div>
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/detroitphoto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 border border-detroit-gold/50 flex items-center justify-center hover:bg-detroit-gold hover:text-detroit-green transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/detroitphotography" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 border border-detroit-gold/50 flex items-center justify-center hover:bg-detroit-gold hover:text-detroit-green transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Photography Services */}
          <div>
            <h4 className="uppercase tracking-[0.15em] text-xs mb-3 text-detroit-gold">Services</h4>
            <ul className="space-y-1.5 text-detroit-cream/70 text-sm">
              <li>
                <Link href="/headshot-photography-in-detroit" className="hover:text-detroit-gold transition-colors">
                  Headshots
                </Link>
              </li>
              <li>
                <Link href="/branding-photography" className="hover:text-detroit-gold transition-colors">
                  Branding
                </Link>
              </li>
              <li>
                <Link href="/group-photos-in-detroit" className="hover:text-detroit-gold transition-colors">
                  Group Photos
                </Link>
              </li>
              <li>
                <Link href="/event-photography" className="hover:text-detroit-gold transition-colors">
                  Event Photography
                </Link>
              </li>
              <li>
                <Link href="/sports-photographer-in-detroit" className="hover:text-detroit-gold transition-colors">
                  Sports Photography
                </Link>
              </li>
              <li>
                <Link href="/headshot-types/dating-headshots-in-detroit" className="hover:text-detroit-gold transition-colors">
                  Dating Photos
                </Link>
              </li>
            </ul>
          </div>

          {/* Headshot Types */}
          <div>
            <h4 className="uppercase tracking-[0.15em] text-xs mb-3 text-detroit-gold">Headshot Types</h4>
            <ul className="space-y-1.5 text-detroit-cream/70 text-sm">
              <li>
                <Link href="/headshot-types/business-headshots-detroit" className="hover:text-detroit-gold transition-colors">
                  Business Headshots
                </Link>
              </li>
              <li>
                <Link href="/headshot-types/executive-headshots-detroit" className="hover:text-detroit-gold transition-colors">
                  Executive Headshots
                </Link>
              </li>
              <li>
                <Link href="/headshot-types/doctor-headshots-detroit" className="hover:text-detroit-gold transition-colors">
                  Doctor Headshots
                </Link>
              </li>
              <li>
                <Link href="/headshot-types/lawyer-headshots-detroit" className="hover:text-detroit-gold transition-colors">
                  Lawyer Headshots
                </Link>
              </li>
              <li>
                <Link href="/headshot-types/realtor-headshots-detroit" className="hover:text-detroit-gold transition-colors">
                  Realtor Headshots
                </Link>
              </li>
              <li>
                <Link href="/headshot-types/actor-headshots-in-detroit" className="hover:text-detroit-gold transition-colors">
                  Actor Headshots
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas Served */}
          <div>
            <h4 className="uppercase tracking-[0.15em] text-xs mb-3 text-detroit-gold">Areas Served</h4>
            <ul className="space-y-1.5 text-detroit-cream/70 text-sm">
              <li>
                <Link href="/headshot-photographer-in-birmingham-michigan" className="hover:text-detroit-gold transition-colors">
                  Birmingham
                </Link>
              </li>
              <li>
                <Link href="/headshot-photographer-in-royal-oak-michigan" className="hover:text-detroit-gold transition-colors">
                  Royal Oak
                </Link>
              </li>
              <li>
                <Link href="/headshot-photographer-in-troy-michigan" className="hover:text-detroit-gold transition-colors">
                  Troy
                </Link>
              </li>
              <li>
                <Link href="/headshot-photographer-in-ann-arbor-michigan" className="hover:text-detroit-gold transition-colors">
                  Ann Arbor
                </Link>
              </li>
              <li>
                <Link href="/headshot-photographer-in-southfield-michigan" className="hover:text-detroit-gold transition-colors">
                  Southfield
                </Link>
              </li>
              <li>
                <Link href="/headshot-photographer-in-dearborn-michigan" className="hover:text-detroit-gold transition-colors">
                  Dearborn
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="uppercase tracking-[0.15em] text-xs mb-3 text-detroit-gold">Quick Links</h4>
            <ul className="space-y-1.5 text-detroit-cream/70 text-sm">
              <li>
                <Link href="/book" className="hover:text-detroit-gold transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/headshot-photography-in-detroit" className="hover:text-detroit-gold transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-detroit-gold transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-detroit-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-detroit-gold transition-colors">
                  Architecture Portfolio
                </Link>
              </li>
              <li>
                <Link href="/detroit-architecture-photographer" className="hover:text-detroit-gold transition-colors">
                  Architecture Photography
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-detroit-gold/20 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-detroit-cream/50">
            <p>© {new Date().getFullYear()} Detroit Photography. All rights reserved.</p>
            <p>All photographs © Andrew Petrov / Detroit Photography</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
