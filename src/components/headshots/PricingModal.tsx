'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { X, Star } from 'lucide-react'
import { HubSpotForm } from './HubSpotForm'
import { GoogleIcon } from './GoogleIcon'

// Context for modal state
interface PricingModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const PricingModalContext = createContext<PricingModalContextType | null>(null)

export function usePricingModal() {
  const context = useContext(PricingModalContext)
  // Return a fallback that scrolls to #pricing if not in provider
  if (!context) {
    return {
      isOpen: false,
      openModal: () => {
        // Fallback: scroll to pricing section
        const pricingSection = document.getElementById('pricing')
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.location.href = '#pricing'
        }
      },
      closeModal: () => {},
    }
  }
  return context
}

// Provider component
export function PricingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])

  // Clean up overflow on unmount or page navigation (fixes iOS scroll lock after redirect)
  useEffect(() => {
    const resetOverflow = () => {
      document.body.style.overflow = ''
    }

    // Reset on page visibility change (covers iOS navigation)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        resetOverflow()
      }
    }

    // Reset on pagehide (more reliable for iOS)
    window.addEventListener('pagehide', resetOverflow)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup on unmount
    return () => {
      resetOverflow()
      window.removeEventListener('pagehide', resetOverflow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <PricingModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && <PricingModalContent onClose={closeModal} />}
    </PricingModalContext.Provider>
  )
}

// The actual modal content
function PricingModalContent({ onClose }: { onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-detroit-green text-white p-6 pb-8 rounded-t-xl">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-detroit-gold text-detroit-gold" />
            ))}
            <span className="text-sm text-detroit-cream/80 ml-2 flex items-center gap-1">
              203 reviews on <GoogleIcon className="w-4 h-4" />
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-center mb-2">
            View Our Pricing Menu
          </h2>
          <p className="text-center text-detroit-cream/90">
            Professional headshots starting at{' '}
            <span className="text-detroit-gold font-bold text-2xl">$149</span>
          </p>
          <p className="text-center text-detroit-cream/70 text-sm mt-2">
            Unlimited time • Unlimited wardrobe changes • Multiple backdrops
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <HubSpotForm emailOnly redirectUrl="/book" hideTitle minimal />
        </div>
      </div>
    </div>
  )
}

// Button component that triggers the modal
interface PricingButtonProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'white' | 'outline'
}

export function PricingButton({ children, className = '', variant = 'primary' }: PricingButtonProps) {
  const { openModal } = usePricingModal()

  const baseStyles = 'inline-flex items-center justify-center gap-2 uppercase tracking-wider font-bold transition-colors cursor-pointer'
  
  const variantStyles = {
    primary: 'bg-detroit-green text-white hover:bg-detroit-green/90',
    white: 'bg-white text-detroit-green hover:bg-detroit-gold hover:text-white shadow-lg',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-detroit-green',
  }

  return (
    <button
      onClick={openModal}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

