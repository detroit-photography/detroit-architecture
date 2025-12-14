import type { Metadata } from 'next'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Star, Check, Linkedin, TrendingUp, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'LinkedIn Profile Photographer in Detroit | Professional Headshots',
  description: 'Professional LinkedIn headshots in Detroit. Increase profile views by 14x. 5-star rated studio. Starting at $149. Same-day delivery. Book today!',
}

export default function LinkedInProfilePhotographerPage() {
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
            LinkedIn Profile Photographer in Detroit
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            A professional LinkedIn photo can increase your profile views by up to 14x. 
            Make a great first impression with a headshot that gets you noticed.
          </p>
          
          <p className="text-detroit-cream/70 mb-8">
            Starting at <span className="text-detroit-gold font-bold text-3xl">$149</span>
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

      {/* Why LinkedIn Headshots Matter */}
      <section className="py-16 bg-detroit-cream">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Why Your LinkedIn Photo Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 text-center shadow-sm">
              <TrendingUp className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">14x More Views</h3>
              <p className="text-gray-600">Profiles with professional photos get 14x more profile views.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Linkedin className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">36x More Messages</h3>
              <p className="text-gray-600">Professional headshots lead to 36x more connection requests.</p>
            </div>
            <div className="bg-white p-8 text-center shadow-sm">
              <Users className="w-12 h-12 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-3">First Impressions</h3>
              <p className="text-gray-600">40% of recruiters won't consider candidates without a photo.</p>
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
              'Professional retouching',
              'LinkedIn-optimized crop',
              'Same-day delivery available',
              'Guidance on what to wear',
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
              Get Your LinkedIn Headshot
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Professional headshots starting at <span className="text-detroit-gold font-bold text-3xl">$149</span>
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>
    </>
  )
}





