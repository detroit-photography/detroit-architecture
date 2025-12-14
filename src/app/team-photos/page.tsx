import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeadshotsGallery } from '@/components/headshots/HeadshotsGallery'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Team Photos & Group Headshots in Detroit',
  description: 'Professional team photos and group headshots for businesses in Detroit. On-site or in-studio. Consistent, polished results for your entire team.',
}

const teamImages = [
  { src: '/images/headshots/team-photo.jpg', alt: 'Team photo at Detroit Photography' },
  { src: '/images/headshots/headshot-3.jpg', alt: 'Executive team headshot' },
  { src: '/images/headshots/headshot-4.jpg', alt: 'Corporate team member' },
  { src: '/images/headshots/headshot-5.jpg', alt: 'Professional team portrait' },
]

export default function TeamPhotosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            <div className="flex flex-col justify-center px-6 py-12 lg:py-24 lg:px-12">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
                Team Photos & Group Headshots
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Consistent, professional headshots for your entire team. On-site at your office or at our historic studio.
              </p>
              <div>
                <Link
                  href="/book"
                  className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px]">
              <Image
                src="/images/team-photo.jpg"
                alt="Team photo session at Detroit Photography"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-detroit-cream">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Why Choose Us for Team Photography
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Consistent Quality</h3>
              <p className="text-gray-600">
                Every team member gets the same professional treatment. Consistent lighting, 
                backgrounds, and editing ensure your website and marketing materials look cohesive.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Flexible Scheduling</h3>
              <p className="text-gray-600">
                We come to your office or you come to our studio. We work around your team's 
                schedule with minimal disruption to your workday.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Fast Turnaround</h3>
              <p className="text-gray-600">
                Receive professionally edited photos within 48 hours. 
                Digital files delivered to each team member's personal gallery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Team Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-2 border-detroit-green p-8">
              <h3 className="font-display text-2xl text-gray-900 mb-2">Small Team</h3>
              <p className="text-gray-500 mb-4">2-10 people</p>
              <p className="text-4xl font-bold text-detroit-green mb-6">$99<span className="text-lg text-gray-500">/person</span></p>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>One retouched headshot per person</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>Consistent backgrounds & lighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>Individual digital galleries</span>
                </li>
              </ul>
              <Link
                href="/book"
                className="block text-center bg-detroit-green text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
              >
                Book Now
              </Link>
            </div>
            <div className="border-2 border-detroit-gold bg-detroit-cream p-8">
              <h3 className="font-display text-2xl text-gray-900 mb-2">Large Team</h3>
              <p className="text-gray-500 mb-4">10+ people</p>
              <p className="text-4xl font-bold text-detroit-green mb-6">Custom Quote</p>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>Volume discounts available</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>On-site photography available</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>Group photos included</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="block text-center bg-detroit-gold text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-detroit-green transition-colors"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24 bg-detroit-cream">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Team Photography Portfolio
          </h2>
          <HeadshotsGallery images={teamImages} columns={4} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
            Ready to elevate your team's image?
          </h2>
          <p className="text-detroit-cream/80 text-lg mb-8">
            Contact us today for a custom quote for your team photography needs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
