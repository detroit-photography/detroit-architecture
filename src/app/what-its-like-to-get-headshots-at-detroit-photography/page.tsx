import type { Metadata } from 'next'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Star, Check, Clock, Camera, Smile, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'What It\'s Like to Get Headshots at Detroit Photography',
  description: 'A complete guide to your headshot session experience at Detroit Photography. What to expect, how to prepare, and why clients love working with us.',
}

export default function WhatItsLikePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-detroit-green text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-detroit-gold/20 border border-detroit-gold px-4 py-2 mb-6">
            <Star className="w-4 h-4 fill-detroit-gold text-detroit-gold" />
            <span className="text-detroit-gold text-sm font-medium">201+ Five-Star Reviews</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            What It's Like to Get Headshots at Detroit Photography
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            A step-by-step guide to your headshot experience—from booking to final delivery.
          </p>
          
          <Link
            href="/book"
            className="inline-block bg-white text-detroit-green px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
          >
            Book Your Session
          </Link>
        </div>
      </section>

      {/* The Experience */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Your Session Experience
          </h2>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-detroit-green rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display text-2xl">1</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-gray-900 mb-2">Book Your Session</h3>
                <p className="text-gray-600">
                  Choose a time that works for you using our online booking system. Same-day appointments 
                  are often available. You'll receive a confirmation email with everything you need to prepare.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-detroit-green rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display text-2xl">2</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-gray-900 mb-2">Arrive at Historic Bagley Mansion</h3>
                <p className="text-gray-600">
                  Our studio is located in a beautiful 1889 mansion in Detroit. Free parking is available 
                  right outside. You'll be greeted warmly and offered water, coffee, or tea.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-detroit-green rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display text-2xl">3</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-gray-900 mb-2">Relax and Shoot</h3>
                <p className="text-gray-600">
                  We'll discuss your goals for the session and get started. There's no time pressure—take 
                  as long as you need. Change outfits as many times as you'd like. We'll guide you through 
                  poses and expressions to get natural, authentic photos.
                </p>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-detroit-green rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display text-2xl">4</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-gray-900 mb-2">Review Your Photos</h3>
                <p className="text-gray-600">
                  During the session, you'll see your photos on a large monitor in real-time. This lets 
                  you make adjustments and ensures you're getting exactly what you want.
                </p>
              </div>
            </div>
            
            {/* Step 5 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-detroit-green rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display text-2xl">5</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-gray-900 mb-2">Receive Your Final Images</h3>
                <p className="text-gray-600">
                  Your professionally retouched photos will be delivered to your inbox within 24-48 hours 
                  (often same-day). High-resolution files are included for both print and web use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-detroit-cream">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            What's Included
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Clock, text: 'Unlimited session time' },
              { icon: Camera, text: 'Unlimited wardrobe changes' },
              { icon: Smile, text: 'Expert posing guidance' },
              { icon: Download, text: 'High-resolution digital files' },
              { icon: Star, text: 'Professional retouching' },
              { icon: Check, text: 'Multiple background options' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-6">
                <item.icon className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            What Clients Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="bg-detroit-cream p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-detroit-gold text-detroit-gold" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "Andrew made me feel so comfortable. I usually hate having my photo taken, 
                but this was genuinely enjoyable. And the photos turned out amazing!"
              </p>
              <cite className="text-gray-900 font-medium not-italic">— Sarah M.</cite>
            </blockquote>
            <blockquote className="bg-detroit-cream p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-detroit-gold text-detroit-gold" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "The historic mansion setting is gorgeous. My headshots look so professional, 
                and I had them back the same day. Highly recommend!"
              </p>
              <cite className="text-gray-900 font-medium not-italic">— James T.</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to Experience It Yourself?
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





