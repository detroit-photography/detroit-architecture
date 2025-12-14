import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, MapPin, Camera, Sparkles, ChevronRight } from 'lucide-react'

// SEO Metadata - targeting "detroit photographer" and "detroit photo studio"
export const metadata: Metadata = {
  title: 'Detroit Photographer | Professional Photo Studio | Detroit Photography',
  description: 'Detroit\'s #1-rated professional photographer and photo studio. Specializing in headshots, portraits, and commercial photography. Located at historic Bagley Mansion. 181+ 5-star reviews. Book today!',
  keywords: [
    'detroit photographer',
    'detroit photo studio',
    'professional photographer detroit',
    'photography studio detroit',
    'headshot photographer detroit',
    'portrait photographer detroit',
    'commercial photographer detroit',
    'detroit photography studio',
    'best photographer in detroit',
    'photo studio near me detroit',
  ],
  openGraph: {
    title: 'Detroit Photographer | Professional Photo Studio',
    description: 'Detroit\'s #1-rated professional photographer. Headshots, portraits, and commercial photography at historic Bagley Mansion.',
    url: 'https://www.detroitphotography.com',
    images: ['/images/headshots/hero-headshot.jpg'],
  },
  alternates: {
    canonical: 'https://www.detroitphotography.com',
  },
}

// Comprehensive Schema.org structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.detroitphotography.com/#business',
      name: 'Detroit Photography',
      description: 'Professional photographer and photo studio in Detroit, Michigan. Specializing in headshots, portraits, branding photography, and commercial photography.',
      url: 'https://www.detroitphotography.com',
      telephone: '+1-313-351-8244',
      email: 'andrew@detroitphotography.com',
      image: 'https://www.detroitphotography.com/images/hero-headshot.jpg',
      logo: 'https://www.detroitphotography.com/images/logo.svg',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2921 E Jefferson Ave, Suite 101',
        addressLocality: 'Detroit',
        addressRegion: 'MI',
        postalCode: '48207',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 42.3436,
        longitude: -83.0176,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '181',
        bestRating: '5',
        worstRating: '1',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '21:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday'],
          opens: '10:00',
          closes: '18:00',
        },
      ],
      sameAs: [
        'https://www.instagram.com/detroitphoto',
        'https://www.facebook.com/detroitphotography',
        'https://g.page/detroitphotography',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Photography Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Professional Headshots',
              description: 'Professional headshot photography for business, LinkedIn, and corporate use',
            },
            price: '149',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Portrait Photography',
              description: 'Professional portrait photography for individuals and families',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Branding Photography',
              description: 'Commercial branding and marketing photography for businesses',
            },
          },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.detroitphotography.com/#website',
      url: 'https://www.detroitphotography.com',
      name: 'Detroit Photography',
      description: 'Professional photographer and photo studio in Detroit',
      publisher: {
        '@id': 'https://www.detroitphotography.com/#business',
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://www.detroitphotography.com/#photographer',
      name: 'Andrew Petrov',
      jobTitle: 'Professional Photographer',
      worksFor: {
        '@id': 'https://www.detroitphotography.com/#business',
      },
      image: 'https://www.detroitphotography.com/images/andrew-petrov.jpg',
    },
  ],
}

// Lazy load heavy components
const HeadshotsGallery = dynamic(
  () => import('@/components/headshots/HeadshotsGallery').then(mod => ({ default: mod.HeadshotsGallery })),
  { ssr: true, loading: () => <div className="h-96 bg-gray-100 animate-pulse" /> }
)
const HubSpotForm = dynamic(
  () => import('@/components/headshots/HubSpotForm').then(mod => ({ default: mod.HubSpotForm })),
  { ssr: false, loading: () => <div className="h-64 bg-detroit-cream animate-pulse" /> }
)

