import Image from 'next/image'
import Link from 'next/link'

interface HeadshotsHeroProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  imageSrc?: string
  imageAlt?: string
  showPricingForm?: boolean
}

export function HeadshotsHero({
  title,
  subtitle,
  ctaText = 'SEE PRICING',
  ctaHref = '/headshots/headshot-photography-in-detroit',
  imageSrc = '/images/headshots/hero-headshot.jpg',
  imageAlt = 'Professional headshot by Detroit Photography',
  showPricingForm = false,
}: HeadshotsHeroProps) {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          {/* Text Content */}
          <div className="flex flex-col justify-center px-6 py-12 lg:py-24 lg:px-12">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}
            {ctaText && ctaHref && (
              <div>
                <Link
                  href={ctaHref}
                  className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
                >
                  {ctaText}
                </Link>
              </div>
            )}
          </div>
          
          {/* Image */}
          <div className="relative h-[400px] lg:h-[600px]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
