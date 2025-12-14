import { Metadata } from 'next'
import { ArchitectureLayout } from '@/components/ArchitectureLayout'

export const metadata: Metadata = {
  title: 'Print Store | Detroit Architecture Repository',
  description: 'Purchase museum-quality prints of Detroit architecture photography. Professionally framed and signed by artist Andrew Petrov. Free shipping.',
  openGraph: {
    title: 'Detroit Architecture Print Store',
    description: 'Museum-quality prints of Detroit\'s historic architecture, professionally framed and signed.',
  },
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ArchitectureLayout>{children}</ArchitectureLayout>
}
