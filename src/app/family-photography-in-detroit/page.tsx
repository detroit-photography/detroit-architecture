import type { Metadata } from 'next'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Star, Check, Heart, Users, Camera } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Family Photography in Detroit | Professional Family Portraits',
  description: 'Professional family photography in Detroit. Capture memories at historic Bagley Mansion. 5-star rated studio. Relaxed sessions, beautiful results. Book today!',
}

export default function FamilyPhotographyPage() {
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
            Family Photography in Detroit
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            Capture your family's story in a beautiful, historic setting. Our relaxed sessions 
            at Bagley Mansion create lasting memories you'll treasure for generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#pricing"
              className="inline-block bg-white text-detroit-green px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
            >
              Get Pricing
            </Link>
            <Link
              href="/book"
              className="inline-block border-2 border-white text-white px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-detroit-green transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-detroit-cream">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            The Experience
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 text-center shadow-sm">
              <Heart className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Relaxed Sessions</h3>
              <p className="text-gray-600">No rushing. Take your time and enjoy the experience.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Users className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">All Ages Welcome</h3>
              <p className="text-gray-600">From newborns to grandparents—we photograph them all.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Camera className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Beautiful Backdrops</h3>
              <p className="text-gray-600">Historic mansion interiors and outdoor options.</p>
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
              'Unlimited session time',
              'Multiple outfit changes',
              'Indoor & outdoor locations',
              'Professional retouching',
              'High-resolution digital files',
              'Print-ready images',
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
              Get Family Session Pricing
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Family sessions starting at <span className="text-detroit-gold font-bold">$249</span>
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>
    </>
  )
}





