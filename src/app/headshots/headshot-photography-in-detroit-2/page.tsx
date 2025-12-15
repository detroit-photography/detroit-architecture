import type { Metadata } from 'next'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowRight, Check, Clock, Sparkles, Quote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Detroit\'s #1 Headshot Photographer | See Yourself Differently',
  description: 'The headshot that changes everything. 201 five-star reviews. Same-day delivery. Historic Bagley Mansion studio. Join Detroit\'s top executives, attorneys & physicians. Starting at $149.',
  keywords: [
    'professional headshots detroit',
    'headshots near me',
    'executive headshots detroit',
    'corporate photographer detroit',
    'linkedin headshots',
    'business portraits',
  ],
  openGraph: {
    title: 'Detroit\'s #1 Headshot Photographer',
    description: 'The headshot that changes everything. 201 five-star reviews.',
    images: [
      {
        url: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
        width: 1200,
        height: 630,
        alt: 'Detroit\'s #1 Headshot Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detroit\'s #1 Headshot Photographer',
    description: 'The headshot that changes everything. 201 five-star reviews.',
    images: ['https://www.detroitphotography.com/images/headshots/hero-headshot.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Detroit Photography',
  description: 'Premier headshot photography studio in Detroit',
  image: 'https://detroit-architecture.vercel.app/images/headshots/hero-headshot.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2921 E Jefferson Ave, Suite 101',
    addressLocality: 'Detroit',
    addressRegion: 'MI',
    postalCode: '48207',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '201',
    bestRating: '5',
  },
  priceRange: '$149-$500',
}

export default function LandingPageV2() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO - Cinematic, Story-Driven */}
      <section className="relative min-h-[90vh] bg-black flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/headshots/hero-headshot.jpg"
            alt="Professional headshot photography Detroit"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            {/* Micro-commitment badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm">Same-day sessions available</span>
            </div>

            {/* The Hook - Emotional, Aspirational */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-white mb-6 leading-[1.1]">
              The headshot that<br />
              <span className="text-detroit-gold">changes everything.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
              You know it when you see it. That image that finally captures 
              who you really are. The one that opens doors.
            </p>

            {/* Social proof - specific and credible */}
            <div className="flex items-center gap-6 mb-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-detroit-gold/80 border-2 border-black flex items-center justify-center">
                    <Star className="w-4 h-4 text-black fill-black" />
                  </div>
                ))}
              </div>
              <div className="text-white">
                <div className="font-medium">201 five-star reviews</div>
                <div className="text-white/60 text-sm">Detroit's highest-rated studio</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#get-started"
                className="group inline-flex items-center justify-center gap-2 bg-detroit-gold text-black px-8 py-4 text-lg font-medium hover:bg-white transition-colors"
              >
                See Your Options
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-5 h-5" />
                <span>Takes 30 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* THE PROBLEM - Agitate the Pain Point */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-detroit-gold uppercase tracking-[0.2em] text-sm mb-6">The truth about headshots</p>
          <h2 className="font-display text-3xl md:text-5xl text-gray-900 mb-8 leading-tight">
            Most headshots make you look like<br />
            <span className="text-gray-400">everyone else.</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Generic backdrop. Forced smile. The same pose you've seen a thousand times. 
            It gets lost in the noise. It doesn't capture what makes <em>you</em> different.
          </p>
        </div>
      </section>

      {/* THE TRANSFORMATION - Before/After Mindset */}
      <section className="py-20 md:py-32 bg-detroit-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-detroit-gold uppercase tracking-[0.2em] text-sm mb-6">The difference</p>
              <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-8">
                What if your headshot actually told your story?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-detroit-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-detroit-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Lighting that sculpts</h3>
                    <p className="text-gray-600">Not flat. Not harsh. Light that brings out your best features and hides the rest.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-detroit-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-detroit-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">A photographer who sees you</h3>
                    <p className="text-gray-600">Patient. Perceptive. Someone who knows how to draw out your authentic confidence.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-detroit-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-detroit-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">A setting that matters</h3>
                    <p className="text-gray-600">Shot inside a historic 1889 mansion. Because context creates perception.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/headshots/testimonial-michelle.jpg"
                alt="Professional executive headshot example"
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-detroit-green text-white p-6 rounded-lg shadow-xl max-w-xs">
                <Quote className="w-8 h-8 text-detroit-gold mb-2 opacity-50" />
                <p className="text-sm italic mb-2">"I've never felt so confident about a photo of myself."</p>
                <p className="text-detroit-gold text-sm font-medium">— Michelle, IBM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - The Numbers That Matter */}
      <section className="py-16 bg-detroit-green text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-display text-detroit-gold mb-2">201</div>
              <div className="text-white/70 text-sm">5-Star Reviews</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display text-detroit-gold mb-2">34%</div>
              <div className="text-white/70 text-sm">Convert to Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display text-detroit-gold mb-2">1889</div>
              <div className="text-white/70 text-sm">Historic Mansion</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display text-detroit-gold mb-2">∞</div>
              <div className="text-white/70 text-sm">Session Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL STORY - Deep, Emotional */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/images/headshots/testimonial-hannah.jpg"
                alt="Hannah Wetherholt - Classical musician headshot"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-detroit-gold text-detroit-gold" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl font-display text-gray-900 mb-6 leading-snug">
                "Andrew captures a variety of photos that tell a true <span className="text-detroit-gold">story</span> through different lenses, angles, and lighting."
              </blockquote>
              <p className="text-gray-600 mb-6">
                Hannah needed headshots that would stand out to symphony directors and concert promoters. 
                Generic photos wouldn't cut it. She needed images that showed her artistry before she played a single note.
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-gray-900">Hannah Wetherholt</p>
                  <p className="text-gray-500 text-sm">Classical Musician</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET - Clear Value */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-detroit-gold uppercase tracking-[0.2em] text-sm mb-4">What's included</p>
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
              Everything you need. Nothing you don't.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Unlimited session time', desc: 'We don\'t watch the clock. We watch for the perfect shot.' },
              { title: 'Unlimited wardrobe changes', desc: 'Bring everything. We\'ll find what works.' },
              { title: 'Live image review', desc: 'See your photos on a 27" monitor as we shoot.' },
              { title: 'Same-day delivery available', desc: 'Need it fast? We can make it happen.' },
              { title: 'Magazine-quality retouching', desc: 'Subtle. Natural. Still you, just elevated.' },
              { title: 'Multiple backdrop options', desc: 'Studio white or historic mansion character.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
                <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE GUARANTEE - Remove All Risk */}
      <section className="py-16 bg-detroit-green text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl mb-4">
            Our promise: You'll love your photos.
          </h2>
          <p className="text-white/80 text-lg">
            201 five-star reviews didn't happen by accident. We don't stop until you're thrilled. 
            If you're not completely satisfied, we'll reshoot for free.
          </p>
        </div>
      </section>

      {/* FINAL TESTIMONIAL TRIO */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-gray-900">
              Join the executives, attorneys, and physicians who trust us.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Exceeded every expectation. The best investment I've made in my personal brand.",
                name: "Michelle",
                title: "IBM Associate Partner",
                image: "/images/headshots/testimonial-michelle.jpg"
              },
              {
                quote: "Professional, courteous, great vision. Would highly recommend.",
                name: "Jacqueline Williams",
                title: "Evolve Foundation",
                image: "/images/headshots/testimonial-jacqueline.jpg"
              },
              {
                quote: "I would 100% recommend to anyone looking for top-notch work.",
                name: "Hannah Wetherholt",
                title: "Classical Musician",
                image: "/images/headshots/testimonial-hannah.jpg"
              },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={`${item.name} headshot`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-detroit-gold text-detroit-gold" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-3 italic">"{item.quote}"</p>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-gray-500 text-sm">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGENCY + SCARCITY */}
      <section className="py-12 bg-detroit-cream border-y border-detroit-gold/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg text-gray-700">
            <span className="text-detroit-gold font-medium">Limited availability:</span> We take a small number of clients each week 
            to ensure every session gets our full attention.
          </p>
        </div>
      </section>

      {/* THE FORM - Clean, Focused, Emotional */}
      <section id="get-started" className="py-20 md:py-32 bg-detroit-green">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center text-white mb-10">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to see yourself differently?
            </h2>
            <p className="text-detroit-cream/80 text-lg mb-2">
              Get your personalized pricing in 30 seconds.
            </p>
            <p className="text-detroit-gold text-2xl font-display">
              Starting at $149
            </p>
          </div>

          <HubSpotForm emailOnly />

          <div className="text-center mt-8 space-y-2 text-detroit-cream/60 text-sm">
            <p>✓ No spam, ever. Just your pricing options.</p>
            <p>✓ Same-day appointments often available.</p>
            <p>✓ 201 five-star reviews can't be wrong.</p>
          </div>
        </div>
      </section>
    </>
  )
}
