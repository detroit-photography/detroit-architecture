'use client'

import { ReactNode } from 'react'
import { PricingModalProvider } from './PricingModal'

export function HomePageClient({ children }: { children: ReactNode }) {
  return (
    <PricingModalProvider>
      {children}
    </PricingModalProvider>
  )
}


