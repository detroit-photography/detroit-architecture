import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Detroit Branding Photography | Personal Brand Photographer',
  description: 'Professional branding photography in Detroit. Build your personal brand with stunning visuals. 5-star rated studio. Book today!',
}

export default function DetroitBrandingPhotographyPage() {
  redirect('/branding-photography')
}





