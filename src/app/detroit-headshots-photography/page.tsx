import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Detroit Headshots Photography | Professional Headshot Photographer',
  description: 'Professional headshot photography in Detroit. #1-rated studio with 200+ five-star reviews. Starting at $149. Book today!',
}

export default function DetroitHeadshotsPhotographyPage() {
  redirect('/headshot-photography-in-detroit')
}





