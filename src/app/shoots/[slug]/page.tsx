import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { shoots, getShootBySlug } from '@/lib/shoots-data'
import { HeadshotsGallery } from '@/components/headshots/HeadshotsGallery'
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return shoots.map((shoot) => ({
    slug: shoot.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shoot = getShootBySlug(params.slug)
  
  if (!shoot) {
    return {
      title: 'Shoot Not Found',
    }
  }

  // Ensure OG image is an absolute URL
  const ogImage = shoot.coverImage?.startsWith('http') 
    ? shoot.coverImage 
    : `https://www.detroitphotography.com${shoot.coverImage}`

  return {
    title: shoot.title,
    description: shoot.description,
    openGraph: {
      title: shoot.title,
      description: shoot.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: shoot.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: shoot.title,
      description: shoot.description,
      images: [ogImage],
    },
  }
}

export default function ShootPage({ params }: Props) {
  const shoot = getShootBySlug(params.slug)

  if (!shoot) {
    notFound()
  }

  return (
    <article className="py-12 md:py-16">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <Link
          href="/shoots"
          className="inline-flex items-center gap-2 text-detroit-green hover:text-detroit-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 mb-12">
        <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-6">
          {shoot.title}
        </h1>
        
        <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-detroit-gold" />
            {shoot.date}
          </div>
          {shoot.location && (
            <Link
              href={`/building/${shoot.location}`}
              className="flex items-center gap-2 hover:text-detroit-gold transition-colors"
            >
              <MapPin className="w-5 h-5 text-detroit-gold" />
              {shoot.locationName}
            </Link>
          )}
        </div>

        <p className="text-lg text-gray-600 leading-relaxed">
          {shoot.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {shoot.tags.map((tag) => (
            <Link
              key={tag}
              href={`/shoots?tag=${tag}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-detroit-cream text-gray-700 text-sm hover:bg-detroit-gold hover:text-white transition-colors"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </Link>
          ))}
        </div>
      </header>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4">
        <HeadshotsGallery images={shoot.images} columns={3} />
      </div>

      {/* Location Link (if architecture location) */}
      {shoot.location && (
        <div className="max-w-4xl mx-auto px-4 mt-16">
          <div className="bg-detroit-cream p-8">
            <h2 className="font-display text-2xl text-gray-900 mb-4">
              Shot at {shoot.locationName}
            </h2>
            <p className="text-gray-600 mb-6">
              This shoot took place at one of Detroit's historic locations. 
              Learn more about the architecture and history of this building.
            </p>
            <Link
              href={`/building/${shoot.location}`}
              className="inline-block bg-detroit-green text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
            >
              View Building Details
            </Link>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 mt-16">
        <div className="bg-detroit-green p-8 text-center">
          <h2 className="font-display text-2xl text-white mb-4">
            Want photos like these?
          </h2>
          <p className="text-detroit-cream/80 mb-6">
            Book your session at our historic Bagley Mansion studio.
          </p>
          <Link
            href="/book"
            className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  )
}
