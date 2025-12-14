import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Branding Photography in Detroit | Landing',
  description: 'Professional branding photography in Detroit.',
}

export default function BrandingPhotographyLandingRedirectPage() {
  redirect('/branding-photography')
}





