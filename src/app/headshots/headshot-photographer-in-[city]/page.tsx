import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Breadcrumbs } from '@/components/headshots/Breadcrumbs'
import { Star, Check, MapPin, Clock, Phone, ArrowRight, Car } from 'lucide-react'

// City-specific headshot photographer pages for SEO
const cities: Record<string, {
  name: string
  fullName: string
  driveTime: string
  distance: string
  description: string
  neighborhoods?: string[]
}> = {
  'ann-arbor-michigan': {
    name: 'Ann Arbor',
    fullName: 'Ann Arbor, Michigan',
    driveTime: '45 minutes',
    distance: '43 miles',
    description: 'Home to the University of Michigan, Ann Arbor is a vibrant college town with a thriving professional community. From faculty and researchers to downtown business owners, Ann Arbor professionals trust Detroit Photography for headshots that make an impression.',
    neighborhoods: ['Downtown Ann Arbor', 'Kerrytown', 'State Street', 'North Campus', 'South University'],
  },
  'birmingham-michigan': {
    name: 'Birmingham',
    fullName: 'Birmingham, Michigan',
    driveTime: '25 minutes',
    distance: '18 miles',
    description: 'Birmingham\'s upscale downtown and thriving business community demand the best. From attorneys and executives on Woodward to boutique owners on Old Woodward, Birmingham professionals choose Detroit Photography for polished, sophisticated headshots.',
    neighborhoods: ['Downtown Birmingham', 'The Triangle District', 'Quarton Lake', 'Poppleton Park'],
  },
  'dearborn-michigan': {
    name: 'Dearborn',
    fullName: 'Dearborn, Michigan',
    driveTime: '15 minutes',
    distance: '10 miles',
    description: 'As the home of Ford Motor Company and a diverse, entrepreneurial community, Dearborn professionals understand the value of a great first impression. Our studio is just minutes away, making professional headshots convenient and accessible.',
    neighborhoods: ['Downtown Dearborn', 'West Dearborn', 'East Dearborn', 'Fairlane', 'Greenfield Village'],
  },
  'farmington-hills-michigan': {
    name: 'Farmington Hills',
    fullName: 'Farmington Hills, Michigan',
    driveTime: '30 minutes',
    distance: '24 miles',
    description: 'One of Michigan\'s premier business centers, Farmington Hills is home to corporate headquarters, tech companies, and successful entrepreneurs. Our studio offers the quality these professionals expect.',
    neighborhoods: ['Downtown Farmington', 'Northwestern Highway Corridor', '12 Mile Business District'],
  },
  'hamtramck-michigan': {
    name: 'Hamtramck',
    fullName: 'Hamtramck, Michigan',
    driveTime: '10 minutes',
    distance: '5 miles',
    description: 'Just minutes from our studio, Hamtramck\'s diverse and creative community is a perfect fit for our authentic, character-driven headshot style. We celebrate the unique personality of every client.',
    neighborhoods: ['Downtown Hamtramck', 'Joseph Campau', 'Banglatown'],
  },
  'livonia-michigan': {
    name: 'Livonia',
    fullName: 'Livonia, Michigan',
    driveTime: '25 minutes',
    distance: '20 miles',
    description: 'Livonia\'s strong business community, from healthcare professionals to corporate executives, relies on professional imagery. Our convenient location makes it easy to get the headshots you need.',
    neighborhoods: ['Downtown Livonia', 'Schoolcraft College Area', 'Laurel Park'],
  },
  'rochester-hills-michigan': {
    name: 'Rochester Hills',
    fullName: 'Rochester Hills, Michigan',
    driveTime: '35 minutes',
    distance: '28 miles',
    description: 'Rochester Hills\' affluent community and growing business district deserve premium headshot photography. Our historic studio setting provides a unique backdrop that matches the area\'s refined character.',
    neighborhoods: ['Downtown Rochester', 'Oakland University Area', 'The Village'],
  },
  'rochester-michigan': {
    name: 'Rochester',
    fullName: 'Rochester, Michigan',
    driveTime: '35 minutes',
    distance: '28 miles',
    description: 'Historic downtown Rochester\'s charming Main Street is home to boutiques, restaurants, and professional offices. We match that classic aesthetic with timeless headshot photography.',
    neighborhoods: ['Downtown Rochester', 'Paint Creek Trail Area', 'Rochester Municipal Park'],
  },
  'royal-oak-michigan': {
    name: 'Royal Oak',
    fullName: 'Royal Oak, Michigan',
    driveTime: '20 minutes',
    distance: '15 miles',
    description: 'Royal Oak\'s vibrant downtown scene attracts creative professionals, entrepreneurs, and business owners who appreciate quality. Our studio style resonates with Royal Oak\'s hip, professional community.',
    neighborhoods: ['Downtown Royal Oak', 'Woodward Corridor', 'Shrine Area', 'Vinsetta Park'],
  },
  'southfield-michigan': {
    name: 'Southfield',
    fullName: 'Southfield, Michigan',
    driveTime: '20 minutes',
    distance: '16 miles',
    description: 'Southfield\'s major corporate offices and professional services firms require polished, corporate headshots. We deliver the executive-level quality that Southfield businesses expect.',
    neighborhoods: ['Town Center', 'Civic Center', 'Northwestern Highway Corridor', 'Evergreen Road Business District'],
  },
  'sterling-heights-michigan': {
    name: 'Sterling Heights',
    fullName: 'Sterling Heights, Michigan',
    driveTime: '30 minutes',
    distance: '22 miles',
    description: 'Michigan\'s fourth-largest city has a diverse professional community. From manufacturing executives to healthcare professionals, Sterling Heights residents trust Detroit Photography for their headshot needs.',
    neighborhoods: ['Lakeside Mall Area', 'Hall Road Corridor', 'Metro Parkway Business District'],
  },
  'troy-michigan': {
    name: 'Troy',
    fullName: 'Troy, Michigan',
    driveTime: '25 minutes',
    distance: '20 miles',
    description: 'Troy\'s Big Beaver Road is Michigan\'s premier corporate corridor, home to Fortune 500 companies and major professional firms. We serve Troy\'s executive community with sophisticated, boardroom-ready headshots.',
    neighborhoods: ['Big Beaver Corridor', 'Somerset Collection Area', 'Troy Tech Park', 'Columbia Center'],
  },
  'warren-michigan': {
    name: 'Warren',
    fullName: 'Warren, Michigan',
    driveTime: '20 minutes',
    distance: '15 miles',
    description: 'As Michigan\'s third-largest city and home to the General Motors Technical Center, Warren has a strong industrial and professional community. We provide the polished headshots Warren professionals need.',
    neighborhoods: ['Tech Center Area', 'Van Dyke Corridor', 'Warren Civic Center'],
  },
}

