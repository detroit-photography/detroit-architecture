import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { HeadshotsGallery } from '@/components/headshots/HeadshotsGallery'
import { TestimonialsSection } from '@/components/headshots/TestimonialsSection'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { MapPin, Clock, Phone, Star } from 'lucide-react'

// Define all location pages
const locations: Record<string, { name: string; city: string; description: string }> = {
  'headshot-photographer-in-dearborn-michigan': {
    name: 'Dearborn',
    city: 'Dearborn, Michigan',
    description: 'Professional headshot photography serving Dearborn, Michigan. Just minutes from our Detroit studio at historic Bagley Mansion.',
  },
  'headshot-photographer-in-royal-oak-michigan': {
    name: 'Royal Oak',
    city: 'Royal Oak, Michigan',
    description: 'Professional headshot photography serving Royal Oak, Michigan. Easy access from our Detroit studio.',
  },
  'headshot-photographer-in-ann-arbor-michigan': {
    name: 'Ann Arbor',
    city: 'Ann Arbor, Michigan',
    description: 'Professional headshot photography serving Ann Arbor, Michigan. University of Michigan faculty, staff, and students welcome.',
  },
  'headshot-photographer-in-livonia-michigan': {
    name: 'Livonia',
    city: 'Livonia, Michigan',
    description: 'Professional headshot photography serving Livonia, Michigan. Corporate and professional headshots.',
  },
  'headshot-photographer-in-warren-michigan': {
    name: 'Warren',
    city: 'Warren, Michigan',
    description: 'Professional headshot photography serving Warren, Michigan.',
  },
  'headshot-photographer-in-southfield-michigan': {
    name: 'Southfield',
    city: 'Southfield, Michigan',
    description: 'Professional headshot photography serving Southfield, Michigan business district.',
  },
  'headshot-photographer-in-farmington-hills-michigan': {
    name: 'Farmington Hills',
    city: 'Farmington Hills, Michigan',
    description: 'Professional headshot photography serving Farmington Hills, Michigan.',
  },
  'headshot-photographer-in-birmingham-michigan': {
    name: 'Birmingham',
    city: 'Birmingham, Michigan',
    description: 'Professional headshot photography serving Birmingham, Michigan.',
  },
  'headshot-photographer-in-troy-michigan': {
    name: 'Troy',
    city: 'Troy, Michigan',
    description: 'Professional headshot photography serving Troy, Michigan business community.',
  },
  'headshot-photographer-in-rochester-michigan': {
    name: 'Rochester',
    city: 'Rochester, Michigan',
    description: 'Professional headshot photography serving Rochester, Michigan.',
  },
  'headshot-photographer-in-rochester-hills-michigan': {
    name: 'Rochester Hills',
    city: 'Rochester Hills, Michigan',
    description: 'Professional headshot photography serving Rochester Hills, Michigan.',
  },
  'headshot-photographer-in-sterling-heights-michigan': {
    name: 'Sterling Heights',
    city: 'Sterling Heights, Michigan',
    description: 'Professional headshot photography serving Sterling Heights, Michigan.',
  },
  'headshot-photographer-in-hamtramck-michigan': {
    name: 'Hamtramck',
    city: 'Hamtramck, Michigan',
    description: 'Professional headshot photography serving Hamtramck, Michigan. Just minutes from our studio.',
  },
}

interface Props {
  params: { location: string }
}

export async function generateStaticParams() {
  return Object.keys(locations).map((location) => ({
    location,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = locations[params.location]
  
  if (!location) {
    return { title: 'Page Not Found' }
  }

  return {
    title: `Headshot Photographer in ${location.name}, Michigan | Detroit Photography`,
    description: `Professional headshots in ${location.city}. By Detroit's #1-rated photographer. Starting at $149. Located at historic Bagley Mansion.`,
    openGraph: {
      title: `Headshot Photographer in ${location.name}, Michigan`,
      description: `Professional headshots serving ${location.city}. Starting at $149.`,
      images: [
        {
          url: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
          width: 1200,
          height: 630,
          alt: `Headshot Photographer in ${location.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Headshot Photographer in ${location.name}, Michigan`,
      description: `Professional headshots serving ${location.city}. Starting at $149.`,
      images: ['https://www.detroitphotography.com/images/headshots/hero-headshot.jpg'],
    },
  }
}

const portfolioImages = [
  { src: '/images/headshots/hero-headshot.jpg', alt: 'Professional headshot' },
  { src: '/images/headshots/headshot-2.jpg', alt: 'Executive portrait' },
  { src: '/images/headshots/headshot-3.jpg', alt: 'Business headshot' },
  { src: '/images/headshots/headshot-4.jpg', alt: 'Corporate headshot' },
]

export default function LocationPage({ params }: Props) {
  const location = locations[params.location]

  if (!location) {
    notFound()
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-detroit-green text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl mb-6">
            Headshot Photographer in<br />
            <span className="text-detroit-gold">{location.city}</span>
          </h1>
          <p className="text-xl text-detroit-cream/80 max-w-2xl mx-auto mb-8">
            {location.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/headshot-photography-in-detroit"
              className="inline-block border-2 border-white text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-detroit-green transition-colors"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 bg-detroit-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-detroit-green rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl mb-2">Conveniently Located</h3>
              <p className="text-gray-600">
                Our studio at Bagley Mansion is an easy drive from {location.name}.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-detroit-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl mb-2">#1 Rated in Detroit</h3>
              <p className="text-gray-600">
                181+ five-star Google reviews. More than any other photographer.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-detroit-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl mb-2">Unlimited Session Time</h3>
              <p className="text-gray-600">
                No time pressure. Take as long as you need to get the perfect shot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Our Work
          </h2>
          <HeadshotsGallery images={portfolioImages} columns={4} />
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing CTA */}
      <section className="py-16 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h2 className="font-display text-3xl mb-4">
              Ready to book your session?
            </h2>
            <p className="text-detroit-cream/80">
              Professional headshots starting at <span className="text-detroit-gold font-bold text-2xl">$149</span>
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>

      {/* Location Details */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl text-gray-900 mb-6">
            Visit Our Studio
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            We're located at the historic Bagley Mansion in Detroit's Jefferson-Chalmers neighborhood.
            Easy parking and accessible from {location.name}.
          </p>
          <div className="bg-detroit-cream p-8 inline-block">
            <p className="font-medium text-gray-900">Detroit Photography</p>
            <p className="text-gray-600">Bagley Mansion</p>
            <p className="text-gray-600">2921 E Jefferson Ave, Suite 101</p>
            <p className="text-gray-600">Detroit, MI 48207</p>
            <p className="mt-4">
              <a href="tel:13133518244" className="text-detroit-green hover:text-detroit-gold flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                (313) 351-8244
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

