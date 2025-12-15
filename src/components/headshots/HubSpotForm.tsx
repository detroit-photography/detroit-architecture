'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface HubSpotFormProps {
  portalId?: string
  formId?: string
  className?: string
  emailOnly?: boolean
  redirectUrl?: string
  hideTitle?: boolean
  minimal?: boolean
}

export function HubSpotForm({
  portalId = '46684962',
  formId = 'c6bba37b-c155-4db4-b036-ca55ed47f5fc',
  className = '',
  emailOnly = false,
  redirectUrl,
  hideTitle = false,
  minimal = false,
}: HubSpotFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const fields = emailOnly 
        ? [{ name: 'email', value: email }]
        : [
            { name: 'email', value: email },
            { name: 'firstname', value: firstName },
            { name: 'lastname', value: lastName },
          ]

      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields,
            context: {
              pageUri: typeof window !== 'undefined' ? window.location.href : '',
              pageName: typeof document !== 'undefined' ? document.title : '',
            },
          }),
        }
      )

      if (response.ok) {
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          setIsSubmitted(true)
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`bg-detroit-cream p-8 text-center ${className}`}>
        <h3 className="font-display text-2xl text-detroit-green mb-4">
          Thanks for your interest!
        </h3>
        <p className="text-gray-600 mb-6">
          Check your email for our full pricing menu and booking link.
        </p>
        <a
          href="/book"
          className="inline-block bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors"
        >
          Book Now
        </a>
      </div>
    )
  }

  return (
    <div className={`${minimal ? '' : 'bg-detroit-cream p-8'} ${className}`}>
      {!hideTitle && (
        <>
          <h3 className="font-display text-2xl text-center text-gray-900 mb-2">
            View Our Pricing Menu
          </h3>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Enter your email to see our full menu of services with up-front pricing.
          </p>
        </>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!emailOnly && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold text-gray-900 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold text-gray-900 rounded"
                required
              />
            </div>
          </div>
        )}
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-detroit-gold text-gray-900 rounded"
            required
          />
        </div>
        
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-detroit-green text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-detroit-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {isSubmitting ? 'Submitting...' : 'See Pricing'}
        </button>
      </form>
      
      <p className="text-center text-gray-600 text-xs mt-4">
        {minimal 
          ? 'Enter your email to see our full menu of services with up-front pricing.'
          : 'We have same-day bookings and a live calendar with up-front pricing.'
        }
      </p>
    </div>
  )
}
