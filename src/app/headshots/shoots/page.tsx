import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { shoots } from '@/lib/shoots-data'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Browse our portfolio of professional photography work. Headshots, corporate photography, events, and more in Detroit.',
}

export default function ShootsPage() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">
            Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our recent work. Each shoot showcases the quality and style you can expect from Detroit Photography.
          </p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link
            href="/headshots/shoots"
            className="px-4 py-2 bg-detroit-green text-white text-sm uppercase tracking-wider"
          >
            All
          </Link>
          <Link
            href="/headshots/shoots?tag=headshots"
            className="px-4 py-2 border border-detroit-green text-detroit-green text-sm uppercase tracking-wider hover:bg-detroit-green hover:text-white transition-colors"
          >
            Headshots
          </Link>
          <Link
            href="/headshots/shoots?tag=corporate"
            className="px-4 py-2 border border-detroit-green text-detroit-green text-sm uppercase tracking-wider hover:bg-detroit-green hover:text-white transition-colors"
          >
            Corporate
          </Link>
          <Link
            href="/headshots/shoots?tag=events"
            className="px-4 py-2 border border-detroit-green text-detroit-green text-sm uppercase tracking-wider hover:bg-detroit-green hover:text-white transition-colors"
          >
            Events
          </Link>
        </div>

        {/* Shoots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shoots.map((shoot) => (
            <Link
              key={shoot.slug}
              href={`/headshots/shoots/${shoot.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <Image
                  src={shoot.coverImage}
                  alt={shoot.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-1 group-hover:text-detroit-gold transition-colors">
                {shoot.title}
              </h3>
              <p className="text-gray-500 text-sm mb-2">{shoot.date}</p>
              {shoot.location && (
                <p className="text-detroit-green text-sm">
                  📍 {shoot.locationName}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {shoot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-detroit-cream text-gray-600 text-xs uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
