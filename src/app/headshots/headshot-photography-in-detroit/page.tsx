import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Star, Clock, Camera, Sparkles } from 'lucide-react'

// Lazy load components not needed for initial render
const HeadshotsGallery = dynamic(
  () => import('@/components/headshots/HeadshotsGallery').then(mod => ({ default: mod.HeadshotsGallery })),
  { ssr: true, loading: () => <div className="h-96 bg-gray-100 animate-pulse" /> }
)
const LocationSection = dynamic(
  () => import('@/components/headshots/LocationSection').then(mod => ({ default: mod.LocationSection })),
  { ssr: true }
)
const HubSpotForm = dynamic(
  () => import('@/components/headshots/HubSpotForm').then(mod => ({ default: mod.HubSpotForm })),
  { ssr: false, loading: () => <div className="h-64 bg-detroit-cream animate-pulse" /> }
)
const ScrollableCards = dynamic(
  () => import('@/components/headshots/ScrollableCards').then(mod => ({ default: mod.ScrollableCards })),
  { ssr: true }
)
const DynamicReviewCount = dynamic(
  () => import('@/components/headshots/DynamicReviewCount').then(mod => ({ default: mod.DynamicReviewCount })),
  { ssr: false, loading: () => <p className="text-center text-gray-500 mb-12">203 five-star Google reviews</p> }
)

export const metadata: Metadata = {
  title: 'Professional Headshots in Detroit | #1 Rated Studio | Starting $149',
  description: 'Professional headshots near you in Detroit. 5-star rated studio with 203+ reviews. Same-day turnaround, live image review. Trusted by Detroit\'s top business leaders, doctors & attorneys. Book today!',
  keywords: [
    'professional headshots',
    'professional headshots near me',
    'headshots near me',
    'headshots detroit',
    'detroit headshots',
    'headshot photography in detroit',
    'business headshots detroit',
    'corporate headshots detroit',
    'headshot photography near me',
    'executive portraits detroit',
    'linkedin headshots detroit',
    'detroit photographer',
    'detroit photo studio',
  ],
  openGraph: {
    title: 'Professional Headshots in Detroit | #1 Rated Studio',
    description: '5-star rated headshot studio in Detroit. Same-day turnaround & live image review. Starting at $149.',
    url: 'https://www.detroitphotography.com/headshot-photography-in-detroit',
    images: [
      {
        url: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional Headshots in Detroit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Headshots in Detroit | #1 Rated Studio',
    description: '5-star rated headshot studio in Detroit. Same-day turnaround & live image review.',
    images: ['https://www.detroitphotography.com/images/headshots/hero-headshot.jpg'],
  },
  alternates: {
    canonical: 'https://www.detroitphotography.com/headshot-photography-in-detroit',
  },
}

// Comprehensive Schema.org structured data for rich snippets
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.detroitphotography.com/headshot-photography-in-detroit#business',
      name: 'Detroit Photography - Professional Headshots',
      description: 'Professional headshot photography studio in Detroit, Michigan. Specializing in business headshots, corporate portraits, and LinkedIn photos.',
      image: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
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
        reviewCount: '203',
        bestRating: '5',
        worstRating: '1',
      },
      priceRange: '$149-$500',
      telephone: '+1-313-351-8244',
      url: 'https://www.detroitphotography.com/headshot-photography-in-detroit',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://www.detroitphotography.com/headshot-photography-in-detroit#service',
      name: 'Professional Headshot Photography',
      description: 'Professional headshot photography for business, LinkedIn, corporate, and executive portraits in Detroit.',
      provider: {
        '@id': 'https://www.detroitphotography.com/headshot-photography-in-detroit#business',
      },
      areaServed: {
        '@type': 'City',
        name: 'Detroit',
        containedInPlace: {
          '@type': 'State',
          name: 'Michigan',
        },
      },
      offers: {
        '@type': 'Offer',
        price: '149',
        priceCurrency: 'USD',
        priceValidUntil: '2025-12-31',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.detroitphotography.com/headshot-photography-in-detroit#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much do professional headshots cost in Detroit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Professional headshots at Detroit Photography start at $149. This includes the session, professional retouching, and high-resolution digital files. We offer unlimited session time and wardrobe changes at no extra charge.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a headshot session take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We offer unlimited session time, so there\'s no rushing. Most sessions take 30-60 minutes, but we work until you\'re completely satisfied with your photos.',
          },
        },
        {
          '@type': 'Question',
          name: 'How quickly can I get my headshot photos?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Same-day turnaround is available for clients who need their photos fast. Standard delivery is within 24-48 hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I wear for a professional headshot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We recommend solid colors like navy, charcoal, or jewel tones. Avoid busy patterns. Bring multiple outfit options—we include unlimited wardrobe changes in every session.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where is your Detroit photo studio located?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our studio is located in the historic Bagley Mansion at 2921 E Jefferson Ave, Suite 101, Detroit, MI 48207. The mansion is a French Renaissance Revival residence built in 1889, providing a unique and elegant backdrop for professional photography.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you offer corporate team headshots?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! We offer volume discounts for corporate team headshots. We can photograph your team at our studio or on-location at your office. Contact us for group pricing.',
          },
        },
      ],
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
          name: 'Professional Headshots in Detroit',
          item: 'https://www.detroitphotography.com/headshot-photography-in-detroit',
        },
      ],
    },
  ],
}

