import Link from 'next/link'
import { Camera, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-detroit-green text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="font-display text-2xl md:text-3xl mb-3 md:mb-4">
              <span className="text-detroit-gold">Detroit Photography</span>
            </div>
            <p className="text-white/70 uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm mb-3 md:mb-4">
              Architecture Repository
            </p>
            <p className="text-detroit-cream/60 mb-4 md:mb-6 font-light leading-relaxed text-sm hidden md:block">
              A comprehensive catalog of historic Detroit architecture, documenting the city's 
              rich architectural heritage from the 18th century to the present day.
            </p>
            <a 
              href="https://www.detroitphotography.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-detroit-gold hover:text-detroit-cream transition-colors uppercase tracking-wider text-xs md:text-sm"
            >
              <Camera className="w-4 h-4" />
              Visit Main Site
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm mb-4 md:mb-6 text-detroit-gold">Explore</h4>
            <ul className="space-y-2 md:space-y-3 text-detroit-cream/60 text-sm">
              <li><Link href="/?photos=all" className="hover:text-detroit-gold transition-colors">All Buildings</Link></li>
              <li><Link href="/map" className="hover:text-detroit-gold transition-colors">Map</Link></li>
              <li><Link href="/?photos=true" className="hover:text-detroit-gold transition-colors">With Photos</Link></li>
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h4 className="uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm mb-4 md:mb-6 text-detroit-gold">Sources</h4>
            <ul className="space-y-3 text-detroit-cream/60 text-xs md:text-sm">
              <li>
                <strong className="text-white">AIA Detroit</strong><br />
                <em>Guide (2003)</em>
              </li>
              <li>
                <strong className="text-white">W. H. Ferry</strong><br />
                <em>Buildings of Detroit</em>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-detroit-gold/20 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-center md:text-left">
          <p className="text-detroit-cream/50 text-xs md:text-sm">
            © {new Date().getFullYear()} Detroit Photography
          </p>
          <p className="text-detroit-cream/30 text-xs">
            Last updated: December 7, 2025
          </p>
        </div>
      </div>
    </footer>
  )
}