export async function generateStaticParams() {
  return Object.keys(cities).map((city) => ({
    city,
  }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = cities[params.city]
  if (!city) return {}

  return {
    title: `Headshot Photographer in ${city.name}, MI | Detroit Photography`,
    description: `Professional headshots for ${city.name} residents. Just ${city.driveTime} from ${city.name}. 5-star rated studio with 200+ reviews. Same-day delivery. Book your session today!`,
    keywords: [
      `headshot photographer ${city.name.toLowerCase()}`,
      `headshots ${city.name.toLowerCase()} michigan`,
      `professional headshots ${city.name.toLowerCase()}`,
      `business headshots ${city.name.toLowerCase()}`,
      `linkedin headshots ${city.name.toLowerCase()}`,
      'detroit headshot photographer',
      'professional headshots near me',
    ],
    openGraph: {
      title: `Headshot Photographer in ${city.name} | Detroit Photography`,
      description: `Professional headshots for ${city.name} professionals. ${city.driveTime} drive to our 5-star studio.`,
      url: `https://www.detroitphotography.com/headshot-photographer-in-${params.city}`,
      images: [
        {
          url: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
          width: 1200,
          height: 630,
          alt: `Headshot Photographer in ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Headshot Photographer in ${city.name} | Detroit Photography`,
      description: `Professional headshots for ${city.name} professionals.`,
      images: ['https://www.detroitphotography.com/images/headshots/hero-headshot.jpg'],
    },
    alternates: {
      canonical: `https://www.detroitphotography.com/headshot-photographer-in-${params.city}`,
    },
  }
}

function generateJsonLd(city: typeof cities[string], slug: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `https://www.detroitphotography.com/headshot-photographer-in-${slug}#business`,
        name: 'Detroit Photography',
        description: `Professional headshot photography serving ${city.name}, Michigan`,
        image: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '2921 E Jefferson Ave, Suite 101',
          addressLocality: 'Detroit',
          addressRegion: 'MI',
          postalCode: '48207',
          addressCountry: 'US',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '203',
          bestRating: '5',
          worstRating: '1',
        },
        priceRange: '$149-$500',
        telephone: '+1-313-351-8244',
        url: `https://www.detroitphotography.com/headshot-photographer-in-${slug}`,
        areaServed: {
          '@type': 'City',
          name: city.name,
          containedInPlace: {
            '@type': 'State',
            name: 'Michigan',
          },
        },
      },
      {
        '@type': 'Service',
        name: `Professional Headshots for ${city.name}`,
        provider: {
          '@id': `https://www.detroitphotography.com/headshot-photographer-in-${slug}#business`,
        },
        areaServed: {
          '@type': 'City',
          name: city.name,
        },
        description: `Professional headshot photography services for ${city.name}, Michigan residents and businesses.`,
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
            name: 'Headshots',
            item: 'https://www.detroitphotography.com/headshot-photography-in-detroit',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${city.name} Headshots`,
            item: `https://www.detroitphotography.com/headshot-photographer-in-${slug}`,
          },
        ],
      },
    ],
  }
}

