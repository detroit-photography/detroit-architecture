import { Metadata } from 'next'
import { ArchitectureLayout } from '@/components/ArchitectureLayout'

export const metadata: Metadata = {
  title: 'Print Store | Detroit Architecture Repository',
  description: 'Purchase museum-quality prints of Detroit architecture photography. Professionally framed and signed by artist Andrew Petrov. Free shipping.',
  openGraph: {
    title: 'Detroit Architecture Print Store',
    description: 'Museum-quality prints of Detroit\'s historic architecture, professionally framed and signed.',
    images: [
      {
        url: 'https://qjxuiljsgrmymeayoqzi.supabase.co/storage/v1/object/public/photos/buildings/guardian-building.jpg',
        width: 1200,
        height: 630,
        alt: 'Detroit Architecture Print Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detroit Architecture Print Store',
    description: 'Museum-quality prints of Detroit\'s historic architecture.',
    images: ['https://qjxuiljsgrmymeayoqzi.supabase.co/storage/v1/object/public/photos/buildings/guardian-building.jpg'],
  },
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ArchitectureLayout>{children}</ArchitectureLayout>
}
