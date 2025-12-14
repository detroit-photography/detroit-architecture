import Image from 'next/image'
import { Star } from 'lucide-react'

export function SocialProofSection() {
  return (
    <section className="py-12 md:py-16 bg-detroit-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl text-gray-900 mb-4">
            Detroit Photography has <span className="text-detroit-green">more five-star Google reviews</span> than any other photographer in Detroit.
          </h2>
          <p className="text-gray-600 text-lg">
            Hundreds of Detroit's top <strong>business leaders, doctors, attorneys, artists</strong>, and <strong>authors</strong> trust Detroit Photography for their professional portraits.
          </p>
        </div>

        {/* Google Reviews Badge */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-6 shadow-lg inline-flex items-center gap-4">
            <div className="text-center">
              <div className="flex gap-1 justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="font-bold text-2xl text-gray-900">181</p>
              <p className="text-sm text-gray-500">Google Reviews</p>
            </div>
          </div>
        </div>

        {/* Featured In */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">Featured in Detroit's leading publications</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="font-display text-xl text-gray-700">Detroit Free Press</span>
            <span className="font-display text-xl text-gray-700">Hour Detroit</span>
            <span className="font-display text-xl text-gray-700">Crain's Detroit</span>
            <span className="font-display text-xl text-gray-700">MLive</span>
          </div>
        </div>

        {/* Trusted By */}
        <div className="mt-12 text-center">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">Trusted by Detroit's leading institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="font-display text-lg text-gray-700">Henry Ford Health</span>
            <span className="font-display text-lg text-gray-700">Quicken Loans</span>
            <span className="font-display text-lg text-gray-700">Blue Cross</span>
            <span className="font-display text-lg text-gray-700">DTE Energy</span>
          </div>
        </div>
      </div>
    </section>
  )
}
