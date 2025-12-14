import type { Metadata } from 'next'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Star, Check, Users, Camera, Building } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Group Photos in Detroit | Corporate & Team Photography',
  description: 'Professional group photography in Detroit. Corporate teams, organizations, events. In-studio or on-location. Volume discounts. 5-star rated. Book today!',
}

export default function GroupPhotosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-detroit-green text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-detroit-gold/20 border border-detroit-gold px-4 py-2 mb-6">
            <Star className="w-4 h-4 fill-detroit-gold text-detroit-gold" />
            <span className="text-detroit-gold text-sm font-medium">Detroit's #1-Rated Studio</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Group Photos in Detroit
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            Professional group photography for corporate teams, organizations, and events. 
            We make it easy to get great photos of groups of any size.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#pricing"
              className="inline-block bg-white text-detroit-green px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
            >
              Get Pricing
            </Link>
            <Link
              href="/headshots/book"
              className="inline-block border-2 border-white text-white px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-detroit-green transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-detroit-cream">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Group Photography Options
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 text-center shadow-sm">
              <Users className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Team Photos</h3>
              <p className="text-gray-600">Individual and group shots with consistent style.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Building className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">On-Location</h3>
              <p className="text-gray-600">We bring professional equipment to your office.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Camera className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Event Photography</h3>
              <p className="text-gray-600">Capture group photos at conferences and events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            What's Included
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Individual + group combinations',
              'Consistent lighting & style',
              'Professional retouching',
              'Volume discounts for 10+',
              'Fast turnaround',
              'Online gallery for ordering',
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 bg-detroit-cream p-6">
                <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with Form */}
      <section id="pricing" className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Get Group Photo Pricing
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Volume discounts available for teams of 10 or more.
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>
    </>
  )
}





