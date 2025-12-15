import type { Metadata } from 'next'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Breadcrumbs } from '@/components/headshots/Breadcrumbs'
import { Camera, Building, MapPin, Star, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Detroit Architecture Photographer | Professional Architectural Photography',
  description: 'Professional architecture photographer in Detroit specializing in historic buildings, commercial real estate, and architectural documentation. Drone and interior photography available.',
  keywords: [
    'detroit architecture photographer',
    'architectural photography detroit',
    'real estate photography detroit',
    'commercial photography detroit',
    'building photography',
    'interior photography detroit',
    'drone photography detroit',
  ],
  openGraph: {
    title: 'Detroit Architecture Photographer | Detroit Photography',
    description: 'Professional architectural photography in Detroit. Historic buildings, commercial spaces, and real estate.',
    url: 'https://www.detroitphotography.com/detroit-architecture-photographer',
    images: [
      {
        url: 'https://qjxuiljsgrmymeayoqzi.supabase.co/storage/v1/object/public/photos/buildings/guardian-building.jpg',
        width: 1200,
        height: 630,
        alt: 'Detroit Architecture Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detroit Architecture Photographer | Detroit Photography',
    description: 'Professional architectural photography in Detroit.',
    images: ['https://qjxuiljsgrmymeayoqzi.supabase.co/storage/v1/object/public/photos/buildings/guardian-building.jpg'],
  },
  alternates: {
    canonical: 'https://www.detroitphotography.com/detroit-architecture-photographer',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Architectural Photography',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Detroit Photography',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Detroit',
          addressRegion: 'MI',
        },
      },
      areaServed: {
        '@type': 'City',
        name: 'Detroit',
      },
      description: 'Professional architectural photography services in Detroit, Michigan.',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.detroitphotography.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Architecture Photography',
          item: 'https://www.detroitphotography.com/detroit-architecture-photographer',
        },
      ],
    },
  ],
}

export default function ArchitecturePhotographerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <Breadcrumbs
            items={[
              { label: 'Architecture Photography' },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-detroit-gold" />
                  <span className="text-detroit-gold font-medium uppercase tracking-wider text-sm">
                    Architectural Photography
                  </span>
                </div>
                
                <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-6">
                  Detroit Architecture Photographer
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  From iconic Art Deco skyscrapers to historic mansions, Detroit's architectural heritage 
                  deserves to be documented with care and expertise. As the photographer behind the 
                  Detroit Architecture Repository, I specialize in capturing the beauty and history of 
                  our region's built environment.
                </p>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-detroit-gold fill-detroit-gold" />
                    ))}
                  </div>
                  <span className="text-gray-700">
                    <span className="font-semibold">5.0</span> from 200+ reviews
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    className="inline-block bg-detroit-green text-white px-8 py-4 text-center text-sm uppercase tracking-wider font-bold hover:bg-detroit-gold transition-colors"
                  >
                    Request a Quote
                  </Link>
                  <Link
                    href="/"
                    className="inline-block border-2 border-detroit-green text-detroit-green px-8 py-4 text-center text-sm uppercase tracking-wider font-bold hover:bg-detroit-green hover:text-white transition-colors"
                  >
                    View Architecture Portfolio
                  </Link>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative">
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/headshots/bagley-mansion.jpg"
                    alt="Architectural photography of historic Detroit building"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl">
                  <div className="flex items-center gap-2 text-detroit-green">
                    <Camera className="w-5 h-5" />
                    <span className="font-medium">300+ Buildings Documented</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-3xl text-gray-900 text-center mb-12">
              Architectural Photography Services
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Historic Buildings',
                  description: 'Documentation of Detroit\'s historic architecture, including mansions, churches, theaters, and landmark structures.',
                  icon: Building,
                },
                {
                  title: 'Commercial Real Estate',
                  description: 'Professional photography for commercial listings, office buildings, retail spaces, and mixed-use developments.',
                  icon: MapPin,
                },
                {
                  title: 'Interior Photography',
                  description: 'High-quality interior shots showcasing design details, natural light, and spatial relationships.',
                  icon: Camera,
                },
                {
                  title: 'Drone Aerial Views',
                  description: 'FAA Part 107 certified drone photography for aerial perspectives, rooftop details, and site context.',
                  icon: Camera,
                },
                {
                  title: 'Twilight Shots',
                  description: 'Dramatic dusk photography capturing buildings with interior lights glowing against the evening sky.',
                  icon: Camera,
                },
                {
                  title: 'Construction Progress',
                  description: 'Ongoing documentation of construction projects from groundbreaking to completion.',
                  icon: Building,
                },
              ].map((service, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-detroit-green/10 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-detroit-green" />
                  </div>
                  <h3 className="font-display text-xl text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Link */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl text-gray-900 mb-6">
              The Detroit Architecture Repository
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore my ongoing documentation project featuring hundreds of Detroit's most 
              significant buildings, from the Guardian Building to Belle Isle's historic structures.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-bold hover:bg-detroit-gold transition-colors"
            >
              Explore the Repository
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-detroit-cream">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
              <h2 className="font-display text-2xl text-gray-900 mb-2 text-center">
                Get a Custom Quote
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Every architectural photography project is unique. Contact us to discuss your needs.
              </p>
              <HubSpotForm />
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-2xl text-gray-900 text-center mb-8">
              Related Photography Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Real Estate Photography', href: '/real-estate-portfolio', desc: 'Professional photos for property listings' },
                { title: 'Drone Photography', href: '/drone-photography', desc: 'Aerial views and elevated perspectives' },
                { title: 'Commercial Photography', href: '/branding-photography', desc: 'Marketing and branding imagery' },
              ].map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="block p-6 bg-gray-50 rounded-xl hover:bg-detroit-cream transition-colors group"
                >
                  <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

