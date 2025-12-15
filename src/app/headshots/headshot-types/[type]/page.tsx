import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { TestimonialsSection } from '@/components/headshots/TestimonialsSection'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { Breadcrumbs } from '@/components/headshots/Breadcrumbs'
import { Star, Check, MapPin, Clock, Phone, Mail, ArrowRight } from 'lucide-react'

// URL typo redirects - these handle misspelled URLs from old site
const typoRedirects: Record<string, string> = {
  'company-headshots-in-detriot': 'company-headshots-in-detroit',
  'dating-headshots-in-detriot': 'dating-headshots-in-detroit',
}

// SEO-optimized headshot type pages based on Search Console data
const headshotTypes: Record<string, {
  title: string
  h1: string
  metaDescription: string
  description: string
  benefits: string[]
  keywords: string[]
}> = {
  'dating-headshots-in-detroit': {
    title: 'Dating Profile Photographer Detroit | Professional Dating Headshots',
    h1: 'Dating Profile Photographer in Detroit',
    metaDescription: 'Professional dating profile photos in Detroit. Stand out on Hinge, Bumble & Tinder. 5-star rated studio. Natural, confident photos that get more matches. Book today!',
    description: 'Make a great first impression with professional dating profile photos. Our relaxed sessions help you look natural, confident, and approachable—the key to getting more matches on dating apps.',
    benefits: [
      'Natural, approachable photos that attract matches',
      'Relaxed session - no awkward poses',
      'Multiple outfit changes included',
      'Photos optimized for Hinge, Bumble, Tinder',
      'Same-day turnaround available',
      'Expert posing guidance',
    ],
    keywords: ['dating profile photographer detroit', 'online dating photographer detroit', 'dating headshots detroit', 'tinder photos detroit', 'bumble photos detroit', 'hinge photos detroit'],
  },
  'doctor-headshots-detroit': {
    title: 'Doctor Headshots Detroit | Medical Professional Photography',
    h1: 'Doctor Headshots in Detroit',
    metaDescription: 'Professional headshots for doctors & medical professionals in Detroit. ERAS residency photos, hospital staff portraits. 5-star rated studio. Same-day delivery available.',
    description: 'Trust is everything in healthcare. A professional headshot helps patients feel confident in your care before they even meet you. We specialize in headshots for physicians, residents, and medical staff.',
    benefits: [
      'ERAS residency application photos',
      'Hospital & clinic staff portraits',
      'White coat or professional attire',
      'Same-day turnaround for urgent needs',
      'HIPAA-conscious studio environment',
      'Trusted by Detroit medical professionals',
    ],
    keywords: ['doctor headshots detroit', 'medical headshots detroit', 'physician headshots', 'eras headshots detroit', 'medical residency photos', 'healthcare headshots'],
  },
  'lawyer-headshots-detroit': {
    title: 'Lawyer Headshots Detroit | Attorney Portrait Photography',
    h1: 'Lawyer Headshots in Detroit',
    metaDescription: 'Professional headshots for attorneys in Detroit. Project confidence & expertise. 5-star rated studio trusted by Detroit law firms. Same-day delivery. Book now!',
    description: 'Your headshot is often the first impression potential clients have of you. Project the confidence, expertise, and approachability that wins clients and cases.',
    benefits: [
      'Project authority and trustworthiness',
      'Perfect for firm websites & LinkedIn',
      'Individual or full firm sessions',
      'Classic, timeless styling',
      'Same-day turnaround available',
      'Trusted by Detroit law firms',
    ],
    keywords: ['lawyer headshots detroit', 'attorney headshots detroit', 'law firm headshots', 'legal headshots detroit'],
  },
  'realtor-headshots-detroit': {
    title: 'Realtor Headshots Detroit | Real Estate Agent Photography',
    h1: 'Realtor Headshots in Detroit',
    metaDescription: 'Professional headshots for real estate agents in Detroit. Stand out in listings & marketing. 5-star rated studio. Approachable, trustworthy photos. Book today!',
    description: 'In real estate, your face is your brand. A professional headshot helps you stand out in a crowded market and builds instant trust with potential clients.',
    benefits: [
      'Stand out on Zillow, Realtor.com & MLS',
      'Approachable, trustworthy appearance',
      'Perfect for yard signs & business cards',
      'Multiple background options',
      'Same-day turnaround available',
      'Volume discounts for brokerages',
    ],
    keywords: ['realtor headshots detroit', 'real estate agent headshots', 'real estate photography detroit'],
  },
  'executive-headshots-detroit': {
    title: 'Executive Headshots Detroit | C-Suite Portrait Photography',
    h1: 'Executive Headshots in Detroit',
    metaDescription: 'Professional executive portraits in Detroit. Project leadership & vision. Trusted by Fortune 500 executives. 5-star rated studio. Book your session today.',
    description: 'Your executive portrait should communicate leadership, vision, and approachability. We create headshots that command respect while remaining personable.',
    benefits: [
      'Project leadership and authority',
      'Perfect for annual reports & PR',
      'Board room or studio settings',
      'Team consistency for C-suite',
      'Same-day turnaround available',
      'Trusted by Detroit executives',
    ],
    keywords: ['executive headshots detroit', 'ceo headshots detroit', 'c-suite portraits', 'corporate executive photography'],
  },
  'business-headshots-detroit': {
    title: 'Business Headshots Detroit | Professional Corporate Photos',
    h1: 'Business Headshots in Detroit',
    metaDescription: 'Professional business headshots in Detroit. 5-star rated studio with 181+ reviews. Unlimited time, wardrobe changes. Starting at $149. Book today!',
    description: 'Whether you\'re updating your LinkedIn, launching a new business, or refreshing your company website, a professional headshot makes all the difference.',
    benefits: [
      'Perfect for LinkedIn & company websites',
      'Unlimited time - no rushing',
      'Multiple wardrobe changes included',
      'Same-day turnaround available',
      'Volume discounts for teams',
      '181+ five-star reviews',
    ],
    keywords: ['business headshots detroit', 'corporate headshots detroit', 'professional headshots detroit', 'linkedin headshots detroit'],
  },
  'startup-headshots-in-detroit': {
    title: 'Startup Headshots Detroit | Team Photos for Startups',
    h1: 'Startup Headshots in Detroit',
    metaDescription: 'Professional team photos for Detroit startups. Build investor confidence. Modern, approachable style. Volume discounts. 5-star rated studio. Book today!',
    description: 'First impressions matter—especially when you\'re raising funds or building a brand. Professional team photos help establish credibility with investors, customers, and partners.',
    benefits: [
      'Build investor confidence',
      'Consistent team aesthetic',
      'Perfect for pitch decks & websites',
      'Volume discounts for teams',
      'Same-day turnaround available',
      'Modern, approachable style',
    ],
    keywords: ['startup headshots detroit', 'team photos startup', 'founder headshots', 'startup team photography'],
  },
  'author-headshots-in-detroit': {
    title: 'Author Headshots Detroit | Writer Portrait Photography',
    h1: 'Author Headshots in Detroit',
    metaDescription: 'Professional author headshots in Detroit. Perfect for book jackets, Amazon, & press. Creative, literary aesthetic. 5-star rated studio. Book today!',
    description: 'Your author photo appears on book jackets, Amazon, and in press materials. Make sure it captures your unique voice and connects with your readers.',
    benefits: [
      'Perfect for book jackets & Amazon',
      'Creative, literary aesthetic',
      'Multiple looks for different books',
      'High-resolution for print',
      'Same-day turnaround available',
      'Trusted by published authors',
    ],
    keywords: ['author headshots detroit', 'writer headshots', 'book jacket photos', 'author portrait photography'],
  },
  'actor-headshots-in-detroit': {
    title: 'Actor Headshots Detroit | Theatrical & Commercial Photos',
    h1: 'Actor Headshots in Detroit',
    metaDescription: 'Professional actor headshots in Detroit. Theatrical & commercial looks. Casting-ready photos that book work. 5-star rated studio. Book your session today!',
    description: 'Your headshot is your calling card. We create casting-ready photos that showcase your range and help you book the roles you want.',
    benefits: [
      'Theatrical & commercial looks',
      'Casting director approved',
      'Multiple expressions & characters',
      'High-resolution digital files',
      'Same-day turnaround available',
      'Trusted by Detroit actors',
    ],
    keywords: ['actor headshots detroit', 'acting headshots detroit', 'theatrical headshots', 'commercial headshots detroit'],
  },
  'conference-headshots': {
    title: 'Conference Headshots Detroit | Event Photo Booth Services',
    h1: 'Conference Headshots in Detroit',
    metaDescription: 'Professional headshots at your Detroit conference or event. On-site setup, instant delivery. Volume pricing for large events. 5-star rated. Book today!',
    description: 'Offer professional headshots as a value-add at your next conference or corporate event. We set up on-site and deliver photos instantly.',
    benefits: [
      'On-site setup at your venue',
      'Instant digital delivery',
      'Consistent, professional quality',
      'Volume pricing for large events',
      'Branded backdrops available',
      'Experienced event team',
    ],
    keywords: ['conference headshots detroit', 'event headshots', 'corporate event photography', 'trade show headshots'],
  },
  'ceo-headshots-detroit': {
    title: 'CEO Headshots Detroit | Executive Portrait Photography',
    h1: 'CEO Headshots in Detroit',
    metaDescription: 'Professional CEO portrait photography in Detroit. Command presence & authority. Trusted by Detroit CEOs & executives. 5-star rated studio. Book today.',
    description: 'Your CEO headshot should project leadership, vision, and approachability. We create portraits that command respect while remaining personable—perfect for annual reports, press, and investor materials.',
    benefits: [
      'Project authority and vision',
      'Perfect for annual reports & PR',
      'Magazine-quality portraits',
      'On-location or studio sessions',
      'Same-day turnaround available',
      'Trusted by Detroit executives',
    ],
    keywords: ['ceo headshots detroit', 'ceo portrait photography', 'executive portraits', 'leadership headshots'],
  },
  'commercial-headshots-detroit': {
    title: 'Commercial Headshots Detroit | Advertising Photography',
    h1: 'Commercial Headshots in Detroit',
    metaDescription: 'Professional commercial headshots in Detroit. Perfect for advertising, marketing & branding. 5-star rated studio. High-resolution files. Book today!',
    description: 'Commercial headshots designed for advertising, marketing materials, and brand campaigns. High-resolution files perfect for print and digital use.',
    benefits: [
      'Advertising-ready quality',
      'High-resolution files included',
      'Perfect for marketing materials',
      'Multiple looks per session',
      'Commercial usage rights',
      'Fast turnaround available',
    ],
    keywords: ['commercial headshots detroit', 'advertising photography detroit', 'marketing headshots', 'brand photography'],
  },
  'company-headshots-in-detroit': {
    title: 'Company Headshots Detroit | Corporate Team Photography',
    h1: 'Company Headshots in Detroit',
    metaDescription: 'Professional company headshots in Detroit. Consistent quality for your entire team. In-studio or on-location. Volume discounts. 5-star rated. Book today!',
    description: 'Consistent, professional headshots for your entire company. Whether you need 5 headshots or 500, we deliver quality results that present a unified brand image.',
    benefits: [
      'Consistent style across your team',
      'In-studio or on-location',
      'Volume discounts available',
      'Fast turnaround for large teams',
      'Perfect for websites & marketing',
      'Flexible scheduling options',
    ],
    keywords: ['company headshots detroit', 'corporate team photos', 'business team headshots', 'company portraits'],
  },
  'group-headshots-detroit': {
    title: 'Group Headshots Detroit | Team Photo Sessions',
    h1: 'Group Headshots in Detroit',
    metaDescription: 'Professional group headshot sessions in Detroit. Efficient team photography with consistent quality. Volume discounts. 5-star rated studio. Book today!',
    description: 'Efficient group headshot sessions designed to get your entire team professional photos without disrupting the workday. Consistent quality guaranteed.',
    benefits: [
      'Efficient session scheduling',
      'Consistent quality for all',
      'In-studio or on-location',
      'Volume discounts for 5+',
      'Same-day delivery available',
      'Minimal disruption to work',
    ],
    keywords: ['group headshots detroit', 'team headshots', 'group photo sessions', 'team photography detroit'],
  },
  'office-headshots-detroit': {
    title: 'Office Headshots Detroit | On-Location Corporate Photography',
    h1: 'Office Headshots in Detroit',
    metaDescription: 'Professional on-location headshots at your Detroit office. We bring the studio to you. Minimal disruption. Volume discounts. 5-star rated. Book today!',
    description: 'We bring our professional studio setup directly to your office. Minimal disruption, maximum convenience—your team gets professional headshots without leaving the building.',
    benefits: [
      'We come to your office',
      'Professional lighting setup',
      'Minimal disruption to work',
      'Consistent backgrounds',
      'Same-day delivery available',
      'Volume pricing for teams',
    ],
    keywords: ['office headshots detroit', 'on-location headshots', 'workplace photography', 'corporate photography detroit'],
  },
  'therapist-headshots-detroit': {
    title: 'Therapist Headshots Detroit | Mental Health Professional Photos',
    h1: 'Therapist Headshots in Detroit',
    metaDescription: 'Professional headshots for therapists & counselors in Detroit. Warm, approachable portraits that build client trust. 5-star rated studio. Book today!',
    description: 'Your headshot is often the first thing potential clients see. A warm, approachable portrait helps build trust before the first session—essential for therapists, counselors, and mental health professionals.',
    benefits: [
      'Warm, approachable aesthetic',
      'Build client trust instantly',
      'Perfect for Psychology Today',
      'Multiple background options',
      'Same-day delivery available',
      'Trusted by Detroit therapists',
    ],
    keywords: ['therapist headshots detroit', 'counselor headshots', 'mental health professional photos', 'psychology today headshots'],
  },
}

