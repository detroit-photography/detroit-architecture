import type { Metadata } from 'next'
import Script from 'next/script'
import { Phone, MapPin, Clock, Camera, Shirt, Palette, Sparkles, Eye, HelpCircle } from 'lucide-react'
import { GoogleReviewsSection } from '@/components/headshots/GoogleReviewsSection'

export const metadata: Metadata = {
  title: 'Book Your Headshot Session | Detroit Photography',
  description: 'Book your professional headshot session at Detroit Photography. In-studio and on-location options available. Starting at $149. Same-day delivery available.',
}

const faqs = [
  {
    question: "How quickly will I get my images?",
    answer: "We guarantee delivery of all headshot sessions within 24 hours. Larger sessions with over five images will be delivered within 48 hours."
  },
  {
    question: "How many photos are taken in each session?",
    answer: "We typically take at least 50 photos in our headshot sessions. We have no limit on the number of photos we take, and you only buy the ones you love!"
  },
  {
    question: "How many images are delivered per session?",
    answer: "Your booking fee includes one delivered image. Each additional delivered studio image is $99, and you can buy as many as you like! We do image selection at the end of each session and you only buy the images you love!"
  },
  {
    question: "How many outfits can I bring?",
    answer: "We have private changing facilities on-site. We have unlimited wardrobe changes in each session! Our pricing is only by delivered image, so bring as many outfits as you like!"
  },
  {
    question: "What if I'm not \"photogenic?\"",
    answer: "Being \"photogenic\" is a coachable skill. As professional portrait photographers, making people look \"photogenic\" through friendly, encouraging, and experienced coaching is our bread and butter!"
  },
  {
    question: "How many backdrops are included in each shoot?",
    answer: "There is no limit to how many backdrops we can shoot per session. In addition to standard black, white, and grey paper backdrops, we offer a range of artistic painted canvas backdrops custom-made for our studio."
  },
  {
    question: "What if I hate getting my photo taken?",
    answer: "If you hate getting your photo taken, it's probably because your experience with photography has been without the benefit of experienced coaching and live image review. Our proven coaching methods make it so that EVERYONE loves having their picture taken and looks friendly and confident in their images."
  },
  {
    question: "Can I see my photos in real time?",
    answer: "Yes! You will immediately see all images we take on a large screen. Not only that, but we use live retouching software, so you can see a preview of your retouched images in real time!"
  },
  {
    question: "What kind of retouching is included?",
    answer: "Our retouching is completely based on our clients' preferences. While we specialize in highly natural and realistic retouching, we can change almost anything about an image in post-production."
  },
  {
    question: "Will you help me pose?",
    answer: "Yes! We will guide you every step of the way to getting the perfect set of images! We are experienced posing coaches and know how to bring out the best side of every client!"
  },
  {
    question: "What is your studio like?",
    answer: "Our studio is located on the second floor of a historic brick Tudor home in Detroit's Russell Woods neighborhood. Our in-home setting provides a relaxed atmosphere and a bespoke feel. We are the best-equipped headshot studio in Detroit, offering full wireless RGB lighting, state-of-the-art AI-powered retouching, and a huge selection of high-end, electronically-controlled backdrops."
  }
]

export default function BookPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-center text-gray-900 mb-4">
            Headshot pricing and booking
          </h1>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your professional headshot session online. Same-day appointments often available.
          </p>
          
          {/* Acuity Scheduling Embed */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <iframe
              src="https://app.acuityscheduling.com/schedule.php?owner=27530601&ref=embedded_csp"
              title="Schedule Appointment"
              width="100%"
              height="800"
              frameBorder="0"
              allow="payment"
              className="min-h-[800px]"
            />
            <Script
              src="https://embed.acuityscheduling.com/js/embed.js"
              strategy="afterInteractive"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-detroit-cream p-8 rounded-lg">
              <h3 className="font-display text-2xl text-gray-900 mb-4">In-studio headshot session</h3>
              <p className="text-4xl font-bold text-detroit-green mb-4">$149.00</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Camera className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>One retouched headshot included</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>Unlimited time in studio</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shirt className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>Unlimited wardrobe changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Palette className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>Unlimited backdrop options</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>Additional images just $99 each</span>
                </li>
              </ul>
            </div>
            <div className="bg-detroit-cream p-8 rounded-lg">
              <h3 className="font-display text-2xl text-gray-900 mb-4">On-location session</h3>
              <p className="text-4xl font-bold text-detroit-green mb-4">$299.00</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Camera className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>One retouched image included</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>We come to your office or location</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>Unlimited time on location</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shirt className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>Unlimited wardrobe changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-detroit-gold mt-0.5 flex-shrink-0" />
                  <span>Additional images $149 each</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-8">Our Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2946.8!2d-83.0194721!3d42.3400136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDIwJzI0LjAiTiA4M8KwMDEnMTAuMSJX!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Studio Location"
                />
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl text-gray-900 mb-4">Detroit Photography Studio</h3>
              <p className="text-gray-600 mb-4">
                Our studio is located on the second floor of a historic brick Tudor home in Detroit's Russell Woods neighborhood.
              </p>
              <p className="text-gray-600 mb-4">
                Our in-home setting provides a relaxed atmosphere and a bespoke feel.
              </p>
              <div className="flex items-center gap-2 text-detroit-green">
                <MapPin className="w-5 h-5" />
                <span>Russell Woods, Detroit, MI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviewsSection />

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-gray-50 rounded-lg overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                  <h3 className="font-display text-lg text-gray-900 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-detroit-gold flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <span className="text-detroit-gold text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 pl-8">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-detroit-green text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl mb-4">Have questions? Call or text us now!</h2>
          <a
            href="tel:13133518244"
            className="inline-flex items-center gap-3 text-4xl md:text-5xl font-bold text-detroit-gold hover:text-white transition-colors"
          >
            <Phone className="w-10 h-10" />
            1-313-351-8244
          </a>
          <p className="mt-6 text-gray-300">
            Or email us at{' '}
            <a href="mailto:andrew@detroitphotography.com" className="text-detroit-gold hover:text-white underline">
              andrew@detroitphotography.com
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