const portfolioImages = [
  { src: '/images/headshots/michelle-front.jpg', alt: 'Professional headshots near me - executive portrait' },
  { src: '/images/headshots/headshot-2.jpg', alt: 'Professional headshots Detroit - business portrait' },
  { src: '/images/headshots/headshot-3.jpg', alt: 'Executive headshots Detroit' },
  { src: '/images/headshots/headshot-4.jpg', alt: 'Corporate headshots near me' },
  { src: '/images/headshots/headshot-5.jpg', alt: 'Business headshots Detroit' },
  { src: '/images/headshots/headshot-6.jpg', alt: 'LinkedIn headshots Detroit' },
  { src: '/images/headshots/headshot-7.jpg', alt: 'Professional portraits near me' },
  { src: '/images/headshots/headshot-8.jpg', alt: 'Headshot photography Detroit' },
]

const testimonials = [
  {
    image: '/images/headshots/testimonial-jacqueline.jpg',
    alt: 'Jacqueline Williams professional headshot',
    quote: 'Absolutely phenomenal experience and the photos were fantastic. Professional, courteous, great vision. Would highly recommend.',
    headline: '"Phenomenal"',
    name: 'Jacqueline Williams',
    title: 'Evolve Foundation',
  },
  {
    image: '/images/headshots/testimonial-michelle.jpg',
    alt: 'Michelle professional headshot',
    quote: 'I had a great experience with Andrew. As soon as I booked the appointment, he called me to align on my needs and expectations. During the photo shoot, he made me feel at ease and he took a lot of really good shots.',
    headline: '"Exceeded every expectation"',
    name: 'Michelle',
    title: 'IBM Associate Partner',
  },
  {
    image: '/images/headshots/testimonial-hannah.jpg',
    alt: 'Hannah Wetherholt classical musician headshot',
    quote: 'Andrew is an absolutely fantastic photographer. He is able to capture a variety of photos that tell a true story through different lenses, angles, and lighting. I would 100% recommend to anyone.',
    headline: '"Top-notch work"',
    name: 'Hannah Wetherholt',
    title: 'Classical musician',
  },
]

const features = [
  { title: 'Live image review', desc: 'See photos on a large monitor during your session' },
  { title: 'Magazine-quality retouching', desc: 'Expert visual artists perfect every image' },
  { title: 'Same-day turnaround available', desc: 'Rush delivery when you need it fast' },
  { title: 'Unlimited session time', desc: 'No clock watching—take your time' },
  { title: 'Unlimited wardrobe changes', desc: 'Bring multiple outfits at no extra charge' },
  { title: 'Multiple backdrop options', desc: 'Choose from studio or historic mansion settings' },
  { title: 'Professional lighting', desc: 'Studio-quality results every time' },
  { title: 'Posing guidance', desc: 'Expert coaching to look your best' },
]

