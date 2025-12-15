import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Branding Photography Pricing',
  description: 'Professional branding photography pricing in Detroit.',
}

export default function BrandingLandingPriceRedirectPage() {
  redirect('/branding-photography')
}