export default function CityHeadshotPage({ params }: { params: { city: string } }) {
  const city = cities[params.city]
  
  if (!city) {
    notFound()
  }

  const jsonLd = generateJsonLd(city, params.city)

  // Get other cities for internal linking
  const otherCities = Object.entries(cities)
    .filter(([slug]) => slug !== params.city)
    .slice(0, 6)

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
              { label: 'Headshots', href: '/headshots/headshot-photography-in-detroit' },
              { label: `${city.name} Headshots` },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-detroit-gold" />
                  <span className="text-detroit-gold font-medium">
                    Serving {city.fullName}
                  </span>
                </div>
                
                <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-6">
                  Professional Headshot Photographer for{' '}
                  <span className="text-detroit-green">{city.name}</span> Residents
                </h1>

                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {city.description}
                </p>

                {/* Drive Time Badge */}
                <div className="inline-flex items-center gap-3 bg-detroit-cream rounded-lg px-4 py-3 mb-8">
                  <Car className="w-5 h-5 text-detroit-green" />
                  <div>
                    <span className="font-semibold text-detroit-green">{city.driveTime}</span>
                    <span className="text-gray-600"> from {city.name}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-600">{city.distance}</span>
                  </div>
                </div>

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
                    href="/headshots/book"
                    className="inline-block bg-detroit-green text-white px-8 py-4 text-center text-sm uppercase tracking-wider font-bold hover:bg-detroit-gold transition-colors"
                  >
                    Book Your Session
                  </Link>
                  <Link
                    href="/headshots/headshot-photography-in-detroit"
                    className="inline-block border-2 border-detroit-green text-detroit-green px-8 py-4 text-center text-sm uppercase tracking-wider font-bold hover:bg-detroit-green hover:text-white transition-colors"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>

              {/* Form */}
              <div className="bg-gray-50 p-8 rounded-xl">
                <h2 className="font-display text-2xl text-gray-900 mb-2 text-center">
                  Get Our Pricing Guide
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  See packages starting at $149
                </p>
                <HubSpotForm emailOnly />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-3xl text-gray-900 text-center mb-12">
              Why {city.name} Professionals Choose Us
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Historic Studio Setting',
                  description: 'Our studio in the 1889 Bagley Mansion offers a unique, elegant backdrop that elevates your professional image.',
                },
                {
                  title: 'Unlimited Session Time',
                  description: 'No rushing, no clock-watching. We work until you\'re completely satisfied with your headshots.',
                },
                {
                  title: 'Same-Day Turnaround',
                  description: 'Need your headshots fast? We offer same-day delivery for clients who need photos quickly.',
                },
                {
                  title: 'Live Image Review',
                  description: 'See your photos on a large screen during the session. Choose your favorites in real-time.',
                },
                {
                  title: 'Professional Retouching',
                  description: 'Every image is professionally retouched to ensure you look your absolute best.',
                },
                {
                  title: '5-Star Rated',
                  description: 'Over 200 five-star reviews from professionals across Metro Detroit.',
                },
              ].map((benefit, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-detroit-green/10 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-5 h-5 text-detroit-green" />
                  </div>
                  <h3 className="font-display text-xl text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Areas We Serve */}
        {city.neighborhoods && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="font-display text-2xl text-gray-900 text-center mb-8">
                Serving All of {city.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {city.neighborhoods.map((neighborhood) => (
                  <span
                    key={neighborhood}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
                  >
                    {neighborhood}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other Locations */}
        <section className="py-16 bg-detroit-cream">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-2xl text-gray-900 text-center mb-8">
              Also Serving Nearby Communities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {otherCities.map(([slug, c]) => (
                <Link
                  key={slug}
                  href={`/headshots/headshot-photographer-in-${slug}`}
                  className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow group"
                >
                  <span className="text-gray-900 font-medium group-hover:text-detroit-green transition-colors">
                    {c.name}
                  </span>
                  <span className="block text-sm text-gray-500 mt-1">{c.driveTime}</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/headshots/headshot-photography-in-detroit"
                className="inline-flex items-center text-detroit-green font-medium hover:text-detroit-gold transition-colors"
              >
                View all headshot services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-detroit-green text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Ready for Professional Headshots?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join hundreds of {city.name} professionals who trust Detroit Photography
              for their headshot needs. Starting at just $149.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/headshots/book"
                className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-bold hover:bg-detroit-gold hover:text-white transition-colors"
              >
                Book Your Session
              </Link>
              <a
                href="tel:+13133518244"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 text-sm uppercase tracking-wider font-bold hover:bg-white hover:text-detroit-green transition-colors"
              >
                <Phone className="w-4 h-4" />
                (313) 351-8244
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