export default function HeadshotPhotographyPage() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section - Optimized for Google Ads Conversion */}
      <section className="bg-detroit-green text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Hero image - mobile first (above text on mobile) */}
            <div className="relative md:hidden">
              <div className="aspect-[16/9] relative overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src="/images/headshots/hero-headshot.jpg"
                  alt="Professional headshots near me in Detroit"
                  fill
                  priority
                  className="object-cover" style={{ objectPosition: 'center 55%' }}
                  sizes="100vw"
                />
              </div>
            </div>
            
            <div className="mt-6 md:mt-0">
              {/* H1 - Message match for top search terms */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4">
                Professional Headshots<br />by the <span className="text-detroit-gold">#1-Rated Studio</span> in Detroit
              </h1>
              <p className="text-2xl md:text-3xl text-detroit-gold font-display mb-4">Starting at $149</p>
              
              {/* Value props - bullet style for scanability */}
              <ul className="text-lg text-detroit-cream/90 mb-6 space-y-2">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0" />
                  <span>Unlimited time & wardrobe changes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0" />
                  <span>Same-day appointments available</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0" />
                  <span>See your photos during the session</span>
                </li>
              </ul>
              
              {/* Trust signal - stars + reviews inline */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-detroit-gold text-detroit-gold" />
                  ))}
                </div>
                <span className="text-white font-medium">203 reviews</span>
                <span className="text-detroit-cream/60">•</span>
                <span className="text-detroit-cream/80">Detroit, MI</span>
              </div>
              
              {/* Single Primary CTA */}
              <Link
                href="#pricing"
                className="inline-block bg-white text-detroit-green px-10 py-4 text-center text-lg uppercase tracking-wider font-bold hover:bg-detroit-gold hover:text-white transition-colors shadow-lg"
              >
                Get Pricing
              </Link>
              
              {/* Urgency line */}
              <p className="mt-4 text-detroit-cream/70 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                Same-day bookings available
              </p>
            </div>
            
            {/* Hero image - desktop only (1:1 aspect ratio) */}
            <div className="relative hidden md:block">
              <div className="aspect-square relative overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src="/images/headshots/hero-headshot.jpg"
                  alt="Professional headshots near me in Detroit"
                  fill
                  priority
                  className="object-cover" style={{ objectPosition: 'center 55%' }}
                  sizes="50vw"
                />
              </div>
              {/* Social proof badge - desktop */}
              <div className="absolute -bottom-3 right-4 w-auto">
                <div className="bg-white text-detroit-green px-4 py-3 rounded shadow-lg flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-detroit-gold/20 flex items-center justify-center text-xs font-bold text-detroit-green">5★</div>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold">203 five-star reviews</span>
                    <span className="text-gray-500 block text-xs">on Google</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar - Real numbers */}
      <section className="py-6 bg-detroit-cream border-y border-detroit-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div>
              <div className="text-2xl font-display text-detroit-green">203</div>
              <div className="text-sm text-gray-600">5-Star Reviews</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-detroit-gold/30" />
            <div>
              <div className="text-2xl font-display text-detroit-green">Same Day</div>
              <div className="text-sm text-gray-600">Turnaround Available</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-detroit-gold/30" />
            <div>
              <div className="text-2xl font-display text-detroit-green">$149</div>
              <div className="text-sm text-gray-600">Starting Price</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-detroit-gold/30" />
            <div>
              <div className="text-2xl font-display text-detroit-green">Live</div>
              <div className="text-sm text-gray-600">Image Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery - Horizontal Scroll on Mobile */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 font-light tracking-wide">
            Hundreds of Detroit&apos;s top business leaders, doctors, attorneys, artists, and authors trust Detroit Photography for their professional portraits.
          </p>
          
          {/* Mobile: Horizontal Scroll Cards - optimized images */}
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {portfolioImages.map((image, i) => (
                <div key={i} className="flex-none w-64 aspect-[3/4] relative rounded-lg overflow-hidden shadow-lg snap-start">
                  <Image 
                    src={image.src} 
                    alt={image.alt} 
                    fill
                    className="object-cover"
                    sizes="256px"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:block">
            <HeadshotsGallery images={portfolioImages} columns={4} />
          </div>
        </div>
      </section>

      {/* Testimonials - Rave Reviews Section */}
      <section className="py-16 md:py-24 bg-detroit-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-4">
            We get <span className="underline decoration-detroit-gold decoration-2 underline-offset-4">rave reviews</span>.
          </h2>
          <DynamicReviewCount />
          
          {/* Horizontal Scroll Cards with Arrow Buttons */}
          <div className="-mx-4 px-4 md:-mx-8 md:px-8">
            <ScrollableCards>
              {testimonials.map((testimonial, i) => (
                <div 
                  key={i} 
                  className="flex-none w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-[400px] bg-white rounded-xl shadow-lg overflow-hidden snap-center border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-[4/3] relative">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.alt} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 45vw, 400px"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl text-gray-900 mb-3">{testimonial.headline}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">"{testimonial.quote}"</p>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-detroit-gold text-detroit-gold" />
                      ))}
                    </div>
                    <p className="text-gray-900 font-medium">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </ScrollableCards>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Why Settle for Ordinary */}
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

      {/* Location Section */}
      <LocationSection />

      {/* The Choice for Savvy Clients - Comparison Table */}
      <section className="py-16 md:py-20 bg-detroit-cream">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-6">
            The choice for savvy clients
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            <strong>Our leading competitor charges twice our price</strong> for a 'basic' headshot session 
            with a 20-minute time cap and no wardrobe changes.
          </p>
          <p className="text-gray-600 text-lg mb-4">
            We do not offer a 'basic' package because we do not take 'basic' photos... ever (We're artists, after all). 
            We do not care who you are or what your budget is; when you walk into our studio, you will be treated like gold.
          </p>
          <p className="text-gray-700 font-medium text-lg mb-10">
            What's our secret? It's simple: We take great photos. Our clients love our photos, and they buy lots of them.
          </p>
          
          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 md:px-6 font-normal text-gray-500"></th>
                  <th className="text-center py-4 px-4 md:px-6 font-display text-sm md:text-lg text-detroit-green">Detroit Photography</th>
                  <th className="text-center py-4 px-4 md:px-6 font-normal text-gray-500 text-sm">Competitor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Google Reviews</td>
                  <td className="text-center py-4 px-4 md:px-6">
                    <span className="text-detroit-green font-bold">203</span>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-detroit-gold text-detroit-gold" />
                      ))}
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 md:px-6 text-gray-600 text-sm">171</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Price</td>
                  <td className="text-center py-4 px-4 md:px-6 text-detroit-green font-bold">$149</td>
                  <td className="text-center py-4 px-4 md:px-6 text-gray-600 text-sm">$300</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Session Time</td>
                  <td className="text-center py-4 px-4 md:px-6 text-detroit-green font-bold">Unlimited</td>
                  <td className="text-center py-4 px-4 md:px-6 text-gray-600 text-sm">20 min</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Wardrobe Changes</td>
                  <td className="text-center py-4 px-4 md:px-6 text-detroit-green font-bold">Unlimited</td>
                  <td className="text-center py-4 px-4 md:px-6 text-gray-600 text-sm">None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Excellence Made Easy Section - Horizontal Scroll on Mobile */}
      <section className="py-16 md:py-20 bg-white">
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
          
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                { icon: Camera, title: 'Unlimited Time', desc: 'No rushing. We work until we get it right, no matter how long it takes.' },
                { icon: Clock, title: 'Same-Day Delivery', desc: 'Need your photos fast? Same-day turnaround available for those who need it.' },
                { icon: Star, title: 'Satisfaction Guaranteed', desc: '203 five-star reviews. We don\'t stop until you love your photos.' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex-none w-64 bg-gray-50 p-6 rounded-lg snap-start text-center">
                    <div className="w-14 h-14 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-detroit-gold" />
                    </div>
                    <h3 className="font-display text-lg text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
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
                203 five-star reviews. We don't stop until you love your photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Checklist - Horizontal Scroll on Mobile */}
      <section className="py-16 md:py-20 bg-detroit-cream">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Every Session Includes
          </h2>
          
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {features.map((item, i) => (
                <div key={i} className="flex-none w-56 bg-white p-4 rounded-lg shadow snap-start">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                      <p className="text-gray-600 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {features.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Headshot Services - Internal Links for SEO */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl text-center text-gray-900 mb-4">
            Specialized Headshot Photography Services
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            We provide professional headshots tailored to your industry. Every session includes unlimited time, 
            wardrobe changes, and expert posing guidance.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/headshots/headshot-types/business-headshots-detroit"
              className="bg-white p-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-detroit-gold"
            >
              <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green mb-1">
                Business Headshots
              </h3>
              <p className="text-gray-600 text-sm">For professionals, entrepreneurs & teams</p>
            </Link>
            <Link 
              href="/headshots/headshot-types/executive-headshots-detroit"
              className="bg-white p-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-detroit-gold"
            >
              <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green mb-1">
                Executive Portraits
              </h3>
              <p className="text-gray-600 text-sm">C-suite & leadership photography</p>
            </Link>
            <Link 
              href="/headshots/headshot-types/lawyer-headshots-detroit"
              className="bg-white p-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-detroit-gold"
            >
              <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green mb-1">
                Attorney Headshots
              </h3>
              <p className="text-gray-600 text-sm">Law firm & legal professional photos</p>
            </Link>
            <Link 
              href="/headshots/headshot-types/doctor-headshots-detroit"
              className="bg-white p-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-detroit-gold"
            >
              <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green mb-1">
                Doctor Headshots
              </h3>
              <p className="text-gray-600 text-sm">Medical & healthcare professionals</p>
            </Link>
            <Link 
              href="/headshots/headshot-types/realtor-headshots-detroit"
              className="bg-white p-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-detroit-gold"
            >
              <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green mb-1">
                Realtor Headshots
              </h3>
              <p className="text-gray-600 text-sm">Real estate agent photography</p>
            </Link>
            <Link 
              href="/headshots/headshot-types/linkedin-headshots-detroit"
              className="bg-white p-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-detroit-gold"
            >
              <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green mb-1">
                LinkedIn Headshots
              </h3>
              <p className="text-gray-600 text-sm">Profile photos that get noticed</p>
            </Link>
            <Link 
              href="/headshots/headshot-types/actor-headshots-detroit"
              className="bg-white p-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-detroit-gold"
            >
              <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green mb-1">
                Actor Headshots
              </h3>
              <p className="text-gray-600 text-sm">Casting & performance photos</p>
            </Link>
            <Link 
              href="/headshots/headshot-types/dating-headshots-in-detroit"
              className="bg-white p-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-detroit-gold"
            >
              <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green mb-1">
                Dating Profile Photos
              </h3>
              <p className="text-gray-600 text-sm">Stand out on dating apps</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section with Form - Final Section (No Footer Below) */}
      <section id="pricing" className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              View Our Pricing
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Professional headshots starting at <span className="text-detroit-gold font-bold text-3xl">$149</span>
            </p>
            <p className="text-detroit-cream/60 text-sm mt-2">
              Includes unlimited time, wardrobe changes & backdrops
            </p>
          </div>
          <HubSpotForm emailOnly />
        </div>
      </section>
    </>
  )
}
