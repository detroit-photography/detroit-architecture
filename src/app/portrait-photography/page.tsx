import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeadshotsGallery } from '@/components/headshots/HeadshotsGallery'

export const metadata: Metadata = {
  title: 'Portrait Photography in Detroit',
  description: 'Professional portrait photography in Detroit. Personal branding, lifestyle, family, and creative portraits at historic Bagley Mansion.',
}

const portraitImages = [
  { src: '/images/headshots/hero-headshot.jpg', alt: 'Professional portrait' },
  { src: '/images/headshots/headshot-3.jpg', alt: 'Creative portrait' },
  { src: '/images/headshots/headshot-6.jpg', alt: 'Lifestyle portrait' },
  { src: '/images/headshots/headshot-7.jpg', alt: 'Personal branding portrait' },
]

export default function PortraitPhotographyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            <div className="flex flex-col justify-center px-6 py-12 lg:py-24 lg:px-12">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
                Portrait Photography
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                More than just a headshot. Personal branding, lifestyle, and creative portrait 
                photography at our historic mansion studio or on location.
              </p>
              <div>
                <Link
                  href="/book"
                  className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
                >
                  Book a Session
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px]">
              <Image
                src="/images/headshot-3.jpg"
                alt="Portrait photography at Detroit Photography"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Types of Portraits */}
      <section className="py-16 md:py-24 bg-detroit-cream">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Portrait Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Personal Branding</h3>
              <p className="text-gray-600">
                Portraits that tell your story. Perfect for entrepreneurs, authors, speakers, and professionals 
                who need more than a traditional headshot.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Lifestyle Portraits</h3>
              <p className="text-gray-600">
                Natural, candid-style portraits that capture your personality. In our studio or at a 
                location meaningful to you.
              </p>
            </div>
            <div className="bg-white p-8">
              <h3 className="font-display text-xl text-gray-900 mb-4">Creative & Artistic</h3>
              <p className="text-gray-600">
                Fine art portraits with creative lighting, unique angles, and artistic direction. 
                For musicians, artists, and creatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-gray-900 mb-12">
            Portrait Portfolio
          </h2>
          <HeadshotsGallery images={portraitImages} columns={4} />
        </div>
      </section>

      {/* Location */}
      <section className="py-16 md:py-24 bg-detroit-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <Image
                src="/images/bagley-interior-3.jpg"
                alt="Bagley Mansion studio interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-6">
                A stunning backdrop for your portraits
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Our studio in the historic Bagley Mansion offers a unique setting for portrait photography. 
                The grand bay windows, carved fireplace, and historic details provide character and elegance 
                you won't find anywhere else.
              </p>
              <p className="text-gray-600 text-lg">
                We also offer on-location portrait sessions at outdoor locations, your home or office, 
                or anywhere that's meaningful to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
            Ready for your portrait session?
          </h2>
          <p className="text-detroit-cream/80 text-lg mb-8">
            Book a session at our studio or contact us for on-location portrait photography.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold hover:text-white transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-detroit-green transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