interface Props {
  params: { type: string }
}

export async function generateStaticParams() {
  // Include both valid types and typo redirects
  const allTypes = [
    ...Object.keys(headshotTypes),
    ...Object.keys(typoRedirects),
  ]
  return allTypes.map((type) => ({ type }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const typeData = headshotTypes[params.type]
  
  if (!typeData) {
    return { title: 'Page Not Found' }
  }

  return {
    title: typeData.title,
    description: typeData.metaDescription,
    keywords: [...typeData.keywords, 'detroit photographer', 'detroit photo studio', 'professional headshots detroit'],
    openGraph: {
      title: typeData.title,
      description: typeData.metaDescription,
      url: `https://www.detroitphotography.com/headshot-types/${params.type}`,
      images: [
        {
          url: 'https://www.detroitphotography.com/images/headshots/hero-headshot.jpg',
          width: 1200,
          height: 630,
          alt: typeData.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: typeData.title,
      description: typeData.metaDescription,
      images: ['https://www.detroitphotography.com/images/headshots/hero-headshot.jpg'],
    },
    alternates: {
      canonical: `https://www.detroitphotography.com/headshot-types/${params.type}`,
    },
  }
}

// Generate Schema.org structured data for each headshot type
function generateJsonLd(type: string, typeData: typeof headshotTypes[string]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: typeData.h1,
        description: typeData.description,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Detroit Photography',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '2921 E Jefferson Ave, Suite 101',
            addressLocality: 'Detroit',
            addressRegion: 'MI',
            postalCode: '48207',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '181',
          },
        },
        areaServed: {
          '@type': 'City',
          name: 'Detroit',
        },
        offers: {
          '@type': 'Offer',
          price: '149',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Detroit Photography',
            item: 'https://www.detroitphotography.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Professional Headshots',
            item: 'https://www.detroitphotography.com/headshot-photography-in-detroit',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: typeData.h1,
            item: `https://www.detroitphotography.com/headshot-types/${type}`,
          },
        ],
      },
    ],
  }
}

