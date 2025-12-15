'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

interface InlineEmailFormProps {
  variant?: 'light' | 'dark'
}

export function InlineEmailForm({ variant = 'light' }: InlineEmailFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Submit to HubSpot
    try {
      const portalId = '48798724'
      const formId = 'e26e6b35-b052-4f51-b4c6-a3d76dc63f28'
      
      await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [{ name: 'email', value: email }],
          context: {
            pageUri: typeof window !== 'undefined' ? window.location.href : '',
            pageName: 'Homepage - Inline Form'
          }
        })
      })
      
      setIsSubmitted(true)
      // Redirect after brief success message
      setTimeout(() => {
        window.location.href = '/book'
      }, 1500)
    } catch {
      // Still redirect on error - form might have worked
      window.location.href = '/book'
    }
  }

  const isDark = variant === 'dark'

  if (isSubmitted) {
    return (
      <div className={`flex items-center justify-center gap-2 py-4 ${isDark ? 'text-white' : 'text-detroit-green'}`}>
        <Check className="w-5 h-5" />
        <span className="font-medium">Success! Redirecting to booking...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className={`flex-1 px-4 py-3 rounded text-base ${
          isDark 
            ? 'bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20' 
            : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400'
        } focus:outline-none focus:ring-2 focus:ring-detroit-gold`}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-6 py-3 font-bold uppercase tracking-wide text-sm rounded flex items-center justify-center gap-2 transition-colors ${
          isDark
            ? 'bg-white text-detroit-green hover:bg-detroit-gold hover:text-white'
            : 'bg-detroit-green text-white hover:bg-detroit-green/90'
        } disabled:opacity-50`}
      >
        {isSubmitting ? 'Sending...' : 'See Pricing'}
        {!isSubmitting && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  )
}
