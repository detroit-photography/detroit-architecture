import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Portrait Photographer in Detroit | Professional Portraits',
  description: 'Professional portrait photography in Detroit. 5-star rated studio at historic Bagley Mansion. Book today!',
}

export default function PortraitPhotographerRedirectPage() {
  redirect('/portrait-photography')
}





