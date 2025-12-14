import Image from 'next/image'
import { Star } from 'lucide-react'

interface Testimonial {
  quote: string
  author: string
  role: string
  imageSrc?: string
}

const testimonials: Testimonial[] = [
  {
    quote: "I had a great experience with Andrew. As soon as I booked the appointment, he called me to align on my needs and expectations. During the photo shoot, he made me feel at ease and he took a lot of really good shots. It was hard to choose just a few. The editing process was really quick and even when I requested additional adjustments, he did them right away and made sure I was happy with the results. I'd highly recommend Andrew!",
    author: "Associate Partner",
    role: "IBM",
  },
  {
    quote: "Andrew is an absolutely fantastic photographer. He is able to capture a variety of photos that tell a true 'story' through different lenses, angles, and lighting. I would 100% recommend Rocketa Industries to anyone who is looking for top-notch work.",
    author: "Hannah Wetherholt",
    role: "Classical musician",
  },
  {
    quote: "Absolutely phenomenal experience and the photos were fantastic. Professional, courteous, great vision. Would highly recommend.",
    author: "Jacqueline Williams",
    role: "Evolve Foundation",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-detroit-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
            We get rave reviews
          </h2>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-detroit-gold text-detroit-gold" />
            ))}
          </div>
          <p className="text-gray-600">181+ five-star Google reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 shadow-lg"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-detroit-gold text-detroit-gold" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-medium text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