// Portfolio images - the work speaks first
const portfolioImages = [
  { src: '/images/headshots/hero-headshot.jpg', alt: 'Professional woman headshot' },
  { src: '/images/headshots/headshot-2.jpg', alt: 'Professional headshot' },
  { src: '/images/headshots/headshot-3.jpg', alt: 'Executive portrait' },
  { src: '/images/headshots/headshot-4.jpg', alt: 'Business headshot' },
  { src: '/images/headshots/headshot-5.jpg', alt: 'Corporate headshot' },
  { src: '/images/headshots/headshot-6.jpg', alt: 'Professional portrait' },
  { src: '/images/headshots/headshot-7.jpg', alt: 'Executive headshot' },
  { src: '/images/headshots/headshot-8.jpg', alt: 'Business portrait' },
]

const studioImages = [
  { src: '/images/headshots/bagley-mansion.jpg', alt: 'Bagley Mansion exterior' },
  { src: '/images/headshots/bagley-drone.jpg', alt: 'Bagley Mansion aerial view' },
  { src: '/images/headshots/bagley-interior-1.jpg', alt: 'Studio fireplace' },
  { src: '/images/headshots/bagley-interior-2.jpg', alt: 'Studio details' },
  { src: '/images/headshots/bagley-interior-3.jpg', alt: 'Bay window' },
  { src: '/images/headshots/bagley-interior-4.jpg', alt: 'Staircase' },
  { src: '/images/headshots/bagley-interior-5.jpg', alt: 'Interior details' },
  { src: '/images/headshots/bagley-interior-6.jpg', alt: 'Historic features' },
]

// Testimonials with paired images
const testimonials = [
  {
    name: 'Sarah Mitchell',
    title: 'Marketing Director',
    quote: 'I saw Andrew\'s work online and knew immediately this was different. The quality is unmistakable. Worth every penny.',
    image: '/images/headshots/testimonial-hannah.jpg',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    title: 'Attorney at Law',
    quote: 'I\'ve had headshots taken before, but never like this. Andrew captures something that other photographers miss.',
    image: '/images/headshots/testimonial-michelle.jpg',
    rating: 5,
  },
  {
    name: 'Dr. Patricia Williams',
    title: 'Cardiologist',
    quote: 'My patients see my headshot before they meet me. It needed to be perfect. Andrew delivered beyond expectations.',
    image: '/images/headshots/testimonial-jacqueline.jpg',
    rating: 5,
  },
]

