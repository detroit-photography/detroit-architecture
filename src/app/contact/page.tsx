import type { Metadata } from 'next'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Detroit Photography for professional headshots, corporate photography, and event photography in Detroit.',
}

export default function ContactPage() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Get in touch with us today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-display text-2xl text-gray-900 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-detroit-cream flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-detroit-green" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">
                    Detroit Photography<br />
                    Bagley Mansion<br />
                    2921 E Jefferson Ave<br />
                    Suite 101<br />
                    Detroit, MI 48207
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-detroit-cream flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-detroit-green" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                  <a href="tel:13133518244" className="text-detroit-green hover:text-detroit-gold">
                    (313) 351-8244
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-detroit-cream flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-detroit-green" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                  <a href="mailto:andrew@detroitphotography.com" className="text-detroit-green hover:text-detroit-gold">
                    andrew@detroitphotography.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-detroit-cream flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-detroit-green" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Hours</h3>
                  <p className="text-gray-600">
                    Monday - Sunday: 9:00 AM - 9:00 PM<br />
                    <span className="text-sm">(By appointment only)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Studio Image */}
            <div className="mt-12 relative h-64 md:h-80">
              <Image
                src="/images/headshots/bagley-mansion.jpg"
                alt="Bagley Mansion - Detroit Photography studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-display text-2xl text-gray-900 mb-8">Send a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                >
                  <option value="">Select a service</option>
                  <option value="headshots">Professional Headshots</option>
                  <option value="team">Team Photos</option>
                  <option value="event">Event Photography</option>
                  <option value="corporate">Corporate Photography</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-16 h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2950.8!2d-83.0176!3d42.3436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDIwJzM3LjAiTiA4M8KwMDEnMDMuNCJX!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Detroit Photography location"
          />
        </div>
      </div>
    </section>
  )
}
