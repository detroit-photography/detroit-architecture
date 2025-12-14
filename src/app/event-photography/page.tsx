import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeadshotsGallery } from '@/components/headshots/HeadshotsGallery'

export const metadata: Metadata = {
  title: 'Event Photography in Detroit',
  description: 'Professional event photography in Detroit. Corporate events, conferences, galas, and more. Capture the moments that matter.',
}

const eventImages = [
  { src: '/images/headshots/studio-interior.jpg', alt: 'Corporate event photography' },
  { src: '/images/headshots/team-photo.jpg', alt: 'Team event' },
  { src: '/images/headshots/bagley-interior-3.jpg', alt: 'Event venue' },
  { src: '/images/headshots/bagley-mansion.jpg', alt: 'Historic venue' },
]

export default function EventPhotographyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            <div className="flex flex-col justify-center px-6 py-12 lg:py-24 lg:px-12">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
                Event Photography
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professional photography for corporate events, conferences, galas, and celebrations. 
                We capture the moments that matter.
              </p>
              <div>
                <Link
                  href="/contact"
                  className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px]">
              <Image
                src="/images/bagley-interior-3.jpg"
                alt="Event photography at Detroit venue"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-detroit-cream">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Event Types We Cover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Corporate Events</h3>
              <p className="text-gray-600">
                Annual meetings, product launches, company milestones, holiday parties, and more.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Conferences & Seminars</h3>
              <p className="text-gray-600">
                Keynote speakers, panel discussions, networking sessions, and expo floor coverage.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Galas & Award Ceremonies</h3>
              <p className="text-gray-600">
                Black-tie events, award presentations, red carpet moments, and celebration photography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Event Photography Portfolio
          </h2>
          <HeadshotsGallery images={eventImages} columns={4} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
            Let's capture your next event
          </h2>
          <p className="text-detroit-cream/80 text-lg mb-8">
            Contact us to discuss your event photography needs. Every event is unique, and we tailor our approach to match.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
