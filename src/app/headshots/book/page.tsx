import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Book Your Headshot Session',
  description: 'Book your professional headshot session at Detroit Photography. In-studio and on-location options available. Starting at $149.',
}

export default function BookPage() {
  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-center text-gray-900 mb-8">
            Headshot pricing and booking
          </h1>
          
          {/* Acuity Scheduling Embed */}
          <div className="bg-white shadow-lg p-4 md:p-8">
            <iframe
              src="https://app.acuityscheduling.com/schedule.php?owner=17380279"
              title="Schedule Appointment"
              width="100%"
              height="800"
              frameBorder="0"
              className="min-h-[800px]"
            />
            <Script
              src="https://embed.acuityscheduling.com/js/embed.js"
              strategy="afterInteractive"
            />
          </div>

          {/* Pricing Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-detroit-cream p-8">
              <h3 className="font-display text-2xl text-gray-900 mb-4">In-studio headshot session</h3>
              <p className="text-3xl font-bold text-detroit-green mb-4">$149.00</p>
              <ul className="space-y-2 text-gray-600">
                <li>• One retouched headshot for $149</li>
                <li>• Unlimited time, wardrobe changes & backdrops</li>
                <li>• Buy additional images for just $99</li>
              </ul>
            </div>
            <div className="bg-detroit-cream p-8">
              <h3 className="font-display text-2xl text-gray-900 mb-4">On-location session</h3>
              <p className="text-3xl font-bold text-detroit-green mb-4">$299.00</p>
              <ul className="space-y-2 text-gray-600">
                <li>• One retouched image is included</li>
                <li>• Unlimited time, wardrobe changes & backdrops</li>
                <li>• Buy additional images for $149</li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Questions? Contact us directly:
            </p>
            <p className="text-lg">
              <a href="tel:13133518244" className="text-detroit-green hover:text-detroit-gold font-medium">
                (313) 351-8244
              </a>
              {' '} or {' '}
              <a href="mailto:andrew@detroitphotography.com" className="text-detroit-green hover:text-detroit-gold font-medium">
                andrew@detroitphotography.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
