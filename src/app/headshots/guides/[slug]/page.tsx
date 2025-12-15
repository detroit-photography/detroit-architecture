import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { HeadshotsGallery } from '@/components/headshots/HeadshotsGallery'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'

// Define all guide pages
const guides: Record<string, { title: string; description: string; content: string }> = {
  'professional-headshots': {
    title: 'Professional Headshots in Detroit',
    description: 'Everything you need to know about getting professional headshots in Detroit. Tips, pricing, and what to expect.',
    content: `
      <h2>What Makes a Professional Headshot?</h2>
      <p>A professional headshot is more than just a photo of your face. It's a carefully crafted image that communicates your professionalism, approachability, and personal brand. Whether you're updating your LinkedIn profile, preparing for a job search, or building your business website, a quality headshot is essential.</p>
      
      <h2>Why Professional Headshots Matter</h2>
      <p>First impressions matter, especially in the digital age. Studies show that it takes only 7 seconds to form a first impression, and your headshot is often the first thing people see. A professional headshot can:</p>
      <ul>
        <li>Increase your LinkedIn profile views by up to 14x</li>
        <li>Build trust with potential clients and employers</li>
        <li>Establish your personal brand</li>
        <li>Show that you take your career seriously</li>
      </ul>
      
      <h2>What to Expect at Detroit Photography</h2>
      <p>At our studio in historic Bagley Mansion, you'll experience a relaxed, professional environment. Our sessions include:</p>
      <ul>
        <li>Unlimited time - no rushing</li>
        <li>Unlimited wardrobe changes</li>
        <li>Real-time photo review during the session</li>
        <li>Professional retouching</li>
        <li>Digital delivery within 24-48 hours</li>
      </ul>
    `,
  },
  'corporate-headshots': {
    title: 'Corporate Headshots in Detroit',
    description: 'Corporate headshot photography for Detroit businesses. Individual and team sessions available.',
    content: `
      <h2>Corporate Headshots for Detroit Businesses</h2>
      <p>Consistent, professional headshots are essential for any business that wants to present a polished image. Whether you need headshots for your leadership team, your entire company, or individual employees, we deliver quality results.</p>
      
      <h2>Why Consistent Corporate Headshots Matter</h2>
      <p>When your team's headshots are consistent in style, lighting, and background, it creates a cohesive brand image. This is especially important for:</p>
      <ul>
        <li>Company websites and "About Us" pages</li>
        <li>Marketing materials and press releases</li>
        <li>LinkedIn and professional profiles</li>
        <li>Internal directories and org charts</li>
      </ul>
      
      <h2>Our Corporate Headshot Services</h2>
      <p>We offer flexible options for businesses of all sizes:</p>
      <ul>
        <li>In-studio sessions at Bagley Mansion</li>
        <li>On-location sessions at your office</li>
        <li>Event booth setups for conferences</li>
        <li>Volume discounts for large teams</li>
      </ul>
    `,
  },
  'creative-headshots': {
    title: 'Creative Headshots in Detroit',
    description: 'Creative and artistic headshot photography in Detroit for actors, musicians, and creatives.',
    content: `
      <h2>Creative Headshots for Artists and Performers</h2>
      <p>Creative headshots go beyond the traditional corporate look to capture your unique personality and artistic vision. Perfect for actors, musicians, artists, and anyone who wants a headshot that stands out.</p>
      
      <h2>Who Needs Creative Headshots?</h2>
      <ul>
        <li>Actors and performers</li>
        <li>Musicians and artists</li>
        <li>Authors and speakers</li>
        <li>Entrepreneurs and creatives</li>
        <li>Anyone who wants something unique</li>
      </ul>
      
      <h2>Our Creative Approach</h2>
      <p>At Detroit Photography, we collaborate with you to create headshots that tell your story. Our historic Bagley Mansion studio provides unique backdrops, and we're always open to creative ideas.</p>
    `,
  },
  'team-headshot': {
    title: 'Team Headshots in Detroit',
    description: 'Team and group headshot photography for Detroit companies. Consistent quality for your entire team.',
    content: `
      <h2>Team Headshot Photography</h2>
      <p>Getting consistent, high-quality headshots for your entire team doesn't have to be a hassle. We specialize in efficient team photography that delivers great results without disrupting your workday.</p>
      
      <h2>How Team Sessions Work</h2>
      <p>We can photograph your team in two ways:</p>
      <ul>
        <li><strong>In-Studio:</strong> Team members visit our Bagley Mansion studio on a rotating schedule</li>
        <li><strong>On-Location:</strong> We bring our equipment to your office and set up a temporary studio</li>
      </ul>
      
      <h2>Pricing for Teams</h2>
      <p>We offer volume discounts for teams of 5 or more. Contact us for a custom quote based on your team size and needs.</p>
    `,
  },
}

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = guides[params.slug]
  
  if (!guide) {
    return { title: 'Page Not Found' }
  }

  return {
    title: guide.title,
    description: guide.description,
  }
}

const portfolioImages = [
  { src: '/images/headshots/hero-headshot.jpg', alt: 'Professional headshot' },
  { src: '/images/headshots/headshot-3.jpg', alt: 'Executive portrait' },
  { src: '/images/headshots/headshot-4.jpg', alt: 'Business headshot' },
  { src: '/images/headshots/headshot-6.jpg', alt: 'Corporate headshot' },
]

export default function GuidePage({ params }: Props) {
  const guide = guides[params.slug]

  if (!guide) {
    notFound()
  }

  return (
    <article className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-6">
            {guide.title}
          </h1>
          <p className="text-xl text-gray-600">
            {guide.description}
          </p>
        </header>

        {/* Gallery */}
        <div className="mb-12">
          <HeadshotsGallery images={portfolioImages} columns={4} />
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

        {/* CTA */}
        <div className="bg-detroit-cream p-8 text-center">
          <h2 className="font-display text-2xl text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Professional headshots starting at $149.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/headshots/book"
              className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/headshots/headshot-photography-in-detroit"
              className="inline-block border-2 border-detroit-green text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-green hover:text-white transition-colors"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 mt-16">
        <div className="bg-detroit-green p-8">
          <div className="text-center text-white mb-8">
            <h2 className="font-display text-2xl mb-2">View Our Pricing</h2>
            <p className="text-detroit-cream/80">Enter your email for instant access.</p>
          </div>
          <HubSpotForm />
        </div>
      </div>
    </article>
  )
}

