import type { Metadata } from 'next'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Star, Check, Home, Camera, Plane } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Real Estate Photography Portfolio | Detroit Photography',
  description: 'Professional real estate photography in Detroit. HDR photos, drone shots, virtual tours & virtual staging. Fast turnaround. View our portfolio.',
}

export default function RealEstatePortfolioPage() {
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
            Real Estate Photography
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            Sell listings faster with professional photography. HDR photos, drone shots, 
            virtual tours, and virtual staging—everything you need to market your property.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#pricing"
              className="inline-block bg-white text-detroit-green px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
            >
              Get Pricing
            </Link>
            <Link
              href="/headshots/contact"
              className="inline-block border-2 border-white text-white px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-detroit-green transition-colors"
            >
              Contact Us
            </Link>
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
              <h3 className="font-display text-xl text-gray-900 mb-3">HDR Photography</h3>
              <p className="text-gray-600">Professional interior and exterior photos that make properties shine.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Plane className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Drone Photography</h3>
              <p className="text-gray-600">Stunning aerial views that showcase the property and neighborhood.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Home className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Virtual Staging</h3>
              <p className="text-gray-600">Transform empty rooms into beautifully furnished spaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              '24-hour turnaround standard',
              'Same-day rush available',
              'MLS-ready images',
              'Unlimited photos per shoot',
              'Professional editing included',
              'Competitive pricing',
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
              Get Real Estate Photography Pricing
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Fast quotes for your listing. Same-day availability.
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>
    </>
  )
}