export default function HeadshotTypePage({ params }: Props) {
  // Handle typo redirects (e.g., "detriot" → "detroit")
  if (typoRedirects[params.type]) {
    redirect(`/headshots/headshot-types/${typoRedirects[params.type]}`)
  }

  const typeData = headshotTypes[params.type]

  if (!typeData) {
    notFound()
  }

  const jsonLd = generateJsonLd(params.type, typeData)
  
  // Get related headshot types for internal linking (exclude current)
  const relatedTypes = Object.entries(headshotTypes)
    .filter(([key]) => key !== params.type)
    .slice(0, 4)

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: 'Headshots', href: '/headshots/headshot-photography-in-detroit' },
              { label: typeData.h1 },
            ]} 
          />
        </div>
      </div>

      {/* Hero - Text focused, no images */}
      <section className="bg-detroit-green text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-detroit-gold/20 border border-detroit-gold px-4 py-2 mb-6">
            <Star className="w-4 h-4 fill-detroit-gold text-detroit-gold" />
            <span className="text-detroit-gold text-sm font-medium">Detroit's #1-Rated Studio • 181+ Five-Star Reviews</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            {typeData.h1}
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            {typeData.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-detroit-gold text-detroit-gold" />
                ))}
              </div>
              <span>181+ Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-detroit-gold" />
              <span>Same-Day Available</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-detroit-gold" />
              <span>Detroit, MI</span>
            </div>
          </div>
          
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
          
          <p className="mt-8 text-detroit-cream/70">
            Starting at <span className="text-detroit-gold font-bold text-2xl">$149</span>
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-detroit-cream">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            What's Included
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {typeData.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-6 shadow-sm">
                <Check className="w-6 h-6 text-detroit-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Text section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Why Detroit Photography?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-detroit-gold" />
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">5-Star Rated</h3>
              <p className="text-gray-600 text-sm">181+ five-star reviews from satisfied clients across Detroit.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-detroit-gold" />
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Same-Day Delivery</h3>
              <p className="text-gray-600 text-sm">Need your photos fast? Same-day turnaround available.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-detroit-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-detroit-gold" />
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Historic Location</h3>
              <p className="text-gray-600 text-sm">Our studio is located at the 1889 Bagley Mansion in Midtown.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing CTA with Form */}
      <section id="pricing" className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              View Our Pricing
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Professional headshots starting at <span className="text-detroit-gold font-bold text-3xl">$149</span>
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-12">
            Ready to Book?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-detroit-cream p-8 text-center">
              <Phone className="w-10 h-10 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-2">Call Us</h3>
              <a href="tel:13133518244" className="text-detroit-green text-xl font-medium hover:text-detroit-gold transition-colors">
                (313) 351-8244
              </a>
              <p className="text-gray-600 text-sm mt-2">Mon-Sat, 9am-6pm</p>
            </div>
            <div className="bg-detroit-cream p-8 text-center">
              <Mail className="w-10 h-10 text-detroit-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-900 mb-2">Email Us</h3>
              <a href="mailto:andrew@detroitphotography.com" className="text-detroit-green text-xl font-medium hover:text-detroit-gold transition-colors">
                andrew@detroitphotography.com
              </a>
              <p className="text-gray-600 text-sm mt-2">Usually responds within 2 hours</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/headshots/book"
              className="inline-block bg-detroit-green text-white px-12 py-5 text-lg uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
            >
              Book Your Session Online
            </Link>
          </div>
        </div>
      </section>

      {/* Related Headshot Types - Internal Linking for SEO */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-2xl text-center text-gray-900 mb-8">
            Other Professional Headshot Services in Detroit
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTypes.map(([key, data]) => (
              <Link 
                key={key}
                href={`/headshots/headshot-types/${key}`}
                className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <h3 className="font-display text-lg text-gray-900 group-hover:text-detroit-green transition-colors mb-2">
                  {data.h1}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {data.description.slice(0, 80)}...
                </p>
                <span className="text-detroit-green text-sm font-medium flex items-center group-hover:text-detroit-gold transition-colors">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/headshots/headshot-photography-in-detroit"
              className="text-detroit-green font-medium hover:text-detroit-gold transition-colors underline"
            >
              View All Headshot Photography Services →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

