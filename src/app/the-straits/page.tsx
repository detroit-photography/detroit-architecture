import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Star, MapPin, Camera, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The Straits',
  description: 'Photography at The Straits of Mackinac. Professional destination photography in Northern Michigan. Book your session today!',
}

export default function TheStraitsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-detroit-green text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-detroit-gold/20 border border-detroit-gold px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-detroit-gold" />
            <span className="text-detroit-gold text-sm font-medium">Northern Michigan</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            The Straits
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            Professional photography at one of Michigan's most beautiful destinations. 
            Capture memories at the Straits of Mackinac.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/the-straits-guide"
              className="inline-block bg-white text-detroit-green px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
            >
              View Guide
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-white text-white px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-detroit-green transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-8">
            Photography at The Straits
          </h2>
          <div className="prose prose-lg mx-auto">
            <p>
              The Straits of Mackinac offer some of the most stunning natural scenery in the Midwest. 
              From the iconic Mackinac Bridge to the historic charm of Mackinac Island, this destination 
              provides endless opportunities for beautiful photography.
            </p>
            <p>
              Whether you're planning a destination wedding, family vacation portraits, or professional 
              headshots with a unique backdrop, we can help you capture the magic of this special place.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-detroit-cream">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 text-center shadow-sm">
              <Camera className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Portrait Sessions</h3>
              <p className="text-gray-600">Individual, couple, and family portraits at scenic locations.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Star className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Special Events</h3>
              <p className="text-gray-600">Weddings, engagements, and milestone celebrations.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Clock className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Golden Hour Shoots</h3>
              <p className="text-gray-600">Capture the magical light at sunrise and sunset.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Plan Your Session
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Contact us to discuss your photography needs at The Straits.
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>
    </>
  )
}





