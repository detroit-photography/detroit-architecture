import type { Metadata } from 'next'
import { ArchitectureLayout } from '@/components/ArchitectureLayout'

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Administration panel for Detroit Architecture Repository. Manage building photos and content.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ArchitectureLayout>{children}</ArchitectureLayout>
}


