import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Drone Photography & Video in Detroit',
  description: 'FAA-certified drone photography and video in Detroit. Real estate, construction, events, and commercial aerial photography.',
}

export default function DronePhotographyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            <div className="flex flex-col justify-center px-6 py-12 lg:py-24 lg:px-12">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
                Drone Photography & Video
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                FAA Part 107 certified drone pilot. Stunning aerial photography and video for 
                real estate, construction, events, and commercial projects in Detroit and Southeast Michigan.
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
                src="/images/headshots/bagley-drone.jpg"
                alt="Aerial drone photography of Bagley Mansion Detroit"
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
            Aerial Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Real Estate</h3>
              <p className="text-gray-600">
                Stunning aerial photos and videos to showcase properties and their surroundings.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Construction</h3>
              <p className="text-gray-600">
                Progress documentation, site surveys, and marketing content for construction projects.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Events</h3>
              <p className="text-gray-600">
                Capture outdoor events, festivals, and gatherings from a unique perspective.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Commercial</h3>
              <p className="text-gray-600">
                Marketing content, architectural photography, and business documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
            Ready for aerial photography?
          </h2>
          <p className="text-detroit-cream/80 text-lg mb-8">
            Contact us to discuss your drone photography or video project. FAA Part 107 certified and fully insured.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  )
}
