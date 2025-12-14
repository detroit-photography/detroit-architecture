import type { Metadata } from 'next'
import Link from 'next/link'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { MapPin, Camera, Sun, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The Straits Photography Guide | Best Photo Locations',
  description: 'Complete guide to photography at The Straits of Mackinac. Best locations, timing, and tips for stunning photos in Northern Michigan.',
}

export default function TheStraitsGuidePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-detroit-green text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            The Straits Photography Guide
          </h1>
          
          <p className="text-xl text-detroit-cream/90 mb-8 max-w-2xl mx-auto">
            Your complete guide to capturing stunning photos at The Straits of Mackinac.
          </p>
        </div>
      </section>

      {/* Best Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-gray-900 mb-8">
            <MapPin className="w-8 h-8 text-detroit-gold inline mr-3" />
            Best Photo Locations
          </h2>
          <div className="prose prose-lg">
            <ul>
              <li><strong>Mackinac Bridge Viewpoints</strong> - Multiple spots offer stunning views of the iconic bridge</li>
              <li><strong>Colonial Michilimackinac</strong> - Historic fort with beautiful Lake Michigan backdrop</li>
              <li><strong>Mackinac Island</strong> - Horse-drawn carriages, Victorian architecture, and natural beauty</li>
              <li><strong>Headlands Dark Sky Park</strong> - Perfect for night photography and sunsets</li>
              <li><strong>St. Ignace Boardwalk</strong> - Great for golden hour portraits</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Times */}
      <section className="py-16 bg-detroit-cream">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-gray-900 mb-8">
            <Clock className="w-8 h-8 text-detroit-gold inline mr-3" />
            Best Times to Shoot
          </h2>
          <div className="prose prose-lg">
            <ul>
              <li><strong>Golden Hour</strong> - 1-2 hours before sunset for warm, flattering light</li>
              <li><strong>Blue Hour</strong> - Just after sunset for dramatic bridge photos</li>
              <li><strong>Early Morning</strong> - Fewer crowds and beautiful mist on the water</li>
              <li><strong>Summer Months</strong> - Best weather and longest days</li>
              <li><strong>Fall Colors</strong> - Late September through October for autumn foliage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Photography Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-gray-900 mb-8">
            <Camera className="w-8 h-8 text-detroit-gold inline mr-3" />
            Photography Tips
          </h2>
          <div className="prose prose-lg">
            <ul>
              <li><strong>Bring layers</strong> - Weather can change quickly near the water</li>
              <li><strong>Use a polarizing filter</strong> - Reduces glare and enhances blue skies</li>
              <li><strong>Consider a tripod</strong> - Essential for long exposures of the bridge at night</li>
              <li><strong>Book early</strong> - Popular times fill up fast, especially on Mackinac Island</li>
              <li><strong>Check ferry schedules</strong> - Plan around ferry times if shooting on the island</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-detroit-green">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Book Your Straits Session
            </h2>
            <p className="text-detroit-cream/80 text-lg">
              Let us capture your memories at this beautiful destination.
            </p>
          </div>
          <HubSpotForm />
        </div>
      </section>
    </>
  )
}





