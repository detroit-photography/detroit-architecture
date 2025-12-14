import type { Metadata } from 'next'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Star, Check, Camera, Users, Palette } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Branding Photography in Detroit | Personal Brand Photographer',
  description: 'Professional branding photography in Detroit. Build your personal brand with stunning visuals. 5-star rated studio at historic Bagley Mansion. Book today!',
}

export default function BrandingPhotographyPage() {
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
            Branding Photography in Detroit
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            Build a powerful personal brand with professional photography that tells your story. 
            From headshots to lifestyle images, we create visuals that connect with your audience.
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

      {/* What's Included */}
      <section className="py-16 bg-detroit-cream">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            What's Included
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 text-center shadow-sm">
              <Camera className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Professional Headshots</h3>
              <p className="text-gray-600">Multiple looks for LinkedIn, your website, and marketing materials.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Users className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Lifestyle Images</h3>
              <p className="text-gray-600">Action shots that show you doing what you do best.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Palette className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">Brand Consistency</h3>
              <p className="text-gray-600">Cohesive visuals that match your brand colors and style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Why Branding Photography?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Stand out on social media',
              'Build trust with potential clients',
              'Create a consistent brand image',
              'Content for months of marketing',
              'Professional website imagery',
              'Authentic storytelling',
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
              Get Your Branding Photography Quote
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Custom packages tailored to your brand needs.
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>
    </>
  )
}





