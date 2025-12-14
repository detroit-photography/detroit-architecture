import Link from 'next/link'
import { Check, X } from 'lucide-react'

export function PricingSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
            Our prices are <span className="text-detroit-gold">UNBELIEVABLE</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Professional headshots starting at
          </p>
          <p className="font-display text-6xl md:text-7xl text-detroit-green mt-4">
            $149
          </p>
          <p className="text-gray-500 uppercase tracking-wider text-sm mt-2">
            Flat-rate, all inclusive
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-detroit-cream rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-detroit-green text-white text-sm uppercase tracking-wider">
              <div className="p-4"></div>
              <div className="p-4 text-center font-medium">Detroit Photography</div>
              <div className="p-4 text-center">Our leading competitor</div>
            </div>
            
            <div className="grid grid-cols-3 border-b border-detroit-green/10">
              <div className="p-4 text-gray-700">Google Reviews</div>
              <div className="p-4 text-center font-bold text-detroit-green">181 ⭐⭐⭐⭐⭐</div>
              <div className="p-4 text-center text-gray-500">171</div>
            </div>
            
            <div className="grid grid-cols-3 border-b border-detroit-green/10">
              <div className="p-4 text-gray-700">Price</div>
              <div className="p-4 text-center font-bold text-detroit-green">$149</div>
              <div className="p-4 text-center text-gray-500">$300</div>
            </div>
            
            <div className="grid grid-cols-3 border-b border-detroit-green/10">
              <div className="p-4 text-gray-700">Session Time</div>
              <div className="p-4 text-center font-bold text-detroit-green">Unlimited</div>
              <div className="p-4 text-center text-gray-500">20 minutes</div>
            </div>
            
            <div className="grid grid-cols-3">
              <div className="p-4 text-gray-700">Wardrobe Changes</div>
              <div className="p-4 text-center font-bold text-detroit-green">Unlimited</div>
              <div className="p-4 text-center text-gray-500">None</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl text-gray-900 mb-4">It's time to stand out</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>Our headshot photographers will coach you on how <strong>to feel amazing</strong> in front of the camera.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>You will see your photos in <strong>real-time</strong> during the shoot, and can preview final edits!</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>Select images for <strong>magazine-quality retouching</strong> with our expert visual artists.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-detroit-gold flex-shrink-0 mt-0.5" />
                  <span>Your files are delivered within <strong>24-48 hours</strong> in your personal digital gallery.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-gray-600 mb-6">
                We make <strong className="text-detroit-green">LUXURY</strong> photography accessible to <strong className="text-detroit-green">EVERYONE</strong>
              </p>
              <p className="text-gray-500 text-sm mb-6">
                We have the <strong>lowest prices</strong> and the <strong>highest quality</strong> because we're <strong>faster, more tech-savvy, and more efficient</strong>.
              </p>
              <Link
                href="/headshots/book"
                className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
