'use client'

import Image from 'next/image'
import { Building2, Newspaper } from 'lucide-react'

const publications = [
  {
    name: 'Detroit Free Press',
    description: 'Featured photographer for Detroit Symphony Orchestra coverage',
  },
  {
    name: 'Metro Times',
    description: 'The Straits: A photography exhibition by Andrew Petrov',
  },
]

const institutions = [
  {
    name: 'City of Detroit',
    description: 'Official photographer for city events and leadership portraits',
  },
  {
    name: 'Detroit Symphony Orchestra',
    description: 'Event and promotional photography',
  },
]

export function CredibilitySection() {
  return (
    <>
      {/* Featured in Publications */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl text-center text-gray-900 mb-8">
            Featured in Detroit's <span className="underline decoration-detroit-gold decoration-2 underline-offset-4">leading publications</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publications.map((pub, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-detroit-green rounded-full flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-gray-900 mb-1">{pub.name}</h3>
                  <p className="text-gray-600 text-sm">{pub.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Institutions */}
      <section className="py-12 bg-detroit-cream">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl text-center text-gray-900 mb-8">
            Trusted by Detroit's <span className="underline decoration-detroit-gold decoration-2 underline-offset-4">leading institutions</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {institutions.map((inst, index) => (
              <div key={index} className="bg-white rounded-lg p-6 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 bg-detroit-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-detroit-green" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-gray-900 mb-1">{inst.name}</h3>
                  <p className="text-gray-600 text-sm">{inst.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