export default function HeadshotsHomePage() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero - Quality First, Let the Work Speak */}
      <section className="bg-detroit-green text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 min-h-[80vh]">
            {/* Left: Message */}
            <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 lg:py-24">
              <div className="max-w-xl">
                <p className="text-detroit-gold uppercase tracking-[0.3em] text-sm mb-6">
                  Detroit's Premier Photo Studio
                </p>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
                  Professional Photographer<br />
                  <span className="text-detroit-gold italic">in Detroit</span>
                </h1>
                <p className="text-xl text-detroit-cream/90 leading-relaxed mb-10">
                  Detroit Photography is Metro Detroit's #1-rated photo studio specializing in 
                  professional headshots, portraits, and commercial photography. Located at historic Bagley Mansion.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#portfolio"
                    className="inline-block bg-white text-detroit-green px-10 py-4 text-center text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
                  >
                    View the Work
                  </Link>
                  <Link
                    href="/book"
                    className="inline-block border-2 border-detroit-gold text-detroit-gold px-10 py-4 text-center text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-detroit-green transition-colors"
                  >
                    Book a Session
                  </Link>
                </div>
              </div>
            </div>
            {/* Right: Hero Image - optimized */}
            <div className="relative h-[50vh] lg:h-auto">
              <Image
                src="/images/headshots/hero-headshot.jpg"
                alt="Professional headshot by Detroit Photography"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-detroit-green/30 to-transparent lg:bg-gradient-to-l" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Subtle, Not Shouty */}
      <section className="bg-detroit-cream py-6 border-b border-detroit-gold/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-detroit-gold text-detroit-gold" />
                ))}
              </div>
              <span>181+ Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-detroit-gold" />
              <span>Historic Bagley Mansion</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-detroit-gold" />
              <span>Same-Day Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio - Let the Work Speak */}
      <section id="portfolio" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
              Professional Headshot Photography
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our Detroit photo studio creates professional headshots for executives, attorneys, 
              doctors, and business professionals across Metro Detroit.
            </p>
          </div>
          <HeadshotsGallery images={portfolioImages} columns={4} />
          
          {/* Internal Links for SEO */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/headshot-photography-in-detroit" className="text-detroit-green hover:text-detroit-gold transition-colors underline">
              Headshot Photography Pricing
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/headshot-types/business-headshots-detroit" className="text-detroit-green hover:text-detroit-gold transition-colors underline">
              Business Headshots
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/headshot-types/executive-headshots-detroit" className="text-detroit-green hover:text-detroit-gold transition-colors underline">
              Executive Portraits
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/headshot-types/lawyer-headshots-detroit" className="text-detroit-green hover:text-detroit-gold transition-colors underline">
              Attorney Headshots
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Appeal to Higher Ideals */}
      <section className="py-16 md:py-24 bg-detroit-green text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-10 h-10 text-detroit-gold mx-auto mb-8" />
          <h2 className="font-display text-3xl md:text-4xl mb-8">
            Why settle for ordinary?
          </h2>
          <p className="text-xl text-detroit-cream/90 leading-relaxed mb-8">
            Your headshot is often the first impression you make. It appears on LinkedIn, 
            your company website, conference programs, and everywhere you're represented professionally. 
            It should be <em className="text-detroit-gold">exceptional</em>.
          </p>
          <p className="text-lg text-detroit-cream/80 leading-relaxed">
            We don't rush. We don't cut corners. We work until we capture something 
            that makes you stop and think: <em>"That's exactly who I want to be."</em>
          </p>
        </div>
      </section>

      {/* Testimonials with Paired Images */}
      <section className="py-16 md:py-24 bg-detroit-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white shadow-lg overflow-hidden">
                <div className="aspect-[4/5] relative">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} - ${testimonial.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-detroit-gold text-detroit-gold" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Studio - Historic Setting */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-6">
                A Setting That Matches<br />
                <span className="text-detroit-gold">the Quality</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our studio is located in the <strong>historic Bagley Mansion</strong>, 
                a French Renaissance Revival residence built in 1889. The architecture, 
                the light, the atmosphere—it all contributes to creating something special.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                This isn't a sterile studio with white walls. It's a place with character, 
                history, and natural light that makes all the difference.
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Address:</strong> 2921 E Jefferson Ave, Suite 101, Detroit, MI 48207</p>
                <p><strong>Phone:</strong> <a href="tel:13133518244" className="text-detroit-green hover:text-detroit-gold">(313) 351-8244</a></p>
              </div>
            </div>
            <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden">
              {/* Map loads lazily with native loading attribute */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2950.8!2d-83.0176!3d42.3436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDIwJzM3LjAiTiA4M8KwMDEnMDMuNCJX!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Detroit Photography location"
              />
            </div>
          </div>
          <HeadshotsGallery images={studioImages} columns={4} />
        </div>
      </section>

      {/* Value Proposition - Quality AND Convenience */}
      <section className="py-16 md:py-24 bg-detroit-cream">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
              Excellence, Made Easy
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Great work doesn't have to be complicated. We've designed every part 
              of the experience to be as seamless as the results.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-detroit-gold" />
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Unlimited Time</h3>
              <p className="text-gray-600 text-sm">
                No rushing. We work until we get it right, no matter how long it takes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-detroit-gold" />
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Same-Day Delivery</h3>
              <p className="text-gray-600 text-sm">
                Need your photos fast? Same-day turnaround available for those who need it.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-detroit-gold" />
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600 text-sm">
                181+ five-star reviews. We don't stop until you love your photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Anchor - Starting Point */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
            Investment
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional headshots starting at <span className="text-detroit-gold font-display text-4xl">$149</span>
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Includes session, professional retouching, and high-resolution digital files.
          </p>
          <Link
            href="/headshot-photography-in-detroit"
            className="inline-block bg-detroit-green text-white px-12 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
          >
            See All Pricing Options
          </Link>
        </div>
      </section>

      {/* Final CTA with Form */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to Create Something Great?
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Get in touch. We'll send you our full pricing menu and answer any questions.
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>
    </>
  )
}
