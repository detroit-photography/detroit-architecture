'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

interface InlineEmailFormProps {
  portalId?: string
  formId?: string
  className?: string
  buttonText?: string
  placeholder?: string
  redirectUrl?: string
  variant?: 'hero' | 'inline' | 'dark'
}

export function InlineEmailForm({
  portalId = '46684962',
  formId = 'c6bba37b-c155-4db4-b036-ca55ed47f5fc',
  className = '',
  buttonText = 'Get Pricing',
  placeholder = 'Enter your email',
  redirectUrl = '/book',
  variant = 'hero',
}: InlineEmailFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [{ name: 'email', value: email }],
            context: {
              pageUri: typeof window !== 'undefined' ? window.location.href : '',
              pageName: typeof document !== 'undefined' ? document.title : '',
            },
          }),
        }
      )

      if (response.ok) {
        router.push(redirectUrl)
      } else {
        const data = await response.json()
        setError(data.message || 'Something went wrong.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const baseInputStyles = 'flex-1 px-4 py-3 border-0 focus:outline-none focus:ring-2 text-gray-900'
  const baseButtonStyles = 'px-6 py-3 font-semibold uppercase tracking-wide text-sm flex items-center gap-2 transition-colors disabled:opacity-50'
  
  const variantStyles = {
    hero: {
      container: 'bg-white rounded-lg shadow-xl overflow-hidden',
      input: `${baseInputStyles} focus:ring-detroit-gold`,
      button: `${baseButtonStyles} bg-detroit-gold text-white hover:bg-detroit-green`,
    },
    inline: {
      container: 'bg-gray-100 rounded-lg overflow-hidden',
      input: `${baseInputStyles} bg-transparent focus:ring-detroit-gold`,
      button: `${baseButtonStyles} bg-detroit-green text-white hover:bg-detroit-gold`,
    },
    dark: {
      container: 'bg-white/10 backdrop-blur rounded-lg overflow-hidden border border-white/20',
      input: `${baseInputStyles} bg-transparent text-white placeholder:text-white/60 focus:ring-detroit-gold`,
      button: `${baseButtonStyles} bg-detroit-gold text-white hover:bg-white hover:text-detroit-green`,
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row ${styles.container}`}>
        <input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.button}
        >
          {isSubmitting ? 'Sending...' : buttonText}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}


