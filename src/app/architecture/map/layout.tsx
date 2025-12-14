import type { Metadata } from 'next'
import { ArchitectureLayout } from '@/components/ArchitectureLayout'

export const metadata: Metadata = {
  title: 'Interactive Map of Historic Detroit Buildings',
  description: 'Explore Detroit\'s architectural landmarks on an interactive map. Find historic buildings, Art Deco skyscrapers, and architectural gems throughout Metro Detroit with photos and detailed information.',
  keywords: [
    'Detroit architecture map',
    'Detroit historic buildings map',
    'Detroit landmarks map',
    'downtown Detroit architecture',
    'Detroit walking tour',
    'architectural tour Detroit',
  ],
  openGraph: {
    title: 'Interactive Map | Detroit Architecture Repository',
    description: 'Explore Detroit\'s architectural landmarks on an interactive map with original photography.',
  },
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ArchitectureLayout>{children}</ArchitectureLayout>
}


