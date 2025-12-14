import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Event Photo Booths in Detroit',
  description: 'Professional headshot booths for conferences, corporate events, and trade shows in Detroit. On-site setup with instant delivery.',
}

export default function EventBoothsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            <div className="flex flex-col justify-center px-6 py-12 lg:py-24 lg:px-12">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
                Event Photo Booths
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professional headshot booths for conferences, corporate events, and trade shows. 
                Give your attendees a memorable experience with instant, high-quality headshots.
              </p>
              <div>
                <Link
                  href="/headshots/contact"
                  className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px]">
              <Image
                src="/images/headshots/studio-interior.jpg"
                alt="Event photo booth setup"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-detroit-cream">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-detroit-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">We Set Up</h3>
              <p className="text-gray-600">
                We arrive early and set up a professional studio backdrop at your venue.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-detroit-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Guests Arrive</h3>
              <p className="text-gray-600">
                Attendees step in for a 2-3 minute professional headshot session.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-detroit-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Real-Time Preview</h3>
              <p className="text-gray-600">
                Each guest sees their photos instantly and selects their favorite.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-detroit-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Instant Delivery</h3>
              <p className="text-gray-600">
                Edited photos delivered to each guest's email within hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Professional photographer</h3>
                <p className="text-gray-600">Experienced headshot photographer on-site for your event.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Studio-quality lighting</h3>
                <p className="text-gray-600">Professional lighting setup for consistent, flattering results.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Custom backdrop</h3>
                <p className="text-gray-600">Solid colors or branded backdrops available.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Real-time editing</h3>
                <p className="text-gray-600">Basic retouching done on-site for immediate delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Digital delivery</h3>
                <p className="text-gray-600">Each guest receives their photos via email.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">High volume capacity</h3>
                <p className="text-gray-600">Photograph 20-30+ guests per hour.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
            Planning an event?
          </h2>
          <p className="text-detroit-cream/80 text-lg mb-8">
            Contact us to discuss your event photo booth needs. We customize every setup to match your event.
          </p>
          <Link
            href="/headshots/contact"
            className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  )
}
