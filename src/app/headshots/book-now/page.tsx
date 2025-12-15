import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Book Now',
  description: 'Book your professional photography session at Detroit Photography.',
}

export default function BookNowRedirectPage() {
  redirect('/headshots/book')
}





